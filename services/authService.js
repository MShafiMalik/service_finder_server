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
  convertToCapitalize,
} = require("../utils/utility");

const UserModel = require("../database/models/users");

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
        console.log(new_user.activation_key);
        const updated_user = await UserModel.findById(new_user._id).select([
          "-password",
          "-key_expire_time",
        ]);
        return successResponse(
          updated_user,
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
    user.activation_key = getRandomNumber(100000, 999999);
    user.key_expire_time = new Date();
    await user.save();
    const updated_user = await UserModel.findById(user._id).select([
      "-password",
      "-key_expire_time",
    ]);
    return successResponse(
      updated_user,
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
          user_id: user._id,
        };
        const token = await generateJwtToken(userObj);
        let updated_user = await UserModel.findById(user._id).select([
          "-password",
          "-activation_key",
          "-key_expire_time",
        ]);

        const response = {
          user: updated_user,
          token: token,
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
    const current_timestamp = new Date().getTime();
    const key_expire_timetamp = user.key_expire_time.getTime();
    const diff_timestamp = current_timestamp - key_expire_timetamp;
    if (diff_timestamp > 60000) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "OTP Is Expired!");
    }
    if (user.activation_key === parseInt(key)) {
      user.is_active = true;
      await user.save();
      const updated_user = await UserModel.findById(user._id).select([
        "-password",
        "-activation_key",
        "-key_expire_time",
      ]);
      const userObj = {
        user_id: updated_user._id,
      };
      const token = await generateJwtToken(userObj);
      return successResponse(
        { user: updated_user, token: token },
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
    const updated_user = await UserModel.findById(user._id).select([
      "-password",
      "-activation_key",
      "-key_expire_time",
    ]);
    return successResponse(
      updated_user,
      HTTP_STATUS.OK,
      "Password Updated Successfully!"
    );
  }

  async change_password(user, old_password, new_password) {
    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Old Password Is Invalid");
    }
    const hash_pass = await generatePasswordHash(new_password);
    user.password = hash_pass;
    await user.save();
    const updated_user = await UserModel.findById(user._id).select([
      "-password",
      "-activation_key",
      "-key_expire_time",
    ]);
    return successResponse(
      updated_user,
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
    const updated_user = await UserModel.findById(user._id).select([
      "-password",
      "-activation_key",
      "-key_expire_time",
    ]);
    return successResponse(
      updated_user,
      HTTP_STATUS.OK,
      "Password Updated Successfully!"
    );
  }

  async update_profile(user, body) {
    const {
      firstname,
      lastname,
      email,
      phone,
      image,
      description,
      city,
      state,
      country,
    } = body;
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = email;
    user.phone = phone;
    user.image = image;
    user.description = description;
    user.city = city;
    user.state = state;
    user.country = country;
    await user.save();
    const updated_user = await UserModel.findById(user._id).select([
      "-password",
      "-activation_key",
      "-key_expire_time",
    ]);
    return successResponse(
      updated_user,
      HTTP_STATUS.OK,
      "Profile Updated Successfully!"
    );
  }
}

module.exports = AuthService;
