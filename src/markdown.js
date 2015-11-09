var highlight = require('highlight.js');
var marked = require('marked');

marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

exports.render = function (markdown) {
  return marked(markdown);
}
