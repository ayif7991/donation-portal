const express = require("express");
const app = express();

const port = 3000;
//To serve the Static pages
app.use("/public", express.static("public"));
//To serve the home  page
app.get("/", function (req, res) {
  res.sendFile("./view/index.html", { root: __dirname });
});

//To serve the admin page
app.get("/admin.html", function (req, res) {
  res.sendFile("./view/admin.html", { root: __dirname });
});
//To serve ngo login page
app.get("/ngologin.html", function (req, res) {
  res.sendFile("./view/ngologin.html", { root: __dirname });
});
//To serve ngo signup page
app.get("/NGOsignup.php", function (req, res) {
  res.sendFile("./view/ngosignup.html", { root: __dirname });
});
//To serve donate page
app.get("/donate.html", function (req, res) {
  res.sendFile("./view/Donate.html", { root: __dirname });
});
//To serve donatesignup page
app.get("/donatesignup.html", function (req, res) {
  res.sendFile("./view/donatesignup.html", { root: __dirname });
});
//to serve donation type-education
app.get("/Donationtype/education", function (req, res) {
  res.sendFile("./view/donationtype/education.html", { root: __dirname });
});
//to serve donation type-food and water
app.get("/Donationtype/foodandwater", function (req, res) {
  res.sendFile("./view/donationtype/foodandwater.html", { root: __dirname });
});
//to serve donation type-health and medicine
app.get("/Donationtype/healthandmedicine", function (req, res) {
  res.sendFile("./view/donationtype/healthandmedicine.html", {
    root: __dirname,
  });
});
//To serve donatesignup page
app.get("/Donationtype", function (req, res) {
  res.sendFile("./view/donation_type.html", { root: __dirname });
});

app.listen(port, () => console.log(`listen to port${port}`));
