const winston = require("winston");
const path = require("path");
require("winston-daily-rotate-file");
const logsPath = path.join(__dirname, "../../", "servicefinder-logs");

const infoOptions = {
  file: {
    level: "info",
    filename: `${logsPath}/info-logs.log`,
    handleExceptions: false,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss A ZZ",
      }),
      winston.format.json()
    ),
  },
  console: {
    level: "debug",
    handleExceptions: false,
    json: false,
    colorize: true,
  },
};

const errorOptions = {
  file: {
    level: "error",
    filename: `${logsPath}/error-logs.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss A ZZ",
      }),
      winston.format.json()
    ),
  },
  console: {
    level: "error",
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const criticalOptions = {
  file: {
    level: "error",
    filename: `${logsPath}/critical-logs.log`,
    handleExceptions: false,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss A ZZ",
      }),
      winston.format.json()
    ),
  },
  console: {
    level: "error",
    handleExceptions: false,
    json: false,
    colorize: true,
  },
};

const allLogsOptions = {
  file: {
    level: "info",
    filename: `${logsPath}/application-logs.log`,
    handleExceptions: true,
    json: false,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    format: winston.format.combine(
      winston.format.timestamp({
        format: "YYYY-MM-DD hh:mm:ss A ZZ",
      }),
      winston.format.json()
    ),
  },
  console: {
    level: "info",
    handleExceptions: false,
    json: false,
    colorize: true,
  },
};

// instantiate a new Winston Logger with the settings defined above
const log = winston.createLogger({
  timestamp: true,
  transports: [
    new winston.transports.DailyRotateFile({
      name: "info-logs",
      datePattern: "YYYY-MM-DD",
      filename: path.join(logsPath.toString(), "info-logs.log"),
    }),
    new winston.transports.File(infoOptions.file),
    new winston.transports.Console(infoOptions.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

const error = winston.createLogger({
  timestamp: true,
  transports: [
    new winston.transports.DailyRotateFile({
      name: "error-logs",
      datePattern: "YYYY-MM-DD",
      filename: path.join(logsPath.toString(), "error-logs.log"),
    }),
    new winston.transports.File(errorOptions.file),
    new winston.transports.Console(errorOptions.console),
  ],
});

const critical = winston.createLogger({
  timestamp: true,
  transports: [
    new winston.transports.DailyRotateFile({
      name: "critical-logs",
      datePattern: "YYYY-MM-DD",
      filename: path.join(logsPath.toString(), "critical-logs.log"),
    }),
    new winston.transports.File(criticalOptions.file),
    new winston.transports.Console(criticalOptions.console),
  ],
});

const appLog = winston.createLogger({
  timestamp: true,
  transports: [
    new winston.transports.DailyRotateFile({
      name: "application-logs",
      datePattern: "YYYY-MM-DD",
      filename: path.join(logsPath.toString(), "application-logs.log"),
    }),
    new winston.transports.File(allLogsOptions.file),
    new winston.transports.Console(allLogsOptions.console),
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// create a stream object with a 'write' function that will be used by `morgan`
log.stream = {
  write(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    log.info(message);
  },
};

const winstonExports = {
  info(msg) {
    log.info(msg);
  },
  error(msg) {
    error.error(msg);
  },
  critical(msg) {
    critical.error(msg);
  },
  appLog(msg, isInfo) {
    if (!isInfo) {
      appLog.error(msg);
    } else {
      appLog.info(msg);
    }
  },
};

module.exports = { log, winstonExports };
