const graylog2 = require("graylog2");
const { LOGGER_TAGS } = require("../utils/constants");

// eslint-disable-next-line new-cap
const grayLog = new graylog2.graylog({
  servers: [{ host: "graylog.wearenova.co.uk", port: 12201 }],
  facility: "servicefinder", // the facility for these log messages
  // (optional, default: "Node.js")
  bufferSize: 1350, // max UDP packet size, should never exceed the
  // MTU of your system (optional, default: 1400)
});

grayLog.on("error", function (error) {
  console.error("Error while trying to write to graylog2:", error);
});

const additionalFields = {
  Project: "servicefinder",
  Environment: process.env.NODE_ENV,
  Module: "API",
  Team: "servicefinder",
  Tag: LOGGER_TAGS.FOOTPRINT, // default value is footprint
};

module.exports = { grayLog, additionalFields };
