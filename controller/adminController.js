const mongoose = require("mongoose"),
  donationModel = require("../src/models/donation"),
  ngoModel = require("../src/models/ngo"),
  donorModel = require("../src/models/donor");

let adminController = {};

adminController.ngoList = function (req, res) {
  ngoModel.find({}, function (err, data) {
    var userData = ngoModel.find({});
    res.render("ngo-list.ejs", {
      userData: data,
    });
  });
};

adminController.donorList = function (req, res) {
  donorModel.find({}, function (err, data) {
    var userData = donorModel.find({});
    res.render("donor-list.ejs", {
      userData: data,
    });
  });
};
adminController.donorUpdate = async function (req, res) {
  const newId = new mongoose.Types.ObjectId(req.body.id);
  await donorModel.updateOne(
    {
      _id: newId,
    },
    {
      $set: {
        isActive: req.body.status,
      },
    }
  );

  res.send({
    status: "success",
  });
};
adminController.ngoUpdate = async function (req, res) {
  const newId = new mongoose.Types.ObjectId(req.body.id);
  await ngoModel.updateOne(
    {
      _id: newId,
    },
    {
      $set: {
        isActive: req.body.status,
      },
    }
  );

  res.send({
    status: "success",
  });
};

adminController.donationList = async function (req, res) {
  var donationData = await donationModel.find({});
  var donors = await donorModel.find({});

  console.log(donationData);
  console.log(donors);

  var donations = [], donorId;
  donationData.forEach(function(donation) {
    donation = JSON.parse(JSON.stringify(donation));
    donors.forEach(function(donor) {
      donor = JSON.parse(JSON.stringify(donor));
      if (donation.donorId === donor._id.toString()) {
        x = Object.assign(donor, donation);
        donations.push(x);
      }
    });
  });
  console.log(donations);

  res.render("donations-list.ejs", {
    donationData: donations,
  });
};

module.exports = adminController;
