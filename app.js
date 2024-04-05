const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const sequelize = require("./utils/database");

const app = express();

const PORT = 3000;

//Importing Routes
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const newGroupRouter = require("./routes/new-group");
const groupRouter = require("./routes/group");

//Middlewares
app.use(
    cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  }));
app.use(bodyParser.json());

//Routes
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/new-group", newGroupRouter);
app.use("/groups", groupRouter);

//Importing Models for Relationships
const User = require("./models/user");
const Chat = require("./models/chat");
const GroupChat = require("./models/groupchat");


//Relationships
User.hasMany(Chat);
Chat.belongsTo(User);

GroupChat.hasMany(Chat);
Chat.belongsTo(GroupChat);

User.belongsToMany(GroupChat, { through: "usergroup" });
GroupChat.belongsToMany(User, { through: "usergroup" });

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((errr) => console.log(errr));