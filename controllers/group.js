const User = require("../models/user");
const GroupChat = require("../models/groupchat");

exports.getGroups = async (req, res, next) => {
  try {
    const groups = await GroupChat.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: User,
          attributes: [],
          where: { id: req.user.id },
        },
      ],
    });
    console.log(groups);
    res.json({
      groups: groups,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
    });
  }
};