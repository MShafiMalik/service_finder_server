const _ = require("lodash");
const { check, validationResult } = require("express-validator");

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
      .optional({ nullable: true, checkFalsy: true })
      .isLength({ min: 3, max: 12 })
      .withMessage("Length should be 3 to 12 in phone number"),
    // .isNumeric()
    // .withMessage(`Please enter valid phone number.`),
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

const passwordValidations = (paramName = "password") => {
  return [
    check(paramName)
      .isLength({ min: 8, max: 15 })
      .withMessage(`Password length should be in between 8 to 15`),
    // .matches(passwordRegex)
    // .withMessage(`Please enter valid ${paramName} format`),
  ];
};

// this will concatenate all array into one array
const concatValidations = (...arraysOfArray) => {
  return [].concat(arraysOfArray);
};

const titleValidations = (paramName = "title") => {
  return isRequiredValidations(paramName);
};
const categoryIdValidations = (paramName = "category_id") => {
  return isRequiredValidations(paramName);
};

const coordinateValidations = (paramName, min, max) => {
  return [
    check(paramName)
      .notEmpty()
      .withMessage(`${paramName} Is Required`)
      .isNumeric()
      .withMessage(`${paramName} Is Not A Number`)
      .isLength({ min: min, max: max })
      .withMessage(`Length should be ${min} to ${max} in ${paramName}`)
      .custom((value) => {
        if (value < min || value > max) {
          return Promise.reject(
            `Length should be ${min} to ${max} in ${paramName}`
          );
        }
        return Promise.resolve();
      }),
  ];
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
    .withMessage(`${paramName} Is Required`)
    .isNumeric()
    .withMessage(`${paramName} Is Not A Number`);
};

const subPackageValidations = (pkg_value, pkg_name) => {
  if (typeof pkg_value !== "object" || pkg_value === null) {
    return Promise.reject(`${pkg_name} Package Is Required`);
  }
  if (!pkg_value.name) {
    return Promise.reject(`Name of ${pkg_name} Package is required`);
  }
  if (!pkg_value.description) {
    return Promise.reject(`Description of ${pkg_name} Package is required`);
  }
  if (!pkg_value.price) {
    return Promise.reject(`Price of ${pkg_name} Package is required`);
  }
  if (typeof pkg_value.price !== "number") {
    return Promise.reject(`Price of ${pkg_name} Package is not a Number`);
  }
};

const packagesValidations = (paramName = "packages") => {
  return check(paramName).custom((value) => {
    if (typeof value !== "object" || value === null) {
      return Promise.reject(`${paramName} Is Required`);
    }
    return subPackageValidations(value.basic);
    return Promise.resolve();
  });
};

module.exports = {
  validateRequest,
  concatValidations,
  firstnameValidations,
  lastnameValidations,
  roleValidations,
  emailValidations,
  passwordValidations,
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
};
