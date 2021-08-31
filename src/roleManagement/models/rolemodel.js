
let mongoose = require("mongoose");

let roleSchema = new mongoose.Schema({
	role_name: {
    type: String,
    lowercase: true, trim: true,
    index: true,
    unique: true,
  },
  role_title: {
    type: String,
     trim: true,
    index: true,
    unique: true,
    required: [true, 'Role required'],
  },
  role_status: {
    type: Number,
    max: [2, 'Must be either 0, 1 or 2: got {VALUE}'],
  }
},
{ timestamps: true });

module.exports = mongoose.model("Role", roleSchema);
