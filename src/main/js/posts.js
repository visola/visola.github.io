var fs = require('fs');
var markdown = require('./markdown.js');
var mkdirp = require('mkdirp');
var Q = require('q');
var winston = require('winston');
var templates = require('./templates.js');

var outDir = null;
var inputDir;
var posts = [];
var postsDir = 'posts/';

function addPost (filename, path) {
  var indexOfSpace = filename.indexOf(' '),
    post = {};

  post.file = path;
  post.date = filename.substr(0, indexOfSpace);
  post.title = filename.substr(indexOfSpace + 1, filename.length).replace(/\.md$/,'');

  posts.push(post);
  return post;
}

function loadMarkdown(post) {
  var deferred = Q.defer();
  fs.readFile(post.file, function (err, content) {
    var indexOfMore;

    if (err) {
      winston.error("Error while loading markdown from '%s'", post.file, err);
      deferred.reject(err);
      return;
    }

    winston.debug("Markdown loaded for '%s'", post.file);

    post.markdown = content.toString();
    post.html = markdown.render(post.markdown);

    indexOfMore = post.html.indexOf('<!-- more -->');
    post.summary = post.html.substr(0, indexOfMore);
    post.rendered = templates.get(inputDir, 'post')({post:post});

    deferred.resolve(post);
  });
  return deferred.promise;
}

function processPostsDirectory(files) {
  var i, path,
    promisses = [];

  for (i = 0; i < files.length; i++) {
    path = postsDir+files[i];
    winston.verbose("Processing file '%s'", path);
    promisses.push(loadMarkdown(addPost(files[i], path)).then(writePost));
  }

  return Q.all(promisses);
}

function sortPosts(p1, p2) {
  return p2.date.localeCompare(p1.date);
}

function writePost(post) {
  var renderedPost,
    deferred = Q.defer(),
    postDir = post.date.replace(/-/ig,'/')+'/',
    pathToPost = postDir+post.title+'.html';

  post.path = pathToPost;

  winston.debug("Ensuring directory: '%s'", outDir+postDir);
  mkdirp(outDir+postDir, function (err) {
    if (err) {
      winston.error("Error while creating directories: '%s'", outDir+postDir, err);
      deferred.reject(err);
      return;
    }

    winston.debug("Writing post: '%s'", outDir+pathToPost);
    fs.writeFile(outDir+pathToPost, post.rendered, function (err) {
      if (err) {
        winston.error("Error while writing post file: '%s'", post.path, err);
        deferred.reject(err);
      } else {
        deferred.resolve(post);
      }
    });
  });

  return deferred.promise;
}

exports.processPosts = function (buildDir, blogDir) {
  var deferred = Q.defer();
  outDir = buildDir;
  inputDir = blogDir;
  postsDir = blogDir + postsDir;

  winston.verbose("Reading posts from '%s'", postsDir);
  fs.readdir(postsDir, function (err, files) {
    if (err) {
      winston.error("Error while reading directory.", err);
      deferred.reject(err);
    }

    processPostsDirectory(files).then(function () {
      posts.sort(sortPosts);
      deferred.resolve(posts);
    });
  });
  return deferred.promise;
}