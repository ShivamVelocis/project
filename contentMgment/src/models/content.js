let mongoose = require("mongoose");

let contentSchema = new mongoose.Schema({
  title: String,
  description: String,
});

module.exports = mongoose.model("Content", contentSchema);
