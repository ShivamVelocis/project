const mongoose = require("mongoose");

var dbPath = null;
if (process.env.APP_ENV === "local") {
  // console.log(process.env.DB_NAME)
  dbPath = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  // console.log(dbPath)
} else {
  dbPath = `${process.env.DB_CONNECTION}://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
}
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
// console.log(dbPath)
connectToDB(dbPath);
