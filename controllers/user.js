const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.postNewUser = async (req, res, next) => {
  const { userName, email, phone, password } = req.body;
  try {
    const existingUser = await User.findAll({ where: { email: email } });
    console.log(existingUser);
    if (existingUser.length !== 0) {
      return res.status(409).json({
        message: "User already exists",
      });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      console.log(err);
      console.log("hash", hash);
      const user = await User.create({
        userName: userName,
        email: email,
        phone: phone,
        password: hash,
      });
      res.status(200).json({
        success: true,
        user: user,
      });
    });
  } catch (err) {
    console.log(err);
  }
};