// ---- IMPORTS
var _ = require('lodash');
var fs = require('fs');
var highlight = require('highlight.js');
var posts = require('./posts.js');

// ---- VARIABLES
var buildDir = '../';

// ---- MAIN
posts.processPosts(buildDir);