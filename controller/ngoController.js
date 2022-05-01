const path = require("path"),
  donorModel = require("../src/models/donor"),
  donationModel = require("../src/models/donation");

let ngoController = {};

ngoController.profile = function (req, res) {
  res.render("ngo-profile.ejs");
};

ngoController.donorView = async function (req, res) {
  let userId = req.session.userId;
  var donationData = await donationModel.find({ status: "open" });
  console.log(donationData);

  res.render("ngo-donorview.ejs", {
    donationData: donationData,
  });
};

ngoController.contactAdmin = function (req, res) {
  res.sendFile(path.resolve("views/contact-adminN.html"));
};

module.exports = ngoController;
