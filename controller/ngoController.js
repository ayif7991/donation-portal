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
  var donationData = await donationModel.find({ status: "open" });
  var donors = await donorModel.find({});
  var donations = [],
    donorId;
  donationData.forEach(function (donation) {
    donation = JSON.parse(JSON.stringify(donation));
    donors.forEach(function (donor) {
      donor = JSON.parse(JSON.stringify(donor));
      if (donation.donorId === donor._id.toString()) {
        x = Object.assign(donor, donation);
        donations.push(x);
      }
    });
  });

  res.render("ngo-donorview.ejs", {
    donationData: donations,
  });
};

ngoController.contactAdmin = function (req, res) {
  res.sendFile(path.resolve("views/contact-adminN.html"));
};

module.exports = ngoController;
