// ---- IMPORTS
var posts = require('./posts.js');
var winston = require('winston');

// ---- VARIABLES
var buildDir = '../';

// ---- MAIN
winston.level = 'debug';
winston.info('Initializing...');
posts.processPosts(buildDir).then(function (posts) {
  winston.info('%d posts processed.', posts.length);
});
