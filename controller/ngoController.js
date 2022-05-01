const path = require('path'),
    donorModel = require("../src/models/donor");

let ngoController = {};

ngoController.profile = function(req, res) {
    res.render("ngo-profile.ejs");
};

ngoController.donorView = function(req, res) {
    donorModel.find({}, function(err, data) {
        var userData = donorModel.find({});
        res.render("ngo-donorview.ejs", {
            userData: data,
        });
    });
};

ngoController.contactAdmin = function(req, res) {
    res.sendFile(path.resolve("views/contact-adminN.html"));
};

module.exports = ngoController;