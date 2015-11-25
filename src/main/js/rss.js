var fs = require('fs');
var RSS = require('rss');
var winston = require('winston');

var outpubDir;
var baseDomain = 'https://visola.github.io/';
var feedPath = baseDomain+'rss.xml';

function generateFeed (posts) {
  var i,
    feed = new RSS({
      title: "Vinny's blog",
      description: "Most recent blog posts",
      feed_url: feedPath,
      site_url: baseDomain
    });

  for (i = 0; i < posts.length; i++) {
    feed.item({
      title: posts[i].title,
      description: posts[i].summary,
      guid: posts[i].date,
      url: baseDomain+posts[i].path,
      date: new Date(posts[i].date),
      author: 'Vinicius Isola'
    });
  }

  winston.debug('Writing RSS to rss.xml...');
  fs.writeFile(outputDir+"rss.xml", feed.xml(), function (err) {
    if (err) winston.error('Error while writing rss.xml', err);
  });
}

exports.generateFeed = function (buildDir, posts) {
  outputDir = buildDir;
  winston.info('Generating RSS...');
  try {
    generateFeed(posts);
  } catch (e) {
    winston.error(e);
  }
};