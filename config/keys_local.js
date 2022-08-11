if (process.env.NODE_ENV === "production") {
  module.exports = require("./env_config.js");
} else {
  module.exports = require("./local.js");
}
