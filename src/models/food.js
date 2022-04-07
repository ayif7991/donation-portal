const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  aim: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const foodModel = mongoose.model("Food", foodSchema);
module.exports = foodModel;
