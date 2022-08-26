module.exports = {
  PORT: process.env.PORT,
  // DB_URL: process.env.DB_URL,
  DB_URL: "mongodb://127.0.0.1:27017/service_finder",
  // SERVER_BASE_URL: process.env.SERVER_BASE_URL,
  SERVER_BASE_URL: "http://localhost:5000",
  DOMAIN_BASE_URL: process.env.DOMAIN_BASE_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  URL_CRYPT_SECRET_KEY: process.env.URL_CRYPT_SECRET_KEY,
  GOOGLE_MAP_API_KEY: process.env.GOOGLE_MAP_API_KEY,
  SEND_GRID_API_KEY: process.env.SEND_GRID_API_KEY,
  SEND_GRID_MAIL_FROM: process.env.SEND_GRID_MAIL_FROM,
  logs: {
    debugLevel: "",
    enableLogs: true,
    enableGrayLog: true,
    enableWinstonLog: false,
  },
};
