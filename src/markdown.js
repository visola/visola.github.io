var highlight = require('highlight.js');
var marked = require('marked');

marked.setOptions({
  highlight: function (code, language) {
    if (!language) return code;
    return highlight.highlightAuto(code).value;
  }
});

exports.render = function (markdown) {
  return marked(markdown);
}
