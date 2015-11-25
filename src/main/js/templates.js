var jade = require('jade');

var templatesDir = 'templates/';

exports.get = function (baseDir, name) {
  var path = name ? baseDir+templatesDir+name : baseDir;
  return jade.compileFile(path+'.jade');
}