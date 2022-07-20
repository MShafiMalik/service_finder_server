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
  convertToCapitalize,
} = require("../utils/utility");

const UserModel = require("../database/models/users");
const userRole = require("../middlewares/userRole");

class AuthService {
  async signup(
    firstname,
    lastname,
    email,
    password,
    password_confirmation,
    role
  ) {
    if (
      firstname &&
      lastname &&
      email &&
      password &&
      password_confirmation &&
      role
    ) {
      role = convertToCapitalize(role);
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
          firstname: firstname,
          lastname: lastname,
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
          firstname: new_user.firstname,
          lastname: new_user.lastname,
          email: new_user.email,
          role: new_user.role,
          activation_key: otp_key,
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

  async resend_activation_key(email) {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not Registered!"
      );
    }
    const otp_obj = {
      key: user.activation_key,
    };
    const otp_key = encryptData(otp_obj);
    console.log(otp_key);
    const response = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      activation_key: otp_key,
    };
    return successResponse(
      response,
      HTTP_STATUS.OK,
      "Activation Key Sent Successfully!"
    );
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
          User: {
            name: user.name,
            email: user.email,
            role: user.role,
          },
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
    if (user.is_active === true) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Already Registered!"
      );
    }
    const otp_obj = await decryptData(key);
    if (!otp_obj) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid Key");
    }
    if (user.activation_key === otp_obj.key) {
      user.is_active = true;
      await user.save();
      return successResponse(
        { User: user },
        HTTP_STATUS.OK,
        "User Activated Successfully!"
      );
    } else {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid Key");
    }
  }

  async reset_password(email, password) {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not Registered!"
      );
    }
    const hash_pass = await generatePasswordHash(password);
    user.password = hash_pass;
    await user.save();
    const response = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };
    return successResponse(
      response,
      HTTP_STATUS.OK,
      "Password Updated Successfully!"
    );
  }

  async add_personal_info(
    email,
    phone,
    image,
    description,
    city,
    state,
    country
  ) {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "This User Is Not Registered!"
      );
    }
    user.phone = phone;
    user.image = image;
    user.description = description;
    user.city = city;
    user.state = state;
    user.country = country;
    await user.save();
    const response = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      image: user.image,
      city: user.city,
      state: user.state,
      country: user.country,
      description: user.description,
      role: user.role,
    };
    return successResponse(
      response,
      HTTP_STATUS.OK,
      "Password Updated Successfully!"
    );
  }
}

module.exports = AuthService;
