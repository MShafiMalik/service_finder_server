if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "staging" ||
  process.env.NODE_ENV === "production"
) {
  //we are in development environment, return keys accordingly
  module.exports = require("./env_config.js");
} else {
  //we are in local environment, return keys accordingly
  module.exports = require("./local.js");
}
