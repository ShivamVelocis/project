
let mongoose = require("mongoose");
//upload image in binary formate

/*let gallerySchema = new mongoose.Schema({
	    file: Buffer,
        file_type: {
      type: String,
    },
},
{ timestamps: true });*/
//upload image and video in folder
let gallerySchema = new mongoose.Schema({
	    file: {
      type: String,
    },
        file_type: {
      type: String,
    },
},
{ timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);
