const express = require("express");
const LOGGER = require("./logger");

class Application {
  constructor(port) {
    this.port = port;
    this.app = express();
  }

  registerRoute(route) {
    let {method, path, callback} = route;
    this.app[method.toLowerCase()](path, callback);
  }

  start () {
    this.app.listen(this.port, () => {
      LOGGER.info(`Inventory app is ready and waiting on port ${this.port}!`);
    });
  }
}

module.exports = Application;
