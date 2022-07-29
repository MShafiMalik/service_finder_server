const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema({
  user1_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  user2_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  created_at: { type: Date, default: Date.now() },
});

const ChatRoomModel = mongoose.model("chat_rooms", chatRoomSchema);

module.exports = ChatRoomModel;
