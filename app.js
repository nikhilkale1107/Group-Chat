const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const io = require('socket.io')(4000);
var CronJob = require("cron").CronJob;

require("dotenv").config();

const sequelize = require("./utils/database");

const { getUserDetails } = require("./utils/user-base");
const { addChat } = require("./utils/chat-base");
const { moveChatToArchive } = require("./utils/cron");

const app = express();

const PORT = 3000;

//Importing Routes
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const newGroupRouter = require("./routes/newgroup");
const groupRouter = require("./routes/group");
const adminRouter = require("./routes/admin");

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  {
    flags: "a",
  }
);

//Middlewares
app.use(
    cors({
    // origin: "http://127.0.0.1:5500",
    origin: "*",
    credentials: true,
  }));
app.use(bodyParser.json());
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "data:", "blob:"],

      fontSrc: ["'self'", "https:", "data:"],

      scriptSrc: ["'self'", "unsafe-inline"],

      scriptSrc: ["'self'", "https://*.cloudflare.com"],

      scriptSrcElem: ["'self'", "https:", "https://*.cloudflare.com"],

      styleSrc: ["'self'", "https:", "unsafe-inline"],

      connectSrc: ["'self'", "data", "https://*.cloudflare.com"],
    },
  })
);
app.use(morgan("common", { stream: accessLogStream }));

//Routes
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/new-group", newGroupRouter);
app.use("/groups", groupRouter);
app.use("/admin", adminRouter);

//Importing Models for Relationships
const User = require("./models/user");
const Chat = require("./models/chat");
const GroupChat = require("./models/groupchat");
const Admin = require("./models/admin");
const ArchiveChat = require("./models/archiveChats");


//Relationships
User.hasMany(Chat);
Chat.belongsTo(User);

GroupChat.hasMany(Chat);
Chat.belongsTo(GroupChat);

User.belongsToMany(GroupChat, { through: "usergroup" });
GroupChat.belongsToMany(User, { through: "usergroup" });

GroupChat.hasMany(Admin);
User.hasMany(Admin);

User.hasMany(ArchiveChat);
ArchiveChat.belongsTo(User);

GroupChat.hasMany(ArchiveChat);
ArchiveChat.belongsTo(GroupChat);

// CRON JOB
const job = new CronJob(
  "0 0 * * *",
  moveChatToArchive,
  null,
  true,
  "Asia/Kolkata"
);
job.start();

//SOCKET IO LOGIC
const BOTNAME = "Chat Bot";

//Run when client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", async ({ userId, gpId, userName }) => {
    console.log("gpId", gpId);
    console.log(`${userName} joined ${gpId}`);
    const user = await getUserDetails(userId);
    socket.join(gpId);

    //Welcome current User
    socket.to(gpId).emit("message", {
      userId: -1,
      message: "Welcome to Chat app",
      userName: BOTNAME,
      gpId: -1,
    });

    //Broadcast when user connects to chat
    socket.to(gpId).emit("message", {
      userId: -1,
      message: `${userName} has connected to the chat`,
      userName: BOTNAME,
      gpId: -1,
    });
  });

  socket.on("chatMessage", async (data) => {
    // console.log(data);
    const [formattedData] = await Promise.all([
      getUserDetails(data.userId, data.message),
      addChat(data.gpId, data.message, data.userId),
    ]);
    console.log(formattedData);
    socket.to(data.gpId).emit("message", formattedData);
  });

  socket.on("upload", async (fileData, cb) => {
    console.log("file", fileData);
    const fileUrl = await storeMultimedia(
      fileData.fileBuffer,
      fileData.gpId,
      fileData.fileName
    );
    console.log(fileUrl);
    addChat(fileData.gpId, fileUrl, fileData.userId);
    cb(fileUrl);
  });

   //Leaving the room
   socket.on("leaveRoom", ({ userId, gpId, userName }) => {

    //Broadcast when user disconnects from chat
    socket.to(gpId).emit("message", {
      userId: -1,
      message: `${userName} has left the chat`,
      userName: BOTNAME,
      gpId: -1,
    });
    console.log(`${userName} left ${gpId}`);
    socket.leave(gpId);
});
});

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((errr) => console.log(errr));