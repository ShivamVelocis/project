const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var flash = require('express-flash');
var session = require('express-session');
const expressLayouts = require('express-ejs-layouts');

const app = express();

const dotenv = require('dotenv');
dotenv.config();

require("./src/configs/db");


const port = process.env.APP_PORT;
const { loginCheck } = require("./src/middlewares/auth");

const contentRoutes = require("./src/ContentManagement/routes/contentRoutes");
const userRoute = require("./src/users/routes/userRouter");
//const authRoute = require("./src/users/routes/authRouter");
const roleRoute = require("./src/roleManagement/routes/roleRoute");
const contactusRoute = require("./src/ContactUs/routes/contactusRoutes");
const feedbackRoute = require("./src/FeedbackManagement/routes/feedbackRoutes");

app.set("views", path.join(__dirname, "src"));
app.set("view engine", "ejs");


app.use(expressLayouts);
app.set('layout', path.join(__dirname, 'src/views/layouts/layout'));

 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ 
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'false',
  secret: 'secret',
  cookie: { 
    httpOnly: true, /* Flags the cookie to be accessible only by the web server. */
    secure: false, /* Marks the cookie to be used with HTTPS only. */
    sameSite: false, /* Value of the “SameSite” Set-Cookie attribute.  */
    maxAge: 30 * 60 * 1000, /*Time is in miliseconds*/
    cacheControl: false
  }
}))

app.use(flash());
app.use(loginCheck);

app.use("/content", contentRoutes);
app.use("/user", userRoute);
//app.use("/auth", authRoute);
app.use("/role", roleRoute);
app.use("/contactus", contactusRoute);
app.use("/feedback", feedbackRoute);


app.use((req, res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  console.log("Final error handle Middleware--->" ,error.message)
  res.status(error.status || 500);
  res.render("views/error/ErrorPage", { error: error.message });
});

app.listen(port, () => console.log(`Example app listening on port port!`));
