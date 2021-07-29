const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
dotenv.config();
require("./src/configs/db");

const contentRoutes = require("./src/ContentManagement/routes/contentRoutes");
const userRoute = require("./src/users/routes/userRouter");
// const roleRoute = require("./src/roleManagement/routes/roleRoute");
// const contactusRoute = require("./src/ContactUs/routes/contactusRoutes");
// const feedbackRoute = require("./src/FeedbackManagement/routes/feedbackRoutes");
const aclRouter = require("./src/ACL/Routes/aclRoutes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


const { assignRole } = require("./src/ACL/middlewares/roleAssg");
const { isPermitted } = require("./src/ACL/Utils/roleTest");
app.use(assignRole);
app.use(isPermitted);
app.use("/content", contentRoutes);
app.use("/user", userRoute);
// app.use("/role", roleRoute);
// app.use("/contactus", contactusRoute);
// app.use("/feedback", feedbackRoute);
app.use("/acl", aclRouter);


app.use((req, res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log("Final error handle Middleware--->",error);
  res.status(error.status || 500);
  res.json({
    message: error.message ? error.message : error,
    status:false,
    data: null
  });
});

mongoose.connection.once("open", function callback() {
  app.listen(process.env.PORT || 5000, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`)
  );
});

mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!");
  return console.error(err.message);
});

// app.listen(process.env.PORT || 5000, () => console.log(`Example app listening on port ${process.env.PORT}!`));
