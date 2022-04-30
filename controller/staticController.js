const path = require('path');

let staticController = {};

staticController.homePage = (req, res) => {
    res.sendFile(path.resolve("views/index.html"));
};

staticController.logout = (req, res) => {
    req.session.destroy();
    res.redirect("/");
};

staticController.faq = (req, res) => {
    res.sendFile(path.resolve("views/faq.html"));
};

module.exports = staticController;