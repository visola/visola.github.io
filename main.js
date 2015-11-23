// ---- VARIABLES
var buildDir = './';
var blogDir = './src/main/blog/';
var modulesDir = './src/main/js/';

// ---- IMPORTS
var pages = require(modulesDir+'pages.js');
var posts = require(modulesDir+'posts.js');
var winston = require('winston');

// ---- MAIN
winston.level = 'debug';
winston.info('Initializing...');

posts.processPosts(buildDir, blogDir).then(function (posts) {
  winston.info('%d posts processed.', posts.length);
  pages.generatePages(buildDir, blogDir, posts);
});
