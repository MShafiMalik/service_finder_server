const { grayLog, additionalFields } = require("./graylog");
const winston = require("./winston");
const { LOGGER_TAGS } = require("../utils/constants");
const config = require("../config/config");

const logger = {};
const tagsArray = Object.values(LOGGER_TAGS);
const getLogLevel = () => {
  return config.logs.debugLevel;
};

/** 
If we are running from local our environment veriable for LOG_LEVEL will not be sent
and we do't want to send gray logs from local system. *  */
logger.emergency = (tag, message, errorObj, ...options) => {
  return new Promise(function (resolve, reject) {
    try {
      if (config.logs.enableLogs && config.logs.enableGrayLog) {
        const { updatedMessage, fields } = getMessageAndAdditionalFields(
          tag,
          message,
          errorObj
        );
        if (!getLogLevel()) console.log(updatedMessage, ...options);
        else grayLog.emergency(`${updatedMessage},${options}`, fields);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
logger.alert = (tag, message, errorObj, ...options) => {
  return new Promise(function (resolve, reject) {
    try {
      if (config.logs.enableLogs && config.logs.enableGrayLog) {
        const { updatedMessage, fields } = getMessageAndAdditionalFields(
          tag,
          message,
          errorObj
        );
        if (!getLogLevel()) console.log(updatedMessage, ...options);
        else grayLog.alert(`${updatedMessage},${options}`, fields);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

logger.critical = (tag, message, errorObj, ...options) => {
  return new Promise(function (resolve, reject) {
    try {
      if (config.logs.enableLogs) {
        const { updatedMessage, fields } = getMessageAndAdditionalFields(
          tag,
          message,
          errorObj
        );
        if (config.logs.enableWinstonLog) {
          winston.winstonExports.appLog(`${updatedMessage}, ${options}`, false);
          winston.winstonExports.critical(`${updatedMessage}, ${options}`);
        }
        if (config.logs.enableGrayLog)
          if (!getLogLevel()) console.log(updatedMessage, ...options);
          else grayLog.critical(`${updatedMessage},${options}`, fields);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

logger.error = (tag, message, errorObj, ...options) => {
  return new Promise(function (resolve, reject) {
    try {
      if (config.logs.enableLogs) {
        const { updatedMessage, fields } = getMessageAndAdditionalFields(
          tag,
          message,
          errorObj
        );
        if (config.logs.enableWinstonLog) {
          winston.winstonExports.appLog(`${updatedMessage}, ${options}`, false);
          winston.winstonExports.error(`${updatedMessage}, ${options}`);
        }
        if (config.logs.enableGrayLog)
          if (!getLogLevel()) console.log(updatedMessage, ...options);
          else grayLog.error(`${updatedMessage},${options}`, fields);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
logger.warning = (tag, message, errorObj, ...options) => {
  return new Promise(function (resolve, reject) {
    try {
      if (config.logs.enableLogs && config.logs.enableGrayLog) {
        const { updatedMessage, fields } = getMessageAndAdditionalFields(
          tag,
          message,
          errorObj
        );
        if (!getLogLevel()) console.log(updatedMessage, ...options);
        else grayLog.warning(`${updatedMessage},${options}`, fields);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

logger.notice = (tag, message, errorObj, ...options) => {
  return new Promise(function (resolve, reject) {
    try {
      if (config.logs.enableLogs && config.logs.enableGrayLog) {
        const { updatedMessage, fields } = getMessageAndAdditionalFields(
          tag,
          message,
          errorObj
        );
        if (!getLogLevel()) console.log(updatedMessage, ...options);
        else grayLog.notice(`${updatedMessage},${options}`, fields);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

logger.info = (tag, message, errorObj, ...options) => {
  return new Promise(function (resolve, reject) {
    try {
      if (config.logs.enableLogs) {
        const { updatedMessage, fields } = getMessageAndAdditionalFields(
          tag,
          message,
          errorObj
        );
        if (config.logs.enableWinstonLog) {
          winston.winstonExports.appLog(`${updatedMessage}, ${options}`, true);
          winston.winstonExports.info(`${updatedMessage}, ${options}`);
        }
        if (config.logs.enableGrayLog)
          if (!getLogLevel()) console.log(updatedMessage, ...options);
          else grayLog.info(`${updatedMessage},${options}`, fields);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

logger.debug = (tag, message, errorObj, ...options) => {
  return new Promise(function (resolve, reject) {
    try {
      if (config.logs.enableLogs && config.logs.enableGrayLog) {
        const { updatedMessage, fields } = getMessageAndAdditionalFields(
          tag,
          message,
          errorObj
        );
        if (!getLogLevel() || getLogLevel() !== "debug")
          console.log(updatedMessage, ...options);
        else grayLog.debug(`${updatedMessage},${options}`, fields);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

const clientadditionalFields = {
  Project: "service-finder",
  Environment: process.env.NODE_ENV,
  Module: "webapp",
};

logger.clientError = (message, ...options) => {
  return new Promise(function (resolve, reject) {
    try {
      winston.winstonExports.appLog(
        `CLIENT ERROR : ${message}, ${options}`,
        false
      );
      winston.winstonExports.error(`CLIENT ERROR : ${message}, ${options}`);
      if (!getLogLevel()) console.log(message);
      else grayLog.error(`${message},${options}`, clientadditionalFields);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

// checking if developer consider first parameter tag as message. Because previoulsy first parameter was message but now it is tag.
const getMessageAndAdditionalFields = (tag, message, errorObject) => {
  const errorObjectToLog = errorObject
    ? `errorMessage:${errorObject.message} stack:${
        errorObject.stack
      } errorObject: ${JSON.stringify(errorObject)}`
    : "";
  let updatedMessage = `${message} ${errorObjectToLog}`;
  let fields = additionalFields;
  if (tag) {
    if (tagsArray.indexOf(tag.toLowerCase()) >= 0) {
      fields.Tag = tag.toLowerCase();
    } else {
      updatedMessage = message ? `${tag} ${message} ${errorObjectToLog}` : tag;
      fields.Tag = LOGGER_TAGS.FOOTPRINT;
    }
  } else fields.Tag = LOGGER_TAGS.FOOTPRINT;
  return {
    fields,
    updatedMessage,
  };
};

module.exports = logger;
// test line
