var jade = require('jade');

var templatesDir = 'templates/';

exports.get = function (baseDir, name) {
  return jade.compileFile(baseDir+templatesDir+name+'.jade');
}