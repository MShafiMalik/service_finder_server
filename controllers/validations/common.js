const _ = require("lodash");
const { check, validationResult, checkSchema } = require("express-validator");
const commonRegex = /^[a-zA-Z0-9\s!()?'\"\“\-@#&$%*=+/,.\\]{3,50}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d#?!@$%^&*_-]{8,20}$/;
const organizationNameRegex = commonRegex;
const contactNameRegex = /^[a-zA-Z -']{3,50}$/;
const insurerNameRegex = commonRegex;
const insurerTypeRegex = commonRegex;
const accreditationTypeRegex = commonRegex;
const registrationNumberRegex = commonRegex;
const {
  PROVIDER_REQUEST_STATUS,
  PROVIDER_EXAMPLE_TYPES,
  PAGE_SIZE,
  VALID_FILE_TYPES,
} = require("../../utils/constants");
const { decryptData } = require("../../utils/utility");

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
  return [
    check(param)
      .trim()
      .notEmpty({
        ignore_whitespace: true,
      })
      .withMessage(`${param} field is required`),
  ];
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

const organizationNamesValidations = (paramName = "organizationName") => {
  return [
    check(paramName)
      .isLength({ min: 3, max: 50 })
      .withMessage(
        `Organization name length should be in between 3 to 50 characters`
      )
      .matches(organizationNameRegex)
      .withMessage(`Please enter valid format for organization name`),
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

const aboutValidations = (paramName = "about") => {
  return [
    check(paramName)
      .isLength({ min: 10, max: 500 })
      .withMessage(`About length should be in between 10 to 500 characters`),
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

const providerRequestStatusValidations = (
  paramName = "providerRequestStatus",
  errorMsg = null
) => {
  let schema = {};
  schema[paramName] = {
    in: "body",
    isIn: {
      options: [Object.values(PROVIDER_REQUEST_STATUS)],
      errorMessage: errorMsg
        ? errorMsg
        : `Invalid ${paramName}. Valid values are ${[
            ...new Set(Object.values(PROVIDER_REQUEST_STATUS)),
          ]}`,
    },
  };
  return [checkSchema(schema)];
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

const idValidations = (paramName = "id", isOptional = false) => {
  if (isOptional) {
    return [
      check(paramName)
        .trim()
        .optional({ nullable: true, checkFalsy: true })
        .isNumeric()
        .withMessage(`Please enter valid ${paramName} id.`),
    ];
  }
  return [
    check(paramName)
      .trim()
      .isNumeric()
      .withMessage(`Please enter valid ${paramName}`),
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

const exampleTypeValidations = (paramName = "type", errorMsg = null) => {
  let schema = {};
  schema[paramName] = {
    in: "body",
    isIn: {
      options: [Object.values(PROVIDER_EXAMPLE_TYPES)],
      errorMessage: errorMsg
        ? errorMsg
        : `Invalid ${paramName}. Valid values are ${[
            ...new Set(Object.values(PROVIDER_EXAMPLE_TYPES)),
          ]}`,
    },
  };
  return [checkSchema(schema)];
};

const compareOriginalFileName = (
  paramName = "originalFileName",
  fileNameParam = "fileName",
  required = true,
  isWildCard = false
) => {
  let isRequired = null;
  if (required)
    isRequired = check(paramName)
      .notEmpty()
      .withMessage(`${paramName} is required`);
  else
    isRequired = check(paramName).optional({
      nullable: true,
      checkFalsy: true,
    });
  return [
    isRequired.custom((value, { req, path }) => {
      const originalFileNameArray = value.split(".");
      if (originalFileNameArray.length > 0) {
        const fileName = !isWildCard
          ? req.body[fileNameParam]
          : _.get(
              req.body,
              path.replace(
                paramName.substr(paramName.lastIndexOf(".")),
                fileNameParam.substr(fileNameParam.lastIndexOf("."))
              )
            );
        if (!fileName) throw new Error(`${fileNameParam} is required`);
        const fileNameExtension = fileName.substring(
          fileName.lastIndexOf(".") + 1
        );
        if (value.substring(value.lastIndexOf(".") + 1) !== fileNameExtension)
          throw new Error(
            "original file name extension not matched with file name"
          );
      } else throw new Error(`No extension found for ${paramName}.`);
      return true;
    }),
  ];
};

const contactNameValidations = (paramName = "contactName") => {
  return [
    check(paramName)
      .isLength({ min: 3, max: 50 })
      .withMessage(`Contact name length should be in between 3 to 50`)
      .matches(contactNameRegex)
      .withMessage(`Please enter valid format for contact name`),
  ];
};

const nationwideValidation = (paramName = "nationwide") => {
  return [
    check(paramName)
      .matches(true)
      .withMessage(`${paramName} should have to be true`),
  ];
};

const requiredParamValidation = (paramName = "id") => {
  return [
    check(paramName)
      .notEmpty({
        ignore_whitespace: true,
      })
      .withMessage(`${paramName} is required`),
  ];
};

const accreditationRegistrationNumber = (paramName = "registrationNumber") => {
  return [
    check(paramName)
      .notEmpty({
        ignore_whitespace: true,
      })
      .withMessage("Registration number is required")
      .isLength({ min: 3, max: 20 })
      .withMessage(`Registration number length should be in between 3 to 20`)
      .matches(registrationNumberRegex)
      .withMessage(`Please enter valid format for Registration number type`),
  ];
};

const accreditationType = (paramName = "type") => {
  return [
    check(paramName)
      .notEmpty({
        ignore_whitespace: true,
      })
      .withMessage("Registration type is required")
      .isLength({ min: 3, max: 60 })
      .withMessage(`Registration type length should be in between 3 to 60`)
      .matches(accreditationTypeRegex)
      .withMessage(`Please enter valid format for registration type`),
  ];
};

const insurerNameValidation = (paramName = "insurerName") => {
  return [
    check(paramName)
      .notEmpty({
        ignore_whitespace: true,
      })
      .withMessage("Insurer name is required")
      .isLength({ min: 3, max: 60 })
      .withMessage(`Insurer name length should be in between 3 to 60`)
      .matches(insurerNameRegex)
      .withMessage(`Please enter valid format for Insurer name`),
  ];
};
const insuranceTypeValidation = (paramName = "insuranceType") => {
  return [
    check(paramName)
      .notEmpty({
        ignore_whitespace: true,
      })
      .withMessage("Insurer type is required")
      .isLength({ min: 3, max: 60 })
      .withMessage(`Insurance type length should be in between 3 to 60`)
      .matches(insurerTypeRegex)
      .withMessage(`Please enter valid format for Insurance type`),
  ];
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

const pageSizeValidations = (pageSize) => {
  const paramName = pageSize || "pageSize";

  let schema = {};
  schema[paramName] = {
    in: "params",
    isIn: {
      options: [Object.values(PAGE_SIZE)], // get record limit and convert into array
      errorMessage: `Invalid ${paramName}. Valid values are ${[
        ...new Set(Object.values(PAGE_SIZE)),
      ]}`, // only send unique values in error
    },
  };
  return [checkSchema(schema)];
};

const pageNumberValidations = (pageNumber) => {
  const paramName = pageNumber || "pageNumber";
  return [
    check(paramName)
      .isNumeric({ no_symbols: true })
      .withMessage(`Only numbers are allowed in ${paramName}.`),
  ];
};

const fileTypeValidations = (fileType) => {
  const paramName = fileType || "fileType";
  let schema = {};
  schema[paramName] = {
    in: "params",
    isIn: {
      options: [Object.values(VALID_FILE_TYPES)], // get file types and convert into array
      errorMessage: `Invalid ${paramName}. Valid values are ${[
        ...new Set(Object.values(VALID_FILE_TYPES)),
      ]}`, // only send unique values in error
    },
  };
  return [checkSchema(schema)];
};

const emailVerificationTokenValidations = (paramName = "token") => {
  return [
    check(paramName)
      .notEmpty()
      .withMessage(`Token is required ${paramName}`)
      .custom((token) => {
        const isValidToken = decryptData(token);
        if (isValidToken) {
          return Promise.resolve();
        } else return Promise.reject("Invalid token provided");
      }),
  ];
};

const arrayValidations = (
  paramName = "",
  required = true,
  dbCall = null,
  dbValueToUse = "id"
) => {
  return [
    check(paramName)
      .isArray(required && { min: 1 })
      .withMessage(`Please select at least one value`)
      .custom((values) => {
        return dbCall.then((validValues) => {
          const validValuesArray = validValues.map((x) => x[dbValueToUse]);
          const invalidValues = values.filter(
            (x) => validValuesArray.indexOf(x) == -1
          );
          if (invalidValues && invalidValues.length > 0)
            return Promise.reject(
              `Invalid ${paramName}. Valid values are ${[
                ...new Set(validValues),
              ]}`
            );
          return Promise.resolve();
        });
      }),
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

module.exports = {
  validateRequest,
  concatValidations,
  firstnameValidations,
  lastnameValidations,
  roleValidations,
  emailValidations,
  passwordValidations,
  organizationNamesValidations,
  contactNameValidations,
  idValidations,
  phoneNumberValidations,
  providerRequestStatusValidations,
  emailVerificationTokenValidations,
  pageSizeValidations,
  pageNumberValidations,
  fileTypeValidations,
  stringDateValidations,
  requiredParamValidation,
  compareOriginalFileName,
  arrayValidations,
  nationwideValidation,
  insurerNameValidation,
  insuranceTypeValidation,
  integerValidation,
  booleanValidation,
  aboutValidations,
  urlValidations,
  accreditationRegistrationNumber,
  accreditationType,
  shouldBeAnArray,
  exampleTypeValidations,
  conversationMessageValidations,
  isRequiredValidations,
  imageValidations,
  descriptionValidations,
  cityValidations,
  stateValidations,
  countryValidations,
};
