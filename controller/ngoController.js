const path = require("path"),
  mongoose = require("mongoose"),
  donorModel = require("../src/models/donor"),
  ngoModel = require("../src/models/ngo"),
  donationModel = require("../src/models/donation");

let ngoController = {};

ngoController.profile = async function (req, res) {
  let userId = req.session.userId;
  var ngoData = await ngoModel.find({ _id: userId });
  console.log(userId);
  console.log(ngoData);
  res.render("ngo-profile.ejs", {
    ngoData: ngoData,
  });
};

ngoController.donorView = async function (req, res) {
  let userId = req.session.userId;
  console.log(userId);
  var donationData = await donationModel.find({ status: "open", active: true });
  // var donationData = await donationModel.find({
  //   donorId: userId,
  // });
  console.log(donationData);

  res.render("ngo-donorview.ejs", {
    donationData: donationData,
  });
};

ngoController.contactAdmin = function (req, res) {
  res.sendFile(path.resolve("views/contact-adminN.html"));
};

module.exports = ngoController;
