const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const expressLayouts = require("express-ejs-layouts");
const contentRoutes = require("./src/ContentManagement/routes/contentRoutes");

dotenv.config();

require("./src/configs/db");

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "src/views"));
app.set("view engine", "ejs");

app.use(expressLayouts);
app.set("layout", path.join(__dirname, "src/views/layouts/layout"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use("/content", contentRoutes);

app.use((req, res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("ErrorPage", { error: error.message });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
