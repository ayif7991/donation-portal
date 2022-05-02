const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  status: {
    type: String,
  },
  name: {
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

  password: {
    type: String,
    required: true,
  },
});

const ngoModel = mongoose.model("Ngo", ngoSchema);
module.exports = ngoModel;
