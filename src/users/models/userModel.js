const  mongoose = require("mongoose");
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
      unique: [true, "Username already taken"],
      required: [true, "Username required"],
    },
    password: String,
    email: {
      type: String,
      unique: [true, "Username already token"],
      required: [true, "Email required"],
    },
    role_id: Number,
    name: {
      first: String,
      last: String,
    },
    user_status: {
      type: Number,
      max: [3, "Must be either 0, 1 or 2: got {VALUE}"],
    },
    otp: {
      type: Number,
    },
    token: String,
    otpToken: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
