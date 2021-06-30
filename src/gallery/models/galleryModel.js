const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

let imageSchema = new mongoose.Schema(
  {
    image_name: {
      type: String,
      lowercase: true,
      index: true,
      unique: [true, "Image name already taken"],
      required: [true, "Image name required"],
    },
    image_status: {
      type: Number,
      enum: [0, 1, 2],
      default: 1,
    },
    image_path: {
      type: String,
      default: "/files/gallery/",
    },
    image_size: {
      type: Number,
    },
    image_dimensions: {
      type: String,
    },
    image_type:{
        type: String
    }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
module.exports = mongoose.model("Images", imageSchema);
