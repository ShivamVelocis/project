const mongoose = require("mongoose");
const dbPath = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

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
