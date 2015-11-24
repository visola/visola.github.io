// ---- VARIABLES
var buildDir = './';
var blogDir = './src/main/blog/';
var modulesDir = './src/main/js/';

// ---- IMPORTS
var commander = require('commander');
var pages = require(modulesDir+'pages.js');
var posts = require(modulesDir+'posts.js');
var winston = require('winston');

// ---- MAIN
winston.level = 'debug';
winston.info('Initializing...');

function build() {
  posts.processPosts(buildDir, blogDir).then(function (posts) {
    winston.info('%d posts processed.', posts.length);
    pages.generatePages(buildDir, blogDir, posts);
  });
}

commander
  .version('1.0')
  .option('-s, --server', 'Add peppers')
  .parse(process.argv);

if (commander.server) {
  var express = require('express');
  var app = express();
  app.use(express.static('./'));

  var server = app.listen(3000, function () {
    var address = server.address(),
      host = address.address,
      port = address.port;

    winston.info("Example app listening at http://%s:%s", host, port);
  });
} else {
  build();
}
