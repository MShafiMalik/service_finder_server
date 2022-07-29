const { Model } = require("mongoose");
const ChatRoomModel = require("../database/models/chat_rooms");
const MessageModel = require("../database/models/messages");
const UserModel = require("../database/models/users");
const { HTTP_STATUS, ROLE_TYPES } = require("../utils/constants");
const { successResponse, errorResponse } = require("../utils/utility");

class MessageService {
  async send(user, receiver_user_id, message_text) {
    const receiver_user = await UserModel.findById(receiver_user_id);
    if (!receiver_user) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Receiver User Not Found!");
    }
    let chat_room = await ChatRoomModel.findOne({
      $or: [
        { user1_id: user._id, user2_id: receiver_user._id },
        { user1_id: receiver_user._id, user2_id: user._id },
      ],
    })
      .populate({
        path: "user1_id",
        Model: "User",
        select: "-password -__v",
      })
      .populate({
        path: "user2_id",
        Model: "User",
        select: "-password -__v",
      });
    if (!chat_room) {
      chat_room = new ChatRoomModel({
        user1_id: user._id,
        user2_id: receiver_user._id,
      });
      await chat_room.save();
    }
    const message = new MessageModel({
      chat_room_id: chat_room._id,
      sender_user_id: user._id,
      receiver_user_id: receiver_user._id,
      message: message_text,
    });
    await message.save();
    return successResponse(
      message,
      HTTP_STATUS.OK,
      "Message Sent Successfully!"
    );
  }

  async get_chat(user, receiver_user_id) {
    const receiver_user = await UserModel.findById(receiver_user_id);
    if (!receiver_user) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Receiver User Not Found!");
    }
    let chat_room = await ChatRoomModel.findOne({
      $or: [
        { user1_id: user._id, user2_id: receiver_user._id },
        { user1_id: receiver_user._id, user2_id: user._id },
      ],
    });
    if (!chat_room) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Receiver User Not Found!");
    }
    const messages = await MessageModel.find({ chat_room_id: chat_room._id });
    return successResponse(messages, HTTP_STATUS.OK);
  }

  async get_chat_rooms(user) {
    let chat_rooms = await ChatRoomModel.find({
      $or: [{ user1_id: user._id }, { user2_id: user._id }],
    })
      .populate({
        path: "user1_id",
        Model: "User",
        select: "-password -__v",
      })
      .populate({
        path: "user2_id",
        Model: "User",
        select: "-password -__v",
      });
    return successResponse(chat_rooms, HTTP_STATUS.OK);
  }
}

module.exports = MessageService;
