const express = require("express");
const router = express.Router();
const MessageController = require("../controllers/messageController");
const messagesValidations = require("../controllers/validations/messagesValidations");
const validateApiRequest = require("../controllers/validations/validateRequest");
const CheckAuthToken = require("../middlewares/checkAuthToken");

router.post(
  "/send",
  CheckAuthToken,
  messagesValidations.sendMessageValidations(),
  validateApiRequest,
  MessageController.send
);

router.post(
  "/get-chat",
  CheckAuthToken,
  messagesValidations.getChatValidations(),
  validateApiRequest,
  MessageController.get_chat
);

router.get("/get-chat-rooms", CheckAuthToken, MessageController.get_chat_rooms);

module.exports = router;
