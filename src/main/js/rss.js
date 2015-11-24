var fs = require('fs');
var nodeRss = require('node-rss');

var outpubDir;
var baseDomain = 'https://visola.github.io/';
var feedPath = baseDomain+'rss.xml';

function generateFeed (posts) {
  var i,
    feed = nodeRss.createNewFeed(
      "Vinny's blog",
      baseDomain,
      "Most recent blog posts",
      "Vinicius Isola",
      feedPath
    );

  for (i = 0; i < posts.length; i++) {
    feed.addNewItem(
      posts[i].title,
      baseDomain+posts[i].path,
      new Date(posts[i].date),
      posts[i].summary
    );
  }
  fs.writeFile(outputDir+"rss.xml", nodeRss.getFeedXML(feed), function (err) {
    if (err) winston.error('Error while writing rss.xml', err);
  });
}

exports.generateFeed = function (buildDir, posts) {
  outputDir = buildDir;
  try {
    generateFeed(posts);
  } catch (e) {
    console.error(e);
  }
};