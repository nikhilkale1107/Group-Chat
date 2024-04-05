const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Authenticate = (req, res, next) => {
  const token = req.headers["authentication"];
  console.log(token);

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, jwtData) => {
    console.log(err);
    if (err) return res.sendStatus(403);
    const user = await User.findByPk(jwtData.id);
    req.user = user;
    next();
  });
};

module.exports = Authenticate;