var fs = require('fs');
var marked = require('marked');
var mkdirp = require('mkdirp');
var templates = require('./templates.js');

var outDir = null;
var posts = [];
var postsDir = 'posts/';

function addPost (filename, path) {
  var indexOfSpace = filename.indexOf(' '),
    post = {};

  post.file = path;
  post.date = filename.substr(0, indexOfSpace);
  post.title = filename.substr(indexOfSpace + 1, filename.length).replace(/\.md$/,'');

  posts.push(post);
}

function handleLoadMarkdown(post, err, content) {
  post.markdown = content.toString();
  processPost(post);
}

function processPost(post) {
  var renderedPost,
    postDir = post.date.replace(/-/ig,'/')+'/',
    pathToPost = postDir+post.title+'.html';

  post.html = marked(post.markdown);
  post.path = pathToPost;
  renderedPost = templates.get('post')({post:post})

  mkdirp(outDir+postDir, function () {
    fs.writeFile(outDir+pathToPost, renderedPost, function (err) {if (err) console.log(err);});
  });
}

function processPostsDirectory(err, files) {
  var i, path;

  for (i = 0; i < files.length; i++) {
    path = postsDir+files[i];
    addPost(files[i], path);
  }

  console.log(posts.length + ' posts to process.');
  for (i = 0; i < posts.length; i++) {
    fs.readFile(posts[i].file, handleLoadMarkdown.bind(this, posts[i]));
  }
}

exports.processPosts = function (buildDir) {
  outDir = buildDir;
  fs.readdir(postsDir, processPostsDirectory);
}