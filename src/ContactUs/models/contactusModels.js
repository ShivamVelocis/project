let mongoose = require("mongoose");

let contactusSchema = new mongoose.Schema(
  {
    contactus_title: String,
    contactus_description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contactus", contactusSchema);
