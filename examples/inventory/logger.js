const winston = require("winston");
const moment = require("moment");
const TIMESTAMP_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";

let formatter = (options) => {
  let {message, level} = options;
  let timestamp = moment().format(TIMESTAMP_FORMAT);

  level = level.toUpperCase();
  while (level.length < 5) {
    level += " ";
  }

  return `[${level}] (${timestamp}) ${message}`;
};

let consoleTransport = new winston.transports.Console({
  formatter,
  "level": "debug"
});

let logger = new winston.Logger({"transports": [consoleTransport]});

module.exports = logger;
