const Chat = require("../models/chat");
const User = require("../models/User");
const { Op } = require("sequelize");

exports.postChat = async (req, res, next) => {
  const { msg } = req.body;
  try {
    const chat = await req.user.createChat({
      message: msg,
    });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
};

exports.getChat = async (req, res, next) => {
  const lastMsgId = req.query.lastMsgId;
  console.log(lastMsgId);
  try {
    const chats = await Chat.findAll({
      where: { id: { [Op.gt]: lastMsgId } },
      include: [
        {
          model: User,
          attributes: ["userName"],
        },
      ],
    });
    console.log(chats)
    res.json({
      success: true,
      chats: chats,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
    });
  }
};