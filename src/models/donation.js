const mongoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");
// const { stringify } = require("nodemon/lib/utils");

const donationSchema = new mongoose.Schema({
  donorId: {
    type: String,
  },
  status: {
    type: String,
  },
  type: {
    type: String,
  },
  aim: {
    type: String,
    required: true,
  },
  select: {
    type: String,
  },
  specific: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },

  desc: {
    type: String,
  },
  doe: {
    type: Date,
  },
  dod: {
    type: Date,
    required: true,
  },
});

const donationModel = mongoose.model("Donation", donationSchema);
module.exports = donationModel;
