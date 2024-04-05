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

//Importing Routes for Relationships
const User = require("./models/user");
const Chat = require("./models/chat");

//Relationships
User.hasMany(Chat);
Chat.belongsTo(User);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((errr) => console.log(errr));