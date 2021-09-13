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
const roleRouter = require("./src/roleManagement/routes/roleRoute");
const contactusRouter = require("./src/ContactUs/routes/contactusRoutes");
const feedbackRouter = require("./src/FeedbackManagement/routes/feedbackRoutes");
const workflowRouter = require("./src/Workflow/Routers/workflow.routes");
const approvalRouter = require("./src/Workflow/Routers/approval.routes");
const excelRouter = require("./src/Data Export/excel/routes/excel.routes");
const pdfRouter = require("./src/Data Export/pdf/routes/pdf.routes")

//Middleware import
const { assignRole } = require("./src/ACL/middlewares/roleAssg");
const { isPermitted, auth } = require("./src/ACL/middlewares/roleTest");

//buildin middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//static file path
app.use(express.static(path.join(__dirname, "public")));

//assign role to every incoming resquest
app.use(assignRole);

//Authorization check
// app.use(auth().unless({ path: [{ url: "/user/login", methods: ["POST"] }] }));

//Router
app.use("/content", contentRoutes);
app.use("/user", userRoute);
app.use("/acl", aclRouter);
app.use("/module", moduleRouter);
app.use("/resource", resourceRouter);
app.use("/role", roleRouter);
app.use("/contactus", contactusRouter);
app.use("/feedback", feedbackRouter);
app.use("/workflow", workflowRouter);
app.use("/approve", approvalRouter);
app.use('/excel', excelRouter);
app.use('/pdf', pdfRouter);

//handle wild card URI
app.use((_req, _res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
});

//Error handler
app.use((error, req, res, _next) => {
  console.log("> Final error handle Middleware--->", error);
  res.status(error.status || 500);
  return res.json({
    message: error.message ? error.message : error,
    success: false,
    data: null,
    accesstoken: req.accesstoken,
  });
});

//Server start after mongoose connection open
mongoose.connection.once("open", function callback() {
  app.listen(process.env.APP_PORT || 5000, () =>
    console.log(`> App listening on port ${process.env.APP_PORT}!`)
  );
});

//Error on mongoose connection
mongoose.connection.on("error", function (err) {
  console.log("> Could not connect to mongo server!");
  return console.error(err.message);
});
