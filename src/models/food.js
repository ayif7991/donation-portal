const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  aim: {
    type: String,
  },
  specify: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  doe: {
    type: Date,
  },
  desc: {
    type: String,
  },
  dod: {
    type: Date,
  },
});

const foodModel = mongoose.model("Food", foodSchema);
module.exports = foodModel;
