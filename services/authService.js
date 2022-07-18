const bcrypt = require("bcryptjs");
const logger = require("../logger/logger");
const { HTTP_STATUS, LOGGER_TAGS } = require("../utils/constants");
const {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
  generateJwtToken,
  generatePasswordHash,
  getRandomNumber,
  encryptData,
  decryptData,
} = require("../utils/utility");

const UserModel = require("../database/models/users");

class AuthService {
  async signup(name, email, password, password_confirmation, role) {
    if (name && email && password && password_confirmation && role) {
      const user = await UserModel.findOne({ email: email });
      if (user) {
        return errorResponse(
          HTTP_STATUS.CONFLICT,
          "Already Have an account please SignIn"
        );
      }

      if (password !== password_confirmation) {
        return errorResponse(
          HTTP_STATUS.CONFLICT,
          "Password and Confirm Password doesn't match"
        );
      }

      try {
        const hash_pass = await generatePasswordHash(password);
        const new_user = new UserModel({
          name: name,
          email: email,
          password: hash_pass,
          role: role,
          is_active: false,
          activation_key: getRandomNumber(100000, 999999),
        });
        await new_user.save();
        const otp_obj = {
          key: new_user.activation_key,
        };
        const otp_key = encryptData(otp_obj);
        console.log(otp_key);
        const response = {
          name: new_user.name,
          email: new_user.email,
          role: new_user.role,
        };
        return successResponse(
          response,
          HTTP_STATUS.OK,
          "User Created Successfully!"
        );
      } catch (error) {
        logger.error(
          LOGGER_TAGS.FOOTPRINT,
          `AuthService.signup(email:${email})`,
          error
        );
        return internalServerErrorResponse();
      }
    } else {
      return errorResponse(
        HTTP_STATUS.NOT_ACCEPTABLE,
        "All Fields Are Required!"
      );
    }
  }

  async login(email, password) {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        return errorResponse(
          HTTP_STATUS.UNAUTHORIZED,
          "This User Is Not Registered!"
        );
      }
      if (user.is_active === false) {
        return errorResponse(
          HTTP_STATUS.UNAUTHORIZED,
          "Please Verify Your Email Before Login!"
        );
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const userObj = {
          id: user._id,
          email: user.email,
          role: user.role,
        };

        const token = await generateJwtToken(userObj);
        const response = {
          Token: token,
          Email: user.email,
        };
        return successResponse(
          response,
          HTTP_STATUS.OK,
          "User Logged In Successfully!"
        );
      } else {
        return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Password Is Invalid");
      }
    } catch (error) {
      logger.error(
        LOGGER_TAGS.FOOTPRINT,
        `AuthService.login(email:${email})`,
        error
      );
      return internalServerErrorResponse();
    }
  }

  async verify_email(email, key) {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not Registered!"
      );
    }
    const otp_obj = decryptData(key);
    if (user.activation_key === otp_obj.key) {
      user.is_active = true;
      user.save();
      return successResponse(
        user,
        HTTP_STATUS.OK,
        "User Activated Successfully!"
      );
    }
  }
}

module.exports = AuthService;
