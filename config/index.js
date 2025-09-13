const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/airbnb_clone";

mongoose
  .connect(MONGO_URI)
  .then((response) => {
    console.log("Connected to Mongo");
  })
  .catch((err) => {
    console.log(err);
  });
