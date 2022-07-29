const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat_room_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "ChatRoom",
  },
  sender_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  receiver_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  message: { type: String, required: true, trim: true },
  created_at: { type: Date, default: Date.now() },
});

const MessageModel = mongoose.model("messages", messageSchema);

module.exports = MessageModel;
