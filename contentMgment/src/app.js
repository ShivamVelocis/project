const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const contentRoutes = require("./routes/content");

require("./configs/db");
const app = express();
const port = 3000;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/content", contentRoutes);
// app.use("/", (req, res) => res.render("HomePage"));

app.use((req, res, next) => {
  const error = new Error("URL not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("ErrorPage", { error: error.message });
  // res.json({
  //     message: error.messages
  // })
});

app.listen(port, () => console.log(`Example app listening on port port!`));
