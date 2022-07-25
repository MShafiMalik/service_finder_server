const keys = require("./keys.js");
module.exports = {
  PORT: keys.PORT,
  DB_URL: keys.DB_URL,
  DOMAIN_BASE_URL: keys.DOMAIN_BASE_URL,
  SERVER_BASE_URL: keys.SERVER_BASE_URL,
  JWT_SECRET_KEY: keys.JWT_SECRET_KEY,
  URL_CRYPT_SECRET_KEY: keys.URL_CRYPT_SECRET_KEY,
  logs: {
    debugLevel: keys.logs.debugLevel,
    enableLogs: keys.logs.enableLogs,
    enableGrayLog: keys.logs.enableGrayLog,
    enableWinstonLog: keys.logs.enableWinstonLog,
  },
};
