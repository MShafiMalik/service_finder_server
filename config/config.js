const keys = require("./keys.js");
module.exports = {
  PORT: keys.PORT,
  DB_NAME: keys.DB_NAME,
  DB_URL: process.env.DB_URL,
  DOMAIN_BASE_URL: keys.DOMAIN_BASE_URL,
  SERVER_BASE_URL: keys.SERVER_BASE_URL,
  JWT_SECRET_KEY: keys.JWT_SECRET_KEY,
  URL_CRYPT_SECRET_KEY: keys.URL_CRYPT_SECRET_KEY,
};
