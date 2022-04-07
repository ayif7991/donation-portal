const express = require("express"),
  ngoModel = require("./src/models/ngo");
const app = express();
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
  const mongoose = require("mongoose");
  console.log("inside tes2t");
  const ngoModel = require("./src/models/ngo");
  console.log("inside test1");
  const donorModel = require(".src/models/donor");
  const eduModel = require(".src/models/edu");
  const foodModel = require(".src/models/food");
  const healthModel = require(".src/models/health");

  console.log("inside test");
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/portal");
    console.log("succeess");

    ngoModel.findOne(function (error, result) {
      console.log("resultttt");
      console.log(result);
    });
  } catch (error) {
    console.log(error);
  }
});

//To serve ngo login page
app.get("/ngo-login", function (req, res) {
  res.sendFile("./view/ngologin.html", { root: __dirname });
});
//To serve ngo signup page
app.get("/ngo-signup", function (req, res) {
  res.sendFile("./view/ngosignup.html", { root: __dirname });
});
app.post("/ngo-signup", function (req, res) {
  if (req.body.password === req.body.confirmationPassword) {
    res.send("Passwords are not matching");
    console.log("oke done");
  }

  let newNgo = new ngoModel({
    name: req.body.ngoName,
  });
  // newNgo.save();
  console.log(password);
  res.send(req.body);
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
