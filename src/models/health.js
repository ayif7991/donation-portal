const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  aim: {
    type: String,
    required: true,
  },
  name: {
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

const healthModel = mongoose.model("Health", healthSchema);
module.exports = healthModel;
