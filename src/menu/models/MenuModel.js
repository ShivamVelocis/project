const mongoose = require("mongoose");

let subMenuSchema = new mongoose.Schema(
  {
    menu_title: { type: String },
    menu_link: { type: String },
    menu_priority: { type: Number },
    menu_status: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

let menuSchema = new mongoose.Schema(
  {
    menu_title: { type: String },
    menu_link: { type: String },
    menu_status: { type: String },
    menu_priority: { type: Number },
    sub_menu: [subMenuSchema],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);



module.exports = mongoose.model("main_menu", menuSchema);
