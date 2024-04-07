const User = require("../models/user");

exports.getUserDetails = async (id, message) => {
  console.log(id, message);
  const user = await User.findByPk(id);
  return {
    userId: user.id,
    userName: user.userName,
    message: message,
  };
};