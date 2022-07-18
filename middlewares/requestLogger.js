const logger = require("../logger/logger");
const { LOGGER_TAGS } = require("../utils/constants");

const getCallerIP = (request) => {
  try {
    logger.info(
      LOGGER_TAGS.FOOTPRINT,
      `headers => ${JSON.stringify(
        request.headers["x-forwarded-for"]
      )} connection => ${JSON.stringify(
        request.connection.remoteAddress
      )} socket=> ${JSON.stringify(request.socket.remoteAddress)}`
    );
  } catch {}

  var ip =
    request.headers["x-forwarded-for"] ||
    request.connection.remoteAddress ||
    request.socket.remoteAddress ||
    request.connection.socket.remoteAddress;
  ip = ip.split(",")[0];
  ip = ip.split(":").slice(-1); //in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
  return ip;
};

module.exports = function logRequest(req, res, next) {
  try {
    const url = req.originalUrl.toLocaleLowerCase();
    if (
      url.indexOf("login") === -1 &&
      url.indexOf("password") === -1 &&
      url.indexOf("signup") === -1 &&
      url.indexOf("/health-check") === -1 &&
      url.indexOf("/api") > -1
    ) {
      // logger.info(LOGGER_TAGS.FOOTPRINT, `headers => ${JSON.stringify(req.headers)} connection => ${JSON.stringify(req.connection)} socket=> ${JSON.stringify(req.socket)}`);

      const loggerMessage = `${getCallerIP(req)} ${req.method} ${
        req.originalUrl
      } RequestBody:${JSON.stringify(req.body)} : Server Time -> ${new Date()}`;
      logger.info(LOGGER_TAGS.FOOTPRINT, loggerMessage);
    }
  } catch (error) {
    // TODO:
  }
  next();
};
