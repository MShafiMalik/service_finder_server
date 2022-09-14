const bcrypt = require("bcryptjs");
const logger = require("../logger/logger");
const {
  HTTP_STATUS,
  LOGGER_TAGS,
  ADMIN_OTP_STATUS,
} = require("../utils/constants");
const {
  successResponse,
  errorResponse,
  internalServerErrorResponse,
  generateJwtToken,
  getRandomNumber,
  sendOTPMail,
  generatePasswordHash,
  getUserIdFromJwtToken,
} = require("../utils/utility");

const AdminModel = require("../database/models/admins");
const { CLOUDINARY } = require("../config/config");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
  api_key: CLOUDINARY.API_KEY,
  api_secret: CLOUDINARY.API_SECRET,
});

class AdminService {
  async login(email, password) {
    try {
      const admin = await AdminModel.findOne({ email: email });
      if (!admin) {
        return errorResponse(
          HTTP_STATUS.UNAUTHORIZED,
          "You Are Not Registered!"
        );
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (isMatch) {
        const adminObj = {
          user_id: admin._id,
        };
        const new_admin = await AdminModel.findById(admin._id).select(
          "-activation_key -__v -password -otp_status -key_expire_time "
        );
        const token = await generateJwtToken(adminObj);
        const response = {
          user: new_admin,
          token: token,
        };
        return successResponse(
          response,
          HTTP_STATUS.OK,
          "You Logged In Successfully!"
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

  async change_password(admin, old_password, new_password, confirm_password) {
    if (new_password !== confirm_password) {
      return errorResponse(
        HTTP_STATUS.FORBIDDEN,
        "New password and confirm password doesn't match"
      );
    }
    const isMatch = await bcrypt.compare(old_password, admin.password);
    if (!isMatch) {
      return errorResponse(HTTP_STATUS.FORBIDDEN, "Old password is invalid!");
    }
    admin.password = await generatePasswordHash(new_password);
    await admin.save();
    return successResponse(
      "",
      HTTP_STATUS.OK,
      "Password Changed Successfully!"
    );
  }

  async me(admin) {
    const new_admin = await AdminModel.findById(admin._id).select(
      "-activation_key -__v -password -otp_status -key_expire_time "
    );
    return successResponse(new_admin, HTTP_STATUS.OK);
  }

  async forgot_password(email) {
    const admin = await AdminModel.findOne({ email: email });
    if (!admin) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "You Are Not Registered!");
    }
    const otp = getRandomNumber(100000, 999999);
    admin.activation_key = otp;
    admin.key_expire_time = new Date();
    admin.otp_status = ADMIN_OTP_STATUS.SENT;
    admin.save();
    const adminObj = {
      user_id: admin._id,
    };
    const key = await generateJwtToken(adminObj);
    await sendOTPMail({ to: email, otp: otp });
    return successResponse(
      { id: key },
      HTTP_STATUS.OK,
      "OTP Sent To Your Email!"
    );
  }

  async resend_otp(jwt_id) {
    const user_id = await getUserIdFromJwtToken(jwt_id);
    const admin = await AdminModel.findById(user_id);
    if (!admin) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "You Are Not Registered!");
    }
    const otp = getRandomNumber(100000, 999999);
    admin.activation_key = otp;
    admin.key_expire_time = new Date();
    admin.otp_status = ADMIN_OTP_STATUS.SENT;
    admin.save();
    const adminObj = {
      user_id: admin._id,
    };
    const key = await generateJwtToken(adminObj);
    await sendOTPMail({ to: admin.email, otp: otp });
    return successResponse(
      { id: key },
      HTTP_STATUS.OK,
      "OTP Sent To Your Email!"
    );
  }

  async verify_otp(jwt_id, otp) {
    const user_id = await getUserIdFromJwtToken(jwt_id);
    const admin = await AdminModel.findById(user_id);
    if (!admin) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "You Are Not Registered!");
    }
    const current_timestamp = new Date().getTime();
    const key_expire_timetamp = admin.key_expire_time.getTime();
    const diff_timestamp = current_timestamp - key_expire_timetamp;
    if (diff_timestamp > 60000) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "OTP Is Expired!");
    }
    if (
      admin.activation_key === parseInt(otp) &&
      admin.otp_status === ADMIN_OTP_STATUS.SENT
    ) {
      admin.otp_status = ADMIN_OTP_STATUS.VERIFIED;
      await admin.save();
      return successResponse(
        "",
        HTTP_STATUS.OK,
        "You Are Verified Successfully!"
      );
    } else {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "Invalid OTP");
    }
  }

  async reset_password(jwt_id, password) {
    const user_id = await getUserIdFromJwtToken(jwt_id);
    const admin = await AdminModel.findById(user_id);
    if (!admin) {
      return errorResponse(HTTP_STATUS.UNAUTHORIZED, "You Are Not Registered!");
    }
    const current_timestamp = new Date().getTime();
    const key_expire_timetamp = admin.key_expire_time.getTime();
    const diff_timestamp = current_timestamp - key_expire_timetamp;
    if (diff_timestamp > 300000) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Password Reset Session Timeout!"
      );
    }
    if (admin.otp_status !== ADMIN_OTP_STATUS.VERIFIED) {
      return errorResponse(
        HTTP_STATUS.UNAUTHORIZED,
        "Your Email Is Not Verified!"
      );
    }
    admin.password = await generatePasswordHash(password);
    await admin.save();
    return successResponse(
      admin,
      HTTP_STATUS.OK,
      "Password Reset Successfully!"
    );
  }

  async profile_update(admin, name, email, image) {
    if (image) {
      const img_url = admin.image;
      let filename = img_url.substring(img_url.lastIndexOf("/") + 1);
      filename = filename.split(".");
      filename = filename[0];
      cloudinary.uploader.destroy("users/" + filename);
      admin.image = image;
    }
    admin.name = name;
    admin.email = email;
    await admin.save();
    const new_admin = await AdminModel.findById(admin._id).select(
      "-activation_key -__v -password -otp_status -key_expire_time "
    );
    return successResponse(
      new_admin,
      HTTP_STATUS.OK,
      "Your Profile Is Update Successfully!"
    );
  }
}

module.exports = AdminService;
