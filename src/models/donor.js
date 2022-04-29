const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  contact: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  location: {
    type: String,
  },
  donation: {
    type: String,
  },
  dod: {
    type: Date,
  },
  password: {
    type: String,
    required: true,
  },
});

const donorModel = mongoose.model("Donor", donorSchema);
module.exports = donorModel;
