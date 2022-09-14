const _ = require("lodash");
const { check, validationResult } = require("express-validator");

const time_regx = "^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$";

const checkForHexRegExp = "^[0-9a-fA-F]{24}$";

const validateRequest = (request) => {
  return validationResult(request);
};

const emailValidations = (paramName = "email") => {
  return [
    check(paramName).trim().isEmail().withMessage("Invalid email address"),
  ];
};

const otpValidations = (paramName = "otp") => {
  return isRequiredValidations(paramName);
};

const jwtIdValidations = (paramName = "jwt_id") => {
  return isRequiredValidations(paramName);
};

const firstnameValidations = (paramName = "firstname") => {
  return isRequiredValidations(paramName);
};
const lastnameValidations = (paramName = "lastname") => {
  return isRequiredValidations(paramName);
};

const imageValidations = (paramName = "image") => {
  return isRequiredValidations(paramName);
};

const nameValidations = (paramName = "name") => {
  return isRequiredValidations(paramName);
};

const descriptionValidations = (paramName = "description") => {
  return isRequiredValidations(paramName);
};

const cityValidations = (paramName = "city") => {
  return isRequiredValidations(paramName);
};

const stateValidations = (paramName = "state") => {
  return isRequiredValidations(paramName);
};
const countryValidations = (paramName = "country") => {
  return isRequiredValidations(paramName);
};

const isRequiredValidations = (param) => {
  return check(param)
    .trim()
    .notEmpty({
      ignore_whitespace: true,
    })
    .withMessage(`${param} field is required`);
};

const roleValidations = (paramName = "role") => {
  return [
    check(paramName)
      .trim()
      .custom((value) => {
        if (value !== "Seller" && value !== "Buyer") {
          return Promise.resolve();
        } else {
          return Promise.reject("Role should be Seller or Buyer");
        }
      }),
  ];
};

const conversationMessageValidations = (paramName) => {
  return [
    check(paramName)
      .isString()
      .isLength({ min: 2, max: 300 })
      .withMessage(`Message length should be in between 2 to 300 characters`),
  ];
};

const urlValidations = (paramName = "url") => {
  return [
    check(paramName)
      .optional({ nullable: true, checkFalsy: true })
      .isURL({
        protocols: ["http", "https"],
      })
      .isLength({ min: 3, max: 100 })
      .withMessage(`${paramName} length should 100 characters maximum`),
  ];
};

const phoneNumberValidations = (paramName = "phone") => {
  return [
    check(paramName)
      .trim()
      .notEmpty()
      .withMessage(`${paramName} field is required`)
      .isLength({ min: 3, max: 12 })
      .withMessage("Length should be 3 to 12 in phone number"),
  ];
};

const dateValidations = (paramName, isFutureDate = false) => {
  return [
    check(paramName)
      .isLength({ min: 10, max: 10 })
      .withMessage("Length should be 10")
      .custom((value, { _req }) => {
        const dateArray = value.split("-");
        if (dateArray.length === 3) {
          const year = Number(dateArray[0]);
          const month = Number(dateArray[1]);
          const date = Number(dateArray[2]);
          const dateConverted = new Date(year, month - 1, date);
          if (
            year.toString().length !== 4 ||
            month < 1 ||
            month > 12 ||
            date < 1 ||
            date > 31
          ) {
            throw new Error(
              `Invalid ${paramName} format. Valid format is yyyy-mm-dd`
            );
          }
          if (!(dateConverted instanceof Date && !isNaN(dateConverted))) {
            throw new Error(
              `Invalid ${paramName} format. Valid format is yyyy-mm-dd`
            );
          }
          if (isFutureDate && dateConverted < new Date()) {
            throw new Error(
              `Invalid ${paramName}. Only future date is allowed`
            );
          }
        } else
          throw new Error(
            `Invalid ${paramName} format. Valid format is yyyy-mm-dd`
          );
        return true;
      }),
  ];
};

const timeValidations = (paramName) => {
  return [
    check(paramName)
      .isLength({ min: 5, max: 5 })
      .withMessage("Length should be 5")
      .custom((value, { _req }) => {
        const timeArray = value.split(":");
        if (timeArray.length === 2) {
          const hours = Number(timeArray[0]);
          const minutes = Number(timeArray[1]);
          if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new Error(
              `Invalid ${paramName} format. Valid format is hh:mm`
            );
          }
        } else
          throw new Error(`Invalid ${paramName} format. Valid format is hh:mm`);
        return true;
      }),
  ];
};

