const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  aim: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  doe: {
    type: Number,
    required: true,
  },
  desc: {
    type: String,
  },
});

const eduModel = mongoose.model("Edu", eduSchema);
module.exports = eduModel;
