var jade = require('jade');

var templatesDir = 'templates/';

exports.get = function (name) {
  return jade.compileFile(templatesDir+name+'.jade');
}