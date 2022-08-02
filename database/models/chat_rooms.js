const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  created_at: { type: Date, default: Date.now() },
});

const ChatRoomModel = mongoose.model("ChatRoom", chatRoomSchema, "chat_rooms");

module.exports = ChatRoomModel;
