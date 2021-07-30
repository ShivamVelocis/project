const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
//Environment File handle
dotenv.config();

//Mongoose connection import
require("./src/configs/db");

//Router imports
const contentRoutes = require("./src/ContentManagement/routes/contentRoutes");
const userRoute = require("./src/users/routes/userRouter");
const aclRouter = require("./src/ACL/Routes/aclRoutes");
const moduleRouter = require("./src/master/Routes/moduleRouter");
const resourceRouter = require("./src/master/Routes/resourceRouter");
const methodRouter = require("./src/master/Routes/methodRouter");

//Middleware import
const { assignRole } = require("./src/ACL/middlewares/roleAssg");
const { isPermitted } = require("./src/ACL/Utils/roleTest");

//buildin middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//static file path
app.use(express.static(path.join(__dirname, "public")));

//assign role to every incoming resquest
app.use(assignRole);
//Authentication request
app.use(isPermitted);

//Router
app.use("/content", contentRoutes);
app.use("/user", userRoute);
app.use("/acl", aclRouter);
app.use("/module", moduleRouter);
app.use("/resource", resourceRouter);
app.use("/method", methodRouter);

//handle wild URI
app.use((req, res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
});

//Error handler
app.use((error, req, res, next) => {
  console.log("Final error handle Middleware--->", error);
  res.status(error.status || 500);
  res.json({
    message: error.message ? error.message : error,
    success: false,
    data: null,
    accesstoken: req.accesstoken,
  });
});

//Server start after mongoose connection open
mongoose.connection.once("open", function callback() {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
  );
});

//Error on mongoose connection
mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!");
  return console.error(err.message);
});
