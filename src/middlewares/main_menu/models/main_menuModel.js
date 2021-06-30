const mongoose = require("mongoose");

let menuSchema = new mongoose.Schema(
  {
    menu_title: { type: String },
    menu_link: { type: String },
    menu_status: { type: String },
    menu_priority: { type: Number },
    sub_menu: { type: Object },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Main_menu", menuSchema);
