const mongoose = require("mongoose");
// const uniqueValidator = require("mongoose-unique-validator");

let userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true, trim: true,
      index: true,
      unique: true,
      required: [true, 'Username required'],
    },
    password: String,
    email: {
      type: String,
      required: [true, 'Email required'],
    },
    role_id: String,
    name: {
      first_name: String,
      last_name: String
    },
    user_status: {
      type: Number,
      max: [3, 'Must be either 0, 1 or 2: got {VALUE}'],
    },
    token: String,
    otp: {
      type: Number,
    },
    otpToken: String,
    profilePicture: Buffer,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);
// userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
