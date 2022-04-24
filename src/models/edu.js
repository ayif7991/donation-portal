const mongoose = require("mongoose");

const eduSchema = new mongoose.Schema({
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

  desc: {
    type: String,
  },
  dod: {
    type: Date,
  },
});

const eduModel = mongoose.model("Edu", eduSchema);
module.exports = eduModel;
