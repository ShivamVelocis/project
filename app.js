const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const contentRoutes = require("./src/ContentManagement/routes/contentRoutes");
const userRoutes = require("./src/users/routes/userRouter");
const session = require("express-session");
const morgan = require("morgan");
const flash = require("express-flash");
const cookieParser = require('cookie-parser');

dotenv.config();

require("./src/configs/db");

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "src"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", path.join(__dirname, "src/views/layouts/layout"));

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    store: new session.MemoryStore(),
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
); // session middleware
app.use(flash());
app.use(cookieParser());

app.use("/content", contentRoutes);
app.use("/user", userRoutes);


app.use((req, res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("views/error/ErrorPage", { error: error.message });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
