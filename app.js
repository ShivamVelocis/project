const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const MongoStore = require("connect-mongo");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();
dotenv.config();
require("./src/configs/db");

const { loginCheck } = require("./src/middlewares/auth");
const { main_menu } = require("./src/middlewares/main_menu/main_menu");

const contentRoutes = require("./src/ContentManagement/routes/contentRoutes");
const userRoute = require("./src/users/routes/userRouter");
const roleRoute = require("./src/roleManagement/routes/roleRoute");
const contactusRoute = require("./src/ContactUs/routes/contactusRoutes");
const feedbackRoute = require("./src/FeedbackManagement/routes/feedbackRoutes");
const aclRouter = require("./src/ACL/Routes/aclRoutes");

app.set("views", path.join(__dirname, "src"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", path.join(__dirname, "src/views/layouts/layout"));

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
const sessionDB = `${process.env.DB_HOST}//${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cbzag.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.use(
  session({
    store: MongoStore.create({ mongoUrl: sessionDB }),
    saveUninitialized: true,
    resave: "false",
    secret: "secret",
    cookie: {
      httpOnly: true /* Flags the cookie to be accessible only by the web server. */,
      secure: false /* Marks the cookie to be used with HTTPS only. */,
      sameSite: false /* Value of the “SameSite” Set-Cookie attribute.  */,
      maxAge: 30 * 60 * 1000 /*Time is in miliseconds*/,
      cacheControl: false,
    },
  })
);

app.use(flash());
app.use(loginCheck);
app.use(main_menu);
const { roleAssignment } = require("./src/ACL/middlewares/roleAssg");
const { isPermitted } = require("./src/ACL/Utils/roleTest");
app.use(roleAssignment);
app.use(isPermitted);
app.use("/content", contentRoutes);
app.use("/user", userRoute);
app.use("/role", roleRoute);
app.use("/contactus", contactusRoute);
app.use("/feedback", feedbackRoute);
app.use("/acl", aclRouter);

app.use((req, res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
});


app.use((error, req, res,next) => {
  console.log("Final error handle Middleware--->");
  res.status(error.status || 500);
  res.render("views/error/ErrorPage", { error: error.message?error.message:error,main_menu:null });
});

mongoose.connection.once('open', function callback () {
  app.listen(process.env.PORT || 5000, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`)
);
});

mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server!");
  return console.error(err.message);
});


// app.listen(process.env.PORT || 5000, () => console.log(`Example app listening on port ${process.env.PORT}!`));
