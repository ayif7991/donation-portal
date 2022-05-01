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
  staticController = require("./controller/staticController");

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

  // console.log(password);
  // res.send(req.body);
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
          res.render("ngo-profile.ejs");

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
app.get("/ngo/profile", function (req, res) {
  res.render("ngo-profile.ejs");
});
app.get("/ngo/donorview", function (req, res) {
  donorModel.find({}, function (err, data) {
    var userData = donorModel.find({});
    res.render("ngo-donorview.ejs", {
      userData: data,
    });
  });
});

app.get("/ngo/contact-adminN", function (req, res) {
  res.sendFile("./views/contact-adminN.html", { root: __dirname });
});

// <<<<< DONOR >>>>>
//To serve donate page
app.get("/donor/profile", async function (req, res) {
  res.render("donor-profile.ejs");
});

app.get("/donor/donations", async function (req, res) {
  let userId = req.session.userId;
  var donationData = await donationModel.find({ donorId: userId });
  res.render("donations.ejs", {
    donationData: donationData,
  });
  console.log(donationData);
  // });
});

app.put("/donor/donation/:id", async function (req, res) {
  // const newId = new mongoose.Types.ObjectId(id);
  // updateOne({ id: id }, { $set: { status: status } });
  console.log(req.body);
  // console.log(_id);

  res.send({ status: "success" });
});

app.get("/donor/donate-health", async function (req, res) {
  console.log("donate");
  res.render("donate-health.ejs");

  // res.sendFile("./views/donate-health.html", { root: __dirname });
});

app.post("/donor/donate-health", function (req, res) {
  const newDoc = new donationModel({
    donorId: req.session.userId,
    type: "health",
    status: "open",
    aim: req.body.aim,
    select: req.body.select,
    specific: req.body.specific,
    quantity: req.body.quantity,
    doe: req.body.doe,
    desc: req.body.desc,
    dod: req.body.dod,
  });
  newDoc.save();
  res.redirect("/donor/donations");

  // res.send("success");
});

app.get("/donor/donate-food&water", async function (req, res) {
  console.log("donate");
  res.sendFile("./views/donate-food&water.html", { root: __dirname });
});

app.post("/donor/donate-education", function (req, res) {
  console.log(req.body);
  const newDoc = new donationModel({
    donorId: req.session.userId,
    status: "open",
    type: "education",
    aim: req.body.aim,
    select: req.body.select,
    specific: req.body.specific,
    quantity: req.body.quantity,
    desc: req.body.desc,
    dod: req.body.dod,
  });
  newDoc.save();
  res.redirect("/donor/donations");

  //res.send("success");
});

app.get("/donor/donate-education", async function (req, res) {
  console.log("donate");
  res.sendFile("./views/donate-education.html", { root: __dirname });
});

app.post("/donor/donate-food&water", function (req, res) {
  console.log(req.body);
  const newDoc = new donationModel({
    donorId: req.session.userId,
    status: "open",
    type: "food",
    aim: req.body.aim,
    select: req.body.select,
    specific: req.body.specific,
    quantity: req.body.quantity,
    doe: req.body.doe,
    desc: req.body.desc,
    dod: req.body.dod,
  });
  newDoc.save();
  res.redirect("/donor/donations");

  //res.send("success");
});

app.get("/donor/contact-adminD", function (req, res) {
  res.sendFile("./views/contact-adminD.html", { root: __dirname });
});

app.listen(port, () => console.log(`listen to port ${port}`));
