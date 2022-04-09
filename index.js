//var popupS = require("popups");
const express = require("express"),
  mongoose = require("./src/db/mongoose"),
  ngoModel = require("./src/models/ngo");
const app = express();
//var db = require("./db");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//To serve the Static pages
app.use("/public", express.static("public"));

//To serve the home  page
app.get("/", function (req, res) {
  res.sendFile("./view/index.html", { root: __dirname });
});

//To serve the admin page
app.get("/admin", function (req, res) {
  res.sendFile("./view/admin.html", { root: __dirname });
});

app.get("/testmongo", async function (req, res) {
  ngoModel.findOne(function (error, result) {
    console.log("resultttt");
    console.log(result);
    res.send(result);
  });
});

//To serve ngo login page
app.get("/ngo-login", function (req, res) {
  res.sendFile("./view/ngologin.html", { root: __dirname });
});
//To serve ngo signup page
app.get("/ngo-signup", function (req, res) {
  res.sendFile("./view/ngosignup.html", { root: __dirname });
});
app.post("/ngo-signup", async function (req, res) {
  try {
    console.log(req.body);
    let password = req.body.password;
    let confPassword = req.body.confirmpassword;
    if (password === confPassword) {
      const newNgoDoc = new ngoModel({
        name: req.body.ngoName,
        contact: req.body.Contact,
        email: req.body.Email,
        location: req.body.Location,
        password: req.body.password,
      });

      await newNgoDoc.save();
      res.send("success");
    } else {
      res.send("mismatch password");
    }
  } catch (error) {
    res.status(400).send(error);
  }

  // console.log(password);
  // res.send(req.body);
});
//To serve donate page
app.get("/donate", function (req, res) {
  res.sendFile("./view/Donate.html", { root: __dirname });
});
//To serve donatesignup page
app.get("/donate-signup", function (req, res) {
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
