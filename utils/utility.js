const logger = require("../logger/logger");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  JWT_SECRET_KEY,
  SEND_GRID_MAIL_FROM,
  SEND_GRID_API_KEY,
} = require("../config/config");
const { LOGGER_TAGS, HTTP_STATUS } = require("../utils/constants");
const sgMail = require("@sendgrid/mail");
const urlCrypt = require("url-crypt")(JWT_SECRET_KEY);

const generatePasswordHash = async (password) => {
  try {
    const passwordSalt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, passwordSalt);
  } catch (error) {
    logger.error(
      LOGGER_TAGS.FOOTPRINT,
      `Error generating password hash:`,
      error
    );
    return null;
  }
};

const generateJwtToken = async (object) => {
  return jwt.sign(object, JWT_SECRET_KEY, { expiresIn: "24h" });
};

const getUserIdFromJwtToken = async (token) => {
  const { user_id } = jwt.verify(token, JWT_SECRET_KEY);
  return user_id;
};

const successResponse = (data, httpStatusCode, successMessage = "") => {
  if (!data || !httpStatusCode) {
    logger.error(
      LOGGER_TAGS.FOOTPRINT,
      `Success response has either no data=${data} or httpStatusCode=${httpStatusCode}`
    );
  }
  return {
    data: data,
    status: httpStatusCode ? httpStatusCode : HTTP_STATUS.OK,
    message: successMessage,
    success: true,
  };
};

const errorResponse = (httpStatusCode, errorMessage, data = null) => {
  if (!httpStatusCode || !errorMessage) {
    logger.error(
      LOGGER_TAGS.FOOTPRINT,
      `Error response has either no errorMessage=${errorMessage} or httpStatusCode=${httpStatusCode}`
    );
  }
  return {
    data,
    status: httpStatusCode ? httpStatusCode : HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: errorMessage
      ? errorMessage
      : "Internal server error. Please try again later.",
    success: false,
  };
};

const internalServerErrorResponse = (message = "") => {
  return errorResponse(
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message || "Internal server error.Please try again later."
  );
};

const constructResponse = (expressResponseObject, responseData) => {
  if (responseData.success) {
    return expressResponseObject.status(responseData.status).send({
      data: responseData.data,
      message: responseData.message,
      success: true,
    });
  } else {
    if (responseData.data) {
      return expressResponseObject.status(responseData.status).send({
        data: responseData.data,
        message: responseData.message,
        success: false,
      });
    }
    return expressResponseObject.status(responseData.status).send({
      message: responseData.message,
      success: false,
    });
  }
};

const logBadRequestAndResponse = (
  expressRequestObject,
  expressResponseObject,
  errors
) => {
  const url = expressRequestObject.originalUrl.toLocaleLowerCase();
  const logRequestBody =
    url.indexOf("login") === -1 &&
    url.indexOf("password") === -1 &&
    url.indexOf("signup") === -1 &&
    url.indexOf("/api") > -1;
  const loggerMessage = `${expressRequestObject.method} ${
    expressRequestObject.originalUrl
  } RequestBody:${
    logRequestBody
      ? JSON.stringify(expressRequestObject.body)
      : "Not logged because of security reason"
  } 
        Validation Errors: ${
          logRequestBody
            ? JSON.stringify(errors)
            : "Not logged because of security reason"
        }`;
  logger.error(LOGGER_TAGS.BAD_REQUEST, loggerMessage);
  return expressResponseObject.status(HTTP_STATUS.BAD_REQUEST).json({
    errors: errors.array({
      onlyFirstError: true,
    }),
    success: false,
  });
};

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const encryptData = (object) => {
  return urlCrypt.cryptObj(object);
};

const decryptData = (encryptedString) => {
  try {
    return urlCrypt.decryptObj(encryptedString);
  } catch (error) {
    logger.error(LOGGER_TAGS.FOOTPRINT, `Error decrypting invite link`, error);
    return null;
  }
};

const convertToCapitalize = (str) => {
  const str_arr = str.trim().split(" ");
  let new_str = "";
  str_arr.forEach((word) => {
    new_str += word[0].toUpperCase() + word.substring(1).toLowerCase() + " ";
  });
  return new_str.trim();
};

const sendOTPMail = async (body) => {
  const message_body = {
    from: SEND_GRID_MAIL_FROM,
    to: body.to,
    subject: "OTP Generate From Service Finder",
    text: `Your verification code is  from Service Finder`,
    html: `<p>Your verification code is  <h4> ${body.otp} </h4> for Service Finder </p>`,
  };
  return sendMail(message_body);
};

const sendMail = (body) => {
  sgMail.setApiKey(SEND_GRID_API_KEY);
  return sgMail
    .send(body)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      return error;
    });
};

module.exports = {
  generatePasswordHash,
  generateJwtToken,
  getUserIdFromJwtToken,
  successResponse,
  errorResponse,
  constructResponse,
  internalServerErrorResponse,
  logBadRequestAndResponse,
  getRandomNumber,
  encryptData,
  decryptData,
  convertToCapitalize,
  sendOTPMail,
  sendMail,
};
