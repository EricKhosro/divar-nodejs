const { default: mongoose } = require("mongoose");
const dotenv = require("dotenv").config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then((resp) => {
    console.log("Connected To DB");
  })
  .catch((err) => {
    console.log(err?.message ?? "Error in Connecting to DB");
  });
