//var popupS = require("popups");
const bcrypt = require("bcrypt");

const express = require("express"),
  mongoose = require("./src/db/mongoose"),
  ngoModel = require("./src/models/ngo"),
  donorModel = require("./src/models/donor");
//adminModel = require("./src/models/admin");
const { render } = require("express/lib/response");
const res = require("express/lib/response");
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

app.get("/testmongo", async function (req, res) {
  //app.set("view engine", "ejs");
  // var datas = [
  //   {
  //     name: "Sammy",
  //     organization: "DigitalOcean",
  //     birth_year: 2012,
  //   },
  //   {
  //     name: "Tux",
  //     organization: "Linux",
  //     birth_year: 1996,
  //   },
  //   {
  //     name: "Moby",
  //     organization: "Docker",
  //     birth_year: 2013,
  //   },
  // ];
  donorModel.find({}, function (err, data) {
    app.set("view engine", "ejs");
    var userData = donorModel.find({});
    res.render("donor-list.ejs", {
      userData: data,
    });
  });
  console.log("resultttt");
  //  , { userData: datas,
  // });
  // ngoModel.findOne(function(error, result) {
  //   console.log("resultttt");
  //   console.log(result);
  //   res.send(result);
  // });
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
app.get("/index", function (req, res) {
  res.sendFile("./views/index.html", { root: __dirname });
});
//To serve ngo login page
app.get("/ngo-login", function (req, res) {
  console.log("login page");
  res.sendFile("./view/ngologin.html", { root: __dirname });
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

        ngoModel.find({}, function (err, data) {
          console.log(err);
          console.log(data);

          app.set("view engine", "ejs");
          var userData = ngoModel.find({});

          res.render("ngo-table.ejs", {
            userData: data,
          });
        });

        //return res.status(200).json({ msg: "Login success" });
      } else {
        return res.status(401).json({ msg: "Invalid credencial" });
      }
    });
    //console.log(`${name}${password}`);
  } catch (error) {
    res.status(400).send(error);
  }
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
      const salt = await bcrypt.genSalt(10);
      hashedpassword = await bcrypt.hash(password, salt);
      const newNgoDoc = new ngoModel({
        name: req.body.ngoName,
        contact: req.body.Contact,
        email: req.body.Email,
        location: req.body.Location,
        password: hashedpassword,
      });

      try {
        let x = await newNgoDoc.save();
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
    console.error("ngo-signup failed", err);
    res.status(400).send(err);
  }

  // console.log(password);
  // res.send(req.body);
});
//To serve donate page
app.get("/donate", function (req, res) {
  res.sendFile("./view/Donate.html", { root: __dirname });
});
app.post("/donate", async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    //console.log(`${name}${password}`);

    const newdonor = await donorModel.findOne({ email: email });
    console.log(newdonor);
    bcrypt.compare(password, newdonor.password, (err, data) => {
      if (err) throw err;
      if (data) {
        donorModel.find({}, function (err, data) {
          console.log(err);
          console.log(data);

          app.set("view engine", "ejs");
          var userData = donorModel.find({});

          res.render("donor-table.ejs", {
            userData: data,
          });
        });
        // return res.status(200).json({ msg: "Login success" });
      } else {
        return res.status(401).json({ msg: "Invalid credencial" });
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});
//To serve donatesignup page
app.get("/donate-signup", function (req, res) {
  res.sendFile("./view/donatesignup.html", { root: __dirname });
});
app.post("/donate-signup", async function (req, res) {
  try {
    console.log(req.body);
    let password = req.body.password;
    let confPassword = req.body.confirmpassword;
    if (password === confPassword) {
      const salt = await bcrypt.genSalt(10);
      hasheddpassword = await bcrypt.hash(password, salt);

      const newdonorDoc = new donorModel({
        name: req.body.donorname,
        contact: req.body.phone,
        email: req.body.Email,
        location: req.body.Address,
        password: hasheddpassword,
      });
      console.log("to save");
      newdonorDoc
        .save()
        .then(function (data) {
          console.log("insert success");

          res.send("successdonor");
        })
        .catch(function (err) {
          console.log("error");
        });
    } else {
      res.send("mismatch password");
    }
  } catch (error) {
    console.log("here");
    res.status(400).send(error);
  }

  // console.log(password);
  // res.send(req.body);
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
