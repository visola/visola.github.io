var fs = require('fs');
var Q = require('q');
var templates = require('./templates.js');
var winston = require('winston');

var inputDir;
var outputDir;

function processIndex(posts) {
  var index = templates.get(inputDir, 'pages/index')({posts:posts});
  winston.debug('Writing index to: %s',outputDir+'index.html');
  fs.writeFile(outputDir+'index.html', index, function (err) {
    if (err) winston.error('Error while writing index.html', err);
  });
}

exports.generatePages = function (buildDir, blogDir, posts) {
  outputDir = buildDir;
  inputDir = blogDir;
  processIndex(posts);
}
