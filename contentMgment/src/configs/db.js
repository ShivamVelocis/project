const mongoose = require("mongoose");
const dbPath = "mongodb://localhost:27017/Vel";

connectToDB = async (url) => {
  try {
    console.log("> Trying to connect to Database");
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("> successfully opened the database");
  } catch (error) {
    console.log("> error occurred from the database");
  }
};

connectToDB(dbPath);
