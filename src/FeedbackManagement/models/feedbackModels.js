
let mongoose = require("mongoose");

let feedbackSchema = new mongoose.Schema({
  feedback_title: {
    type: String,
    lowercase: true, trim: true,
    index: true,
	unique: true,
    required: [true, 'feedback required'],
  },
  feedback_description: {
    type: String,
  },
  feedback_password: String,
  feedback_email: {
    type: String,
  },
},
{ timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
