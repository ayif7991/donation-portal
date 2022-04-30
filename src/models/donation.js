const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");

const donationSchema = new mongoose.Schema({
  type: {
    type: String,
  },
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
  doe: {
    type: Date,
  },
  dod: {
    type: Date,
  },
});

const donationModel = mongoose.model("Donation", donationSchema);
module.exports = donationModel;
