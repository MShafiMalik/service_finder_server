module.exports = {
  PORT: 5000,
  DB_URL: "mongodb://127.0.0.1:27017/service_finder",
  // DB_URL:
  //   "mongodb+srv://admin:admin@service-finder.xd14t.mongodb.net/serviceFinderDB?retryWrites=true&w=majority",
  DOMAIN_BASE_URL: "http://localhost:3000",
  SERVER_BASE_URL: "http://localhost:5000",
  JWT_SECRET_KEY: "nasdhsaekjdrsalkddhbs123+dh26o15601x4+0+560+5a20+5065bb65z0",
  URL_CRYPT_SECRET_KEY: "s!3p1yp@0p!@9<7DPk!HjaR#:-/Z7(hTBnlRS&4CXF456",
  logs: {
    debugLevel: "",
    enableLogs: true,
    enableGrayLog: true,
    enableWinstonLog: false,
  },
};
