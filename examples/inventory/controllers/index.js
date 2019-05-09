const LOGGER = require("../logger");

var normalizedPath = require("path").join(__dirname);

let controllers = {};

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  if (file.endsWith(".js") && file != "index.js") {
    LOGGER.debug(`Adding controller: ${file}`);
    let clazz = require("./" + file);
    controllers[file.slice(0, -3)] = new clazz();
  }
});

module.exports = controllers;
