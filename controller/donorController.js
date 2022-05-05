const path = require("path"),
  mongoose = require("mongoose"),
  donorModel = require("../src/models/donor"),
  donationModel = require("../src/models/donation");

let donorController = {};

donorController.profile = async function (req, res) {
  let userId = req.session.userId;
  var donorData = await donorModel.find({ _id: userId });
  console.log(userId);
  console.log(donorData);
  res.render("donor-profile.ejs", {
    donorData: donorData,
  });
};

donorController.donations = async function (req, res) {
  let userId = req.session.userId;
  var donationData = await donationModel.find({
    donorId: userId,
  });
  console.log(userId);

  console.log(donationData);

  res.render("donations.ejs", {
    donationData: donationData,
  });
};

donorController.donationUpdate = async function (req, res) {
  const newId = new mongoose.Types.ObjectId(req.body.id);
  await donationModel.updateOne(
    {
      _id: newId,
    },
    {
      $set: {
        status: req.body.status,
      },
    }
  );

  res.send({
    status: "success",
  });
};

donorController.donateHealthGet = async function (req, res) {
  res.render("donate-health.ejs");
};

donorController.donateHealthPost = function (req, res) {
  const newDoc = new donationModel({
    donorId: req.session.userId,
    type: "Nutrition and Healthcare",
    status: "open",
    aim: req.body.aim,
    select: req.body.select,
    specific: req.body.specific,
    quantity: req.body.quantity,
    doe: req.body.doe,
    desc: req.body.desc,
    dod: req.body.dod,
  });
  newDoc.save();

  res.redirect("/donor/donations");
};

donorController.donateFoodGet = async function (req, res) {
  res.sendFile(path.resolve("views/donate-food&water.html"));
};

donorController.donateFoodPost = function (req, res) {
  const newDoc = new donationModel({
    donorId: req.session.userId,
    status: "open",
    type: "Food and Beverages",
    aim: req.body.aim,
    select: req.body.select,
    specific: req.body.specific,
    quantity: req.body.quantity,
    doe: req.body.doe,
    desc: req.body.desc,
    dod: req.body.dod,
  });
  newDoc.save();

  res.redirect("/donor/donations");
};

donorController.donateEducationGet = async function (req, res) {
  res.sendFile(path.resolve("views/donate-education.html"));
};

donorController.donateEducationPost = function (req, res) {
  const newDoc = new donationModel({
    donorId: req.session.userId,
    status: "open",
    type: "Books,Stationary and more",
    isActive: true,
    aim: req.body.aim,
    select: req.body.select,
    specific: req.body.specific,
    quantity: req.body.quantity,
    desc: req.body.desc,
    dod: req.body.dod,
  });
  newDoc.save();

  res.redirect("/donor/donations");
};
console.log("edu don");

donorController.donorView = function (req, res) {
  donorModel.find({}, function (err, data) {
    var userData = donorModel.find({});
    res.render("ngo-donorview.ejs", {
      userData: data,
    });
  });
};

donorController.contactAdmin = function (req, res) {
  res.sendFile(path.resolve("views/contact-adminD.html"));
};

module.exports = donorController;
