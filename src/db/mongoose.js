const mongoose = require("mongoose");

const mongooseConn = mongoose
  .connect("mongodb://127.0.0.1:27017/portal")
  .catch((error) => {
    console.log(error);
  });

module.exports = mongooseConn;
