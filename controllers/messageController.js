const messageService = require("../services/messageService");
const MessageService = new messageService();
const { constructResponse } = require("../utils/utility");

class MessageController {
  static send = async (req, res) => {
    const { receiver_user_id, message_text } = req.body;
    const responseData = await MessageService.send(
      req.user,
      receiver_user_id,
      message_text
    );
    return constructResponse(res, responseData);
  };

  static get_chat = async (req, res) => {
    const { receiver_user_id } = req.body;
    const responseData = await MessageService.get_chat(
      req.user,
      receiver_user_id
    );
    return constructResponse(res, responseData);
  };

  static get_chat_rooms = async (req, res) => {
    const responseData = await MessageService.get_chat_rooms(req.user);
    return constructResponse(res, responseData);
  };
}

module.exports = MessageController;
