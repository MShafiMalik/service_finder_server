const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat_room: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ChatRoom",
  },
  sender_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  receiver_user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  message: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now() },
});

const MessageModel = mongoose.model("Message", messageSchema, "messages");

module.exports = MessageModel;
