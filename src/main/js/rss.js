var fs = require('fs');
var RSS = require('rss');
var winston = require('winston');

var outpubDir, rssFile;
var baseDomain = 'https://visola.github.io/';
var feedPath = baseDomain+'rss.xml';

function generateFeed (posts) {
  var i, postDate,
    lastPost = 0,
    feed = new RSS({
      title: "Vinny's blog",
      description: "Most recent blog posts",
      feed_url: feedPath,
      site_url: baseDomain
    });

  for (i = 0; i < posts.length; i++) {
    postDate = new Date(posts[i].date);
    if (postDate.getTime() > lastPost) {
      lastPost = postDate.getTime();
    }

    feed.item({
      title: posts[i].title,
      description: posts[i].summary,
      guid: posts[i].date,
      url: baseDomain+posts[i].path,
      date: postDate,
      author: 'Vinicius Isola'
    });
  }

  fs.stat(rssFile, function (err, stats) {
    if (err) {
      winston.error("Error while checking rss.xml status.", err);
    }
    if (lastPost > new Date(stats.mtime).getTime()) {
      winston.debug('Writing RSS to rss.xml...');
      fs.writeFile(rssFile, feed.xml(), function (err) {
        if (err) winston.error('Error while writing rss.xml', err);
      });
    } else {
      winston.debug('No new posts, will not generate rss.xml');
    }
  });
}

exports.generateFeed = function (buildDir, posts) {
  outputDir = buildDir;
  rssFile = outputDir + 'rss.xml';
  winston.info('Generating RSS...');
  try {
    generateFeed(posts);
  } catch (e) {
    winston.error(e);
  }
};