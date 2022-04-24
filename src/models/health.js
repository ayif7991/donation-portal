const mongoose = require("mongoose");

const healthSchema = new mongoose.Schema({
  aim: {
    type: String,
  },
  select: {
    type: String,
  },
  specific: {
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

const healthModel = mongoose.model("Health", healthSchema);
module.exports = healthModel;
