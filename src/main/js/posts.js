var fs = require('fs');
var markdown = require('./markdown.js');
var mkdirp = require('mkdirp');
var Q = require('q');
var winston = require('winston');
var templates = require('./templates.js');
var yaml = require('js-yaml');

var outDir = null;
var inputDir;
var posts = [];
var postsDir;

function addPost (filename, path) {
  var deferred = Q.defer(),
    indexOfSpace = filename.indexOf(' '),
    postDate = filename.substr(0, indexOfSpace),
    postTitle = filename.substr(indexOfSpace + 1, filename.length).replace(/\.md$/,''),
    cleanedTitle = postTitle.toLowerCase().replace(/[\W-]+/g,'-').replace('-+','-'),
    postDir = postDate.replace(/-/ig,'/')+'/'+cleanedTitle+'/',
    post = {
      date: postDate,
      title: postTitle,
      file: path,
      dir: postDir,
      path: postDir+'index.html'
    };

  fs.readFile(post.file, function (err, rawContent) {
    var metadata, split;

    if (err) {
      winston.error("Error while loading markdown from '%s'", post.file, err);
      deferred.reject(err);
      return;
    }

    split = rawContent.toString('utf8').split(/-{5,}/);

    if (split.length > 1) {
      metadata = yaml.load(split[0]);
      winston.debug("Metadata and markdown loaded for post: '%s'", post.file);
      Object.assign(post, metadata);

      post.markdown = split[1];
    } else {
      winston.debug("Markdown loaded for '%s'", post.file);
      post.markdown = split[0];
    }

    posts.push(post);
    deferred.resolve(post);
  });

  return deferred.promise;
}

function loadMarkdown(post) {
  var deferred = Q.defer();

  post.html = markdown.render(post.markdown);

  indexOfMore = post.html.indexOf('<!-- more -->');
  post.summary = post.html.substr(0, indexOfMore);
  post.rendered = templates.get(inputDir, 'post')({post:post});

  deferred.resolve(post);

  return deferred.promise;
}

function processPostsDirectory(files) {
  var i, path,
    promisses = [];

  for (i = 0; i < files.length; i++) {
    path = postsDir+files[i];
    winston.verbose("Processing file '%s'", path);
    promisses.push(addPost(files[i], path).then(loadMarkdown).then(writePost));
  }

  return Q.all(promisses);
}

function sortPosts(p1, p2) {
  return p2.date.localeCompare(p1.date);
}

function writePost(post) {
  var renderedPost,
    deferred = Q.defer();

  try {
    winston.debug("Ensuring directory: '%s'", post.dir);
    mkdirp(post.dir, function (err) {
      if (err) {
        winston.error("Error while creating directories: '%s'", post.dir, err);
        deferred.reject(err);
        return;
      }

      winston.debug("Writing post: '%s'", post.path);
      fs.writeFile(post.path, post.rendered, function (err) {
        if (err) {
          winston.error("Error while writing post file: '%s'", post.path, err);
          deferred.reject(err);
        } else {
          deferred.resolve(post);
        }
      });
    });
  } catch (e) {
    deferred.reject(e);
  }

  return deferred.promise;
}

exports.processPosts = function (buildDir, blogDir) {
  var deferred = Q.defer();
  outDir = buildDir;
  inputDir = blogDir;
  posts = [];
  postsDir = blogDir + 'posts/';

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
