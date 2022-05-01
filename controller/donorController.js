const path = require('path'),
    donorModel = require("../src/models/donor");

let donorController = {};

donorController.profile = function(req, res) {
    res.render("donor-profile.ejs");
};

donorController.donations = async function(req, res) {
    let userId = req.session.userId;
    var donationData = await donationModel.find({
        donorId: userId
    });
    console.log(donationData);

    res.render("donations.ejs", {
        donationData: donationData,
    });
};

donorController.donationUpdate = async function(req, res) {
    // const newId = new mongoose.Types.ObjectId(id);
    // updateOne({ id: id }, { $set: { status: status } });
    console.log(req.body);
    // console.log(_id);

    res.send({
        status: "success"
    });
};

donorController.donateHealthGet = async function(req, res) {
    res.render("donate-health.ejs");
};

donorController.donateHealthPost = function(req, res) {
    const newDoc = new donationModel({
        donorId: req.session.userId,
        type: "health",
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

donorController.donateFoodGet = async function(req, res) {
    res.sendFile(path.resolve("views/donate-food&water.html"));
};

donorController.donateFoodGet = function(req, res) {
    const newDoc = new donationModel({
        donorId: req.session.userId,
        status: "open",
        type: "food",
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

donorController.donateEducationGet = async function(req, res) {
    res.sendFile(path.resolve("views/donate-education.html"));
};

donorController.donateEducationPost = function(req, res) {
    const newDoc = new donationModel({
        donorId: req.session.userId,
        status: "open",
        type: "education",
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

donorController.donorView = function(req, res) {
    donorModel.find({}, function(err, data) {
        var userData = donorModel.find({});
        res.render("ngo-donorview.ejs", {
            userData: data,
        });
    });
};

donorController.contactAdmin = function(req, res) {
    res.sendFile(path.resolve("views/contact-adminD.html"));
};

module.exports = donorController;