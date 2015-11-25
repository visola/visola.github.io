var fs = require('fs');
var Q = require('q');
var templates = require('./templates.js');
var winston = require('winston');

var inputDir;
var outputDir;

function processIndex(posts) {
  var file, i, output, page,
    pageCount = 0,
    pageSize = 10;

  do {
    page = posts.splice(0, pageSize);
    if (pageCount == 0) {
      file = 'index.html';
    } else {
      file = 'index-'+pageCount+'.html';
    }
    output = templates.get(inputDir, 'index')({
      hasMore: posts.length > 0,
      nextPage: pageCount + 1,
      posts:page
    });

    winston.debug('Writing to: %s',outputDir+file);
    fs.writeFile(outputDir+file, output, function (err) {
      if (err) winston.error('Error while writing index.html', err);
    });
    pageCount++;
  } while (posts.length > 0);
}

exports.generatePages = function (buildDir, blogDir, posts) {
  try {
    outputDir = buildDir;
    inputDir = blogDir;
    processIndex(posts);
  } catch (e) {
    winston.error('Error while processing pages.', e);
  }
}
