const mongoose = require("mongoose");
const dbPath =`${process.env.DB_HOST}//${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.cbzag.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`


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

connectToDB("mongodb://localhost:27017/Vel");