const shouldBeAnArray = (paramName = "array", required = true) => {
  if (required)
    return [
      check(paramName)
        .isArray({ min: 1 })
        .withMessage(`Should be an array with at least one item`),
    ];
  return [check(paramName).isArray().withMessage(`Should be an array`)];
};

const integerValidation = (paramName = "value", maxValue = 2147483647) => {
  return [
    check(paramName)
      .isInt()
      .withMessage(`Only numeric values are allowed`)
      .isInt({ max: maxValue })
      .withMessage(`Max allowed value is ${maxValue}`),
  ];
};

const booleanValidation = (paramName = "isActive") => {
  return [
    check(paramName).isBoolean().withMessage(`Only true/false is allowed`),
  ];
};

const commonPasswordValidations = (paramName) => {
  return check(paramName)
    .notEmpty()
    .withMessage(`${paramName} field is required`)
    .isLength({ min: 8, max: 15 })
    .withMessage(`Password length should be in between 8 to 15`);
};

const passwordValidations = (paramName = "password") => {
  return commonPasswordValidations(paramName);
};

const oldPasswordValidations = (paramName = "old_password") => {
  return commonPasswordValidations(paramName);
};

const newPasswordValidations = (paramName = "new_password") => {
  return commonPasswordValidations(paramName);
};

const confirmPasswordValidations = (paramName = "confirm_password") => {
  return commonPasswordValidations(paramName);
};

// this will concatenate all array into one array
const concatValidations = (...arraysOfArray) => {
  return [].concat(arraysOfArray);
};

