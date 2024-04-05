const Chat = require("../models/chat");
const User = require("../models/user");
const { Op } = require("sequelize");

exports.postChat = async (req, res, next) => {
  const { msg } = req.body;
  const gpId = req.query.gpId;
  console.log(gpId);
  try {
    const chat = await req.user.createChat({
      message: msg,
      groupchatId: gpId,
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
  const gpId = req.query.gpId;
  console.log(gpId);
  console.log(lastMsgId);
  try {
    const chats = await Chat.findAll({
      where: { id: { [Op.gt]: lastMsgId, groupchatId: gpId } },
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