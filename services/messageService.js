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
        { user1: user._id, user2: receiver_user._id },
        { user1: receiver_user._id, user2: user._id },
      ],
    })
      .populate({
        path: "user1",
        Model: "User",
        select: "-password -__v",
      })
      .populate({
        path: "user2",
        Model: "User",
        select: "-password -__v",
      });
    if (!chat_room) {
      chat_room = new ChatRoomModel({
        user1: user._id,
        user2: receiver_user._id,
      });
      await chat_room.save();
    }
    const message = new MessageModel({
      chat_room: chat_room._id,
      sender_user: user._id,
      receiver_user: receiver_user._id,
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
        { user1: user._id, user2: receiver_user._id },
        { user1: receiver_user._id, user2: user._id },
      ],
    });
    if (!chat_room) {
      return errorResponse(HTTP_STATUS.NOT_FOUND, "Receiver User Not Found!");
    }
    const messages = await MessageModel.find({ chat_room: chat_room._id })
      .populate({
        path: "sender_user",
        Model: "User",
        select: "-password -__v",
      })
      .populate({
        path: "receiver_user",
        Model: "User",
        select: "-password -__v",
      })
      .select("-chat_room");

    return successResponse(messages, HTTP_STATUS.OK);
  }

  async get_chat_rooms(user) {
    const chat_rooms = await ChatRoomModel.aggregate([
      {
        $match: {
          $expr: {
            $or: [{ $eq: ["$user1", user._id] }, { $eq: ["$user2", user._id] }],
          },
        },
      },
      {
        $lookup: {
          from: "messages",
          as: "messages",
          let: { chat_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$chat_room", "$$chat_id"] },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          as: "user1",
          let: { user_id: "$user1" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$user_id"] },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          as: "user2",
          let: { user_id: "$user2" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$user_id"] },
              },
            },
          ],
        },
      },
      { $unwind: "$user1" },
      { $unwind: "$user2" },
    ]).exec();
    return successResponse(chat_rooms, HTTP_STATUS.OK);
  }
}

module.exports = MessageService;
