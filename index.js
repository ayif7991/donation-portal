//var popupS = require("popups");
const bcrypt = require("bcrypt");

const express = require("express"),
  mongoose = require("./src/db/mongoose"),
  ngoModel = require("./src/models/ngo"),
  donorModel = require("./src/models/donor"),
  healthModel = require("./src/models/health"),
  eduModel = require("./src/models/edu"),
  foodModel = require("./src/models/food");

const { render, location } = require("express/lib/response");
const res = require("express/lib/response");
const app = express();
//var db = require("./db");
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//To serve the Static pages
app.use("/public", express.static("public"));

app.get("/index", function (req, res) {
  res.sendFile("./views/index.html", { root: __dirname });
});

//To serve the admin page
app.get("/admin", function (req, res) {
  res.render("admin.ejs");
});
app.post("/admin", async function (req, res) {
  let name = req.body.name;
  let password = req.body.password;
  console.log(req.body);

  if (name === "admin" && password === "admin123") {
    console.log("oke fine");
    res.render("adminview.ejs");
  } else {
    return res.render("pages-error-404.ejs");
  }

  // console.log("oke fine");
  // return res.sendFile("./view/adminview.html", { root: __dirname });
});
app.get("/ngo-list", function (req, res) {
  ngoModel.find({}, function (err, data) {
    app.set("view engine", "ejs");
    var userData = ngoModel.find({});
    res.render("ngo-list.ejs", {
      userData: data,
    });
  });
});
app.get("/donor-list", function (req, res) {
  donorModel.find({}, function (err, data) {
    app.set("view engine", "ejs");
    var userData = donorModel.find({});
    res.render("donor-list.ejs", {
      userData: data,
    });
  });
});
app.get("/testmongo", function (req, res) {
  let name = "alfi";
  res.render("test.ejs", {
    username: name,
  });
});
app.get("/contact-adminN", function (req, res) {
  res.sendFile("./views/contact-adminN.html", { root: __dirname });
});
app.get("/contact-adminD", function (req, res) {
  res.sendFile("./views/contact-adminD.html", { root: __dirname });
});
app.get("/faq", function (req, res) {
  res.sendFile("./views/faq.html", { root: __dirname });
});

app.get("/ngo-donorview", function (rerq, res) {
  donorModel.find({}, function (err, data) {
    app.set("view engine", "ejs");
    var userData = donorModel.find({});
    res.render("ngo-donorview.ejs", {
      userData: data,
    });
  });
});

app.get("/donor-profile", async function (req, res) {
  res.render("donor-profile.ejs");
});
app.get("/donate-health", async function (req, res) {
  console.log("donate");
  res.sendFile("./views/donate-health.html", { root: __dirname });
});
app.get("/donate-food&water", async function (req, res) {
  console.log("donate");
  res.sendFile("./views/donate-food&water.html", { root: __dirname });
});
app.get("/donate-education", async function (req, res) {
  console.log("donate");
  res.sendFile("./views/donate-education.html", { root: __dirname });
});
app.post("/donate-health", function (req, res) {
  console.log(req.body);
  const newhealthDoc = new healthModel({
    aim: req.body.aim,
    select: req.body.select,
    specific: req.body.specific,
    quantity: req.body.quantity,
    doe: req.body.doe,
    desc: req.body.desc,
    dod: req.body.dod,
  });
  newhealthDoc.save();
  res.send("success");
});
app.post("/donate-education", function (req, res) {
  console.log(req.body);
  const neweduDoc = new eduModel({
    aim: req.body.aim,
    select: req.body.select,
    specific: req.body.specific,
    quantity: req.body.quantity,
    desc: req.body.desc,
    dod: req.body.dod,
  });
  neweduDoc.save();
  res.send("success");
});
app.post("/donate-food&water", function (req, res) {
  console.log(req.body);
  const newfoodDoc = new foodModel({
    aim: req.body.aim,
    select: req.body.select,
    specific: req.body.specific,
    quantity: req.body.quantity,
    doe: req.body.doe,
    desc: req.body.desc,
    dod: req.body.dod,
  });
  newfoodDoc.save();
  res.send("success");
});

//To serve ngo login page
app.get("/ngo-login", function (req, res) {
  console.log("login page");
  res.sendFile("./views/ngo-login.html", { root: __dirname });
});

app.post("/ngo-login", async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const presentngo = await ngoModel.findOne({ email: email });
    console.log(presentngo);
    bcrypt.compare(password, presentngo.password, (err, data) => {
      if (err) throw err;
      if (data) {
        console.log(req.body);
        return res.render("ngo-view.ejs");

        // return res.status(200).json({ msg: "Login success" });
      } else {
        return res.render("pages-error-404.ejs");
        // return res.status(401).json({ msg: "Invalid credencial" });
      }
    });
    //console.log(`${name}${password}`);
  } catch (error) {
    res.status(400).send(error);
  }
});

//To serve ngo signup page
app.get("/ngo-register", function (req, res) {
  res.sendFile("./views/ngo-register.html", { root: __dirname });
});
app.post("/ngo-register", async function (req, res) {
  try {
    console.log(req.body);
    let password = req.body.password;
    let confPassword = req.body.confirmpassword;
    if (password === confPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedpassword = await bcrypt.hash(password, salt);
      const newNgoDoc = new ngoModel({
        name: req.body.ngoName,
        email: req.body.email,
        username: req.body.username,
        contact: req.body.contact,
        location: req.body.location,
        password: hashedpassword,
      });

      try {
        let x = await newNgoDoc.save();
      } catch (err) {
        res.send({});
        console.log("save errror");
        console.log("err", err);
      }
      // var alert = require("alert");
      // alert("Hello");
      // res.send("success");
      res.sendFile("./views/ngo-login.html", { root: __dirname });
    } else {
      res.send("mismatch password");
    }
  } catch (err) {
    console.error("ngo-signup failed", err);
    res.status(400).send(err);
  }

  // console.log(password);
  res.send(req.body);
});
//To serve donate page
app.get("/donor-login", function (req, res) {
  res.sendFile("./views/donor-login.html", { root: __dirname });
});
app.post("/donor-login", async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(`${email}${password}`);
    const donor = await donorModel.findOne({ email: email });
    console.log("donor");
    bcrypt.compare(password, donor.password, (err, data) => {
      if (err) throw err;
      if (data) {
        return res.status(200).json({ msg: "Login success" });
      } else {
        return res.status(401).json({ msg: "Invalid credencial" });
        // return res.render("pages-error-404.ejs");
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
//To serve donatesignup page
app.get("/donor-register", function (req, res) {
  res.sendFile("./views/donor-register.html", { root: __dirname });
});
app.post("/donor-register", async function (req, res) {
  try {
    console.log(req.body);
    let password = req.body.password;
    let confPassword = req.body.confirmpassword;
    if (password === confPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedpassword = await bcrypt.hash(password, salt);
      const newdonorDoc = new donorModel({
        name: req.body.donorname,
        email: req.body.email,
        username: req.body.username,
        contact: req.body.contact,
        location: req.body.location,
        donation: req.body.donation,
        dod: req.body.dod,
        password: hashedpassword,
      });

      console.log("to save");
      try {
        let x = await newdonorDoc.save();
      } catch (err) {
        res.send({});
        console.log("save errror");
        console.log("err", err);
      }

      res.send("success");
    } else {
      res.send("mismatch password");
    }
  } catch (err) {
    console.error("dono-signup failed", err);
    res.status(400).send(err);
  }

  // console.log(password);
  // res.send(req.body);
});

app.listen(port, () => console.log(`listen to port ${port}`));
