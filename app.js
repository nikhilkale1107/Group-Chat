const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config();

const sequelize = require("./utils/database");

const app = express();

const PORT = 3000;

//Importing Routes
const userRouter = require("./routes/user");

//Middlewares
app.use(cors());
app.use(bodyParser.json());

//Routes
app.use("/user", userRouter);

sequelize
  .sync({ force: false })
  .then((result) => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((errr) => console.log(errr));