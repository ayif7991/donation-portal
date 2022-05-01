const bcrypt = require("bcrypt"),
  cookieParser = require("cookie-parser"),
  sessions = require("express-session"),
  express = require("express"),
  acl = require("express-acl");

const mongoose = require("./src/db/mongoose"),
  donorModel = require("./src/models/donor"),
  ngoModel = require("./src/models/ngo"),
  donationModel = require("./src/models/donation"),
  authUtils = require("./src/utils/auth"),
  staticController = require("./controller/staticController"),
  adminController = require("./controller/adminController"),
  ngoController = require("./controller/ngoController"),
  donorController = require("./controller/donorController");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// <<<<< SESSION >>>>>
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);
app.use(cookieParser());

// <<<<< ACL >>>>>
acl.config();

//To serve the Static pages
app.use("/public", express.static("public"));

app.get("/testmongo", function (req, res) {
  // let userId = req.session.userId;
  // let donorId = donationModel.find({ userId });
  // console.log(donorId);
  // res.render("donations.ejs");
});

// <<<<< PUBLIC >>>>>
app.get("/", staticController.homePage);
//app.get("/index", staticController.homePage);

app.get("/logout", staticController.logout);

app.get("/faq", staticController.faq);

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
    req.session.role = "admin";
    req.session.name = "Admin";
    console.log("admin session created");
    ngoModel.find({}, function (err, data) {
      var userData = ngoModel.find({});
      res.render("ngo-list.ejs", {
        userData: data,
      });
    });
  } else {
    res.redirect("/admin");
    //res.render("pages-error-404.ejs");
  }

  // console.log("oke fine");
  // return res.sendFile("./view/adminview.html", { root: __dirname });
});

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
    if (donor) {
      bcrypt.compare(password, donor.password, (err, data) => {
        if (err) throw err;
        if (data) {
          let session = req.session;
          session.userId = donor._id;
          session.userName = donor.name;
          session.userEmail = donor.email;
          session.role = "donor";
          console.log(req.session.userId);
          res.redirect("donor/donations");
          //return res.status(200).json({ msg: "Login success" });
        } else {
          return res.status(401).json({ msg: "Invalid credencial" });
          // return res.render("pages-error-404.ejs");
        }
      });
    } else {
      return res.status(401).json({ msg: "Invalid credencial" });
    }
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
    req.session.role = "donor";

    if (password === confPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedpassword = await bcrypt.hash(password, salt);
      const newdonorDoc = new donorModel({
        name: req.body.donorname,
        email: req.body.email,
        contact: req.body.contact,
        location: req.body.location,
        //  donation: req.body.donation,
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

      res.redirect("/donor-login");
    } else {
      res.send("mismatch password");
    }
  } catch (err) {
    console.error("dono-signup failed", err);
    res.status(400).send(err);
  }
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
    const ngo = await ngoModel.findOne({ email: email });
    console.log(ngo);
    if (ngo) {
      bcrypt.compare(password, ngo.password, (err, data) => {
        if (err) throw err;
        if (data) {
          let session = req.session;
          session.userId = ngo._id;
          session.userName = ngo.name;
          session.userEmail = ngo.email;
          session.role = "ngo";
          console.log(req.session);
          // res.render("ngo-view.ejs");
          res.render("ngo-view.ejs");

          console.log(req.session);
          //return res.render("ngo-view.ejs");}
        } else {
          return res.status(401).json({ msg: "Invalid credencial" });
          // return res.render("pages-error-404.ejs");
        }
      });
    } else {
      return res.status(401).json({ msg: "Invalid credencial" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
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

      res.redirect("/ngo-login");
    } else {
      res.send("mismatch password");
    }
  } catch (err) {
    console.error("ngo-signup failed", err);
    res.status(400).send(err);
  }
});

//To serve ngo signup page
app.get("/ngo-register", function (req, res) {
  res.sendFile("./views/ngo-register.html", { root: __dirname });
});

// <<<<< ACL >>>>>
app.use(acl.authorize);
// <<<<< ADMIN >>>>>
app.get("/admin/ngo-list", adminController.ngoList);
app.get("/admin/donor-list", adminController.donorList);

// <<<<<< NGO >>>>>>
app.get("/ngo/profile", ngoController.profile);
app.get("/ngo/donorview", ngoController.donorView);
app.get("/ngo/contact-adminN", ngoController.contactAdmin);

// <<<<< DONOR >>>>>
//To serve donate page
app.get("/donor/profile", donorController.profile);
app.get("/donor/donations", donorController.donations);
app.put("/donor/donation/:id", donorController.donationUpdate);
app.get("/donor/donate-health", donorController.donateHealthGet);
app.post("/donor/donate-health", donorController.donateHealthPost);
app.get("/donor/donate-food&water", donorController.donateFoodGet);
app.post("/donor/donate-food&water", donorController.donateFoodPost);
app.get("/donor/donate-education", donorController.donateEducationGet);
app.post("/donor/donate-education", donorController.donateEducationPost);
app.get("/donor/contact-adminD", donorController.contactAdmin);

app.listen(port, () => console.log(`listen to port ${port}`));
