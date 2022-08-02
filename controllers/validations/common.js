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

const firstnameValidations = (paramName = "firstname") => {
  return isRequiredValidations(paramName);
};
const lastnameValidations = (paramName = "lastname") => {
  return isRequiredValidations(paramName);
};

const imageValidations = (paramName = "image") => {
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

const stringDateValidations = (paramName = "date", isFutureDate = false) => {
  return [
    check(paramName)
      .isLength({ min: 10, max: 10 })
      .withMessage("Length should be 10")
      .custom((value, { _req }) => {
        const dateArray = value.split("/");
        if (dateArray.length === 3) {
          const date = Number(dateArray[0]);
          const month = Number(dateArray[1]);
          const year = Number(dateArray[2]);
          const dateConverted = new Date(year, month - 1, date);
          try {
            if (!(dateConverted instanceof Date && !isNaN(dateConverted))) {
              throw new Error(
                `Invalid ${paramName} format. Valid format is dd/mm/yyyy`
              );
            }
          } catch (error) {
            throw new Error(
              `Invalid ${paramName} format. Valid format is dd/mm/yyyy`
            );
          }
          if (isFutureDate && dateConverted < new Date()) {
            throw new Error(
              `Invalid ${paramName}. Only future date is allowed`
            );
          }
        } else
          throw new Error(
            `Invalid ${paramName} format. Valid format is dd/mm/yyyy`
          );
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

// this will concatenate all array into one array
const concatValidations = (...arraysOfArray) => {
  return [].concat(arraysOfArray);
};

const titleValidations = (paramName = "title") => {
  return isRequiredValidations(paramName);
};
const categoryIdValidations = (paramName = "category") => {
  return isRequiredValidations(paramName);
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

const subWeeklyScheduleValidations = (day_value, day_name) => {
  if (!day_value) {
    return {
      status: "error",
      message: `${day_name} of weekly schedule is required`,
    };
  }
  if (day_value === "off") {
    return {
      status: "success",
      message: "",
    };
  }
  if (typeof day_value !== "object") {
    return {
      status: "error",
      message: `${day_name} of weekly schedule is invalid, It should be a valid start and end time or off!`,
    };
  }
  if (!day_value.start.match(time_regx)) {
    return {
      status: "error",
      message: `Incorrect from time of ${day_name}, It should be a valid time`,
    };
  }
  if (!day_value.end) {
    return {
      status: "error",
      message: `To time of ${day_name} of weekly schedule is required`,
    };
  }
  return {
    status: "success",
    message: "",
  };
};

const weeklyScheduleValidations = (paramName = "weekly_schedule") => {
  return check(paramName).custom((value) => {
    if (typeof value !== "object" || value === null) {
      return Promise.reject(`${paramName} Is Required`);
    }
    const mon_response = subWeeklyScheduleValidations(value.mon, "Monday");
    if (mon_response.status === "error") {
      return Promise.reject(mon_response.message);
    }
    const tue_response = subWeeklyScheduleValidations(value.tue, "Tuesday");
    if (tue_response.status === "error") {
      return Promise.reject(tue_response.message);
    }
    const wed_response = subWeeklyScheduleValidations(value.wed, "Wednesday");
    if (wed_response.status === "error") {
      return Promise.reject(wed_response.message);
    }
    const thu_response = subWeeklyScheduleValidations(value.thu, "Thursday");
    if (thu_response.status === "error") {
      return Promise.reject(thu_response.message);
    }
    const fri_response = subWeeklyScheduleValidations(value.fri, "Friday");
    if (fri_response.status === "error") {
      return Promise.reject(fri_response.message);
    }
    const sat_response = subWeeklyScheduleValidations(value.sat, "Saturday");
    if (sat_response.status === "error") {
      return Promise.reject(sat_response.message);
    }
    const sun_response = subWeeklyScheduleValidations(value.sun, "Sunday");
    if (sun_response.status === "error") {
      return Promise.reject(sun_response.message);
    }
    return Promise.resolve();
  });
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

const sellerUserIdValidations = (paramName = "seller_user_id") => {
  return mongodbIdValidation(paramName);
};
const serviceIdValidations = (paramName = "service_id") => {
  return mongodbIdValidation(paramName);
};
const workStartDatetimeValidations = (paramName = "work_start_datetime") => {
  return isRequiredValidations(paramName);
};
const bookingIdValidations = (paramName = "booking_id") => {
  return mongodbIdValidation(paramName);
};

const ratingValidations = (paramName = "rating") => {
  return coordinateValidations(paramName, 0, 5);
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
  phoneNumberValidations,
  stringDateValidations,
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
  latitudeValidations,
  longitudeValidations,
  addressValidations,
  radiusValidations,
  packagesValidations,
  imagesValidations,
  weeklyScheduleValidations,
  sellerUserIdValidations,
  serviceIdValidations,
  workStartDatetimeValidations,
  bookingIdValidations,
  ratingValidations,
  reviewValidations,
  receiverUserIdValidations,
  messageTextValidations,
};
