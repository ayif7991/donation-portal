const path = require('path'),
    ngoModel = require("../src/models/ngo"),
    donorModel = require("../src/models/donor");

let adminController = {};

adminController.ngoList = function(req, res) {
    ngoModel.find({}, function(err, data) {
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
}

module.exports = adminController;