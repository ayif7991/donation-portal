const path = require("path");

let staticController = {};

staticController.homePage = (req, res) => {
  res.sendFile(path.resolve("views/index.html"));
};

staticController.faq = (req, res) => {
  res.sendFile(path.resolve("views/faq.html"));
};

staticController.adminLogin = function (req, res) {
  res.render("admin.ejs");
};

staticController.donorLogin = function (req, res) {
  res.sendFile(path.resolve("views/donor-login.html"));
};

staticController.ngoLogin = function (req, res) {
  res.sendFile(path.resolve("views/ngo-login.html"));
};

staticController.donorRegister = function (req, res) {
  res.render("donor-register.ejs");
};

staticController.ngoRegister = function (req, res) {
  res.sendFile(path.resolve("views/ngo-register.html"));
};

module.exports = staticController;
