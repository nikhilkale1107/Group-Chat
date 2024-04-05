const Chat = require("../models/chat");

exports.postChat = async (req, res, next) => {
  const { msg } = req.body;
  console.log(msg);
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