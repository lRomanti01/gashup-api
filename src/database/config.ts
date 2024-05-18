const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.DB_CNN, {
      useNewUrlParser: true,
    });
    console.log("DB ONLINE");
  } catch (error) {
    console.log(error);
    throw new Error("error when starting the database");
  }
};
module.exports = {
  dbConnection,
};
