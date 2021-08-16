
let mongoose = require("mongoose");

let feedbackSchema = new mongoose.Schema({
  title: {
    type: String,
    lowercase: true, trim: true,
    index: true,
    unique: true,
    required: [true, 'feedback required'],
  },
  description: {
    type: String,
  },
  password: String,
  email: {
    type: String,
  },
},
{ timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
