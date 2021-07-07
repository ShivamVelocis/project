let mongoose = require("mongoose");

let contactusSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contactus", contactusSchema);