const mongodbIdValidation = (paramName) => {
  return check(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .custom((value) => {
      if (!value.match(checkForHexRegExp)) {
        return Promise.reject(`Invalid ${paramName}`);
      }
      return Promise.resolve();
    });
};

const titleValidations = (paramName = "title") => {
  return isRequiredValidations(paramName);
};
const categoryValidations = (paramName = "category") => {
  return mongodbIdValidation(paramName);
};

const coordinateValidations = (paramName, min, max) => {
  return check(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .isNumeric()
    .withMessage(`${paramName} shuold be a number`)
    .isLength({ min: min, max: max })
    .withMessage(`Length should be ${min} to ${max} in ${paramName}`)
    .custom((value) => {
      if (value < min || value > max) {
        return Promise.reject(
          `Length should be ${min} to ${max} in ${paramName}`
        );
      }
      return Promise.resolve();
    });
};

const latitudeValidations = (paramName = "latitude") => {
  return coordinateValidations(paramName, -90, 90);
};

const longitudeValidations = (paramName = "longitude") => {
  return coordinateValidations(paramName, -180, 180);
};

const addressValidations = (paramName = "address") => {
  return isRequiredValidations(paramName);
};

const radiusValidations = (paramName = "radius") => {
  return check(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .isNumeric()
    .withMessage(`${paramName} should be a number`);
};

const subPackageValidations = (pkg_value, pkg_name) => {
  if (typeof pkg_value !== "object" || pkg_value === null) {
    return {
      status: "error",
      message: `${pkg_name} package Is Required`,
    };
  }
  if (!pkg_value.name) {
    return {
      status: "error",
      message: `Name of ${pkg_name} package Is Required`,
    };
  }
  if (!pkg_value.description) {
    return {
      status: "error",
      message: `Description of ${pkg_name} package is required`,
    };
  }
  if (!pkg_value.features) {
    return {
      status: "error",
      message: `Features of ${pkg_name} package is required`,
    };
  }
  if (Array.isArray(pkg_value.features) === false) {
    return {
      status: "error",
      message: `Features of ${pkg_name} package should be an array`,
    };
  }
  if (pkg_value.features.length === 0) {
    return {
      status: "error",
      message: `Features of ${pkg_name} package should have at least one item`,
    };
  }
  if (!pkg_value.price) {
    return {
      status: "error",
      message: `Price of ${pkg_name} package is required`,
    };
  }
  if (typeof pkg_value.price !== "number") {
    return {
      status: "error",
      message: `Price of ${pkg_name} package should be a number`,
    };
  }
  return {
    status: "success",
    message: "",
  };
};

const packagesValidations = (paramName = "packages") => {
  return check(paramName).custom((value) => {
    if (typeof value !== "object" || value === null) {
      return Promise.reject(`${paramName} Is Required`);
    }
    const basic_response = subPackageValidations(value.basic, "Basic");
    if (basic_response.status === "error") {
      return Promise.reject(basic_response.message);
    }
    const standard_response = subPackageValidations(value.standard, "Standard");
    if (standard_response.status === "error") {
      return Promise.reject(standard_response.message);
    }
    const premium_response = subPackageValidations(value.premium, "Premium");
    if (premium_response.status === "error") {
      return Promise.reject(premium_response.message);
    }
    return Promise.resolve();
  });
};

const imagesValidations = (paramName = "images") => {
  return check(paramName)
    .isArray({ min: 1 })
    .withMessage(`${paramName} should be an array with at least one item`);
};

const sellerUserIdValidations = (paramName = "seller_user_id") => {
  return mongodbIdValidation(paramName);
};
const serviceIdValidations = (paramName = "service_id") => {
  return mongodbIdValidation(paramName);
};
const catIdValidations = (paramName = "category_id") => {
  return mongodbIdValidation(paramName);
};

const categoryIdValidations = (paramName = "category") => {
  return mongodbIdValidation(paramName);
};

const keywordValidations = (paramName = "keyword") => {
  return isRequiredValidations(paramName);
};

const workStartDateValidations = (paramName = "work_start_date") => {
  return dateValidations(paramName);
};
const workStartTimeValidations = (paramName = "work_start_time") => {
  return timeValidations(paramName);
};
const bookingIdValidations = (paramName = "booking_id") => {
  return mongodbIdValidation(paramName);
};
const subRatingValidations = (rating, paramName, subParamName) => {
  if (!rating) {
    return {
      error: true,
      message: `${subParamName} of ${paramName} is required`,
    };
  }
  if (isNaN(rating)) {
    return {
      error: true,
      message: `${subParamName} of ${paramName} is not a number`,
    };
  }
  if (rating < 1 || rating > 5) {
    return {
      error: true,
      message: `Invalid length of ${subParamName} of ${paramName}, It Should be between 1 and 5`,
    };
  }
  return {
    error: false,
    message: "",
  };
};
const ratingValidations = (paramName = "rating") => {
  return check(paramName).custom((value) => {
    if (typeof value !== "object" || value === null) {
      return Promise.reject(`${paramName} Is Required`);
    }
    const seller_communication_level_validation = subRatingValidations(
      value.seller_communication_level,
      paramName,
      "seller_communication_level"
    );
    if (seller_communication_level_validation.error === true) {
      return Promise.reject(seller_communication_level_validation.message);
    }
    const service_as_described_validation = subRatingValidations(
      value.service_as_described,
      paramName,
      "service_as_described"
    );
    if (service_as_described_validation.error === true) {
      return Promise.reject(service_as_described_validation.message);
    }
    return Promise.resolve();
  });
};
const reviewValidations = (paramName = "review") => {
  return isRequiredValidations(paramName);
};

const receiverUserIdValidations = (paramName = "receiver_user_id") => {
  return mongodbIdValidation(paramName);
};
const messageTextValidations = (paramName = "message_text") => {
  return isRequiredValidations(paramName);
};

const userIdValidations = (paramName = "user_id") => {
  return mongodbIdValidation(paramName);
};

module.exports = {
  validateRequest,
  concatValidations,
  firstnameValidations,
  lastnameValidations,
  roleValidations,
  emailValidations,
  passwordValidations,
  oldPasswordValidations,
  newPasswordValidations,
  confirmPasswordValidations,
  phoneNumberValidations,
  integerValidation,
  booleanValidation,
  urlValidations,
  shouldBeAnArray,
  conversationMessageValidations,
  imageValidations,
  descriptionValidations,
  cityValidations,
  stateValidations,
  countryValidations,
  titleValidations,
  categoryIdValidations,
  categoryValidations,
  latitudeValidations,
  longitudeValidations,
  addressValidations,
  radiusValidations,
  packagesValidations,
  imagesValidations,
  sellerUserIdValidations,
  serviceIdValidations,
  workStartDateValidations,
  workStartTimeValidations,
  bookingIdValidations,
  ratingValidations,
  reviewValidations,
  receiverUserIdValidations,
  messageTextValidations,
  catIdValidations,
  userIdValidations,
  keywordValidations,
  otpValidations,
  jwtIdValidations,
  nameValidations,
};
