const bcrypt = require("bcrypt"),
  cookieParser = require("cookie-parser"),
  sessions = require("express-session"),
  express = require("express"),
  acl = require("express-acl");

const mongooseConn = require("./src/db/mongoose"),
  donorModel = require("./src/models/donor"),
  ngoModel = require("./src/models/ngo"),
  staticController = require("./controller/staticController"),
  adminController = require("./controller/adminController"),
  ngoController = require("./controller/ngoController"),
  donorController = require("./controller/donorController"),
  authController = require("./controller/authController");

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
  res.render("ngo-donorview.ejs");
});

// <<<<< PUBLIC >>>>>
app.get("/", staticController.homePage);
//app.get("/index", staticController.homePage);

app.get("/logout", staticController.logout);

app.get("/faq", staticController.faq);

//To serve the admin login page
app.get("/admin", staticController.adminLogin);
app.post("/admin", authController.adminLogin);

app.get("/donor-login", staticController.donorLoginGet);
app.post("/donor-login", authController.donorLogin);

//To serve donatesignup page
app.get("/donor-register", staticController.donorRegisterGet);

app.post("/donor-register", staticController.donorRegisterPost);

//To serve ngo login page
app.get("/ngo-login", staticController.ngoLogin);
app.post("/ngo-login", authController.ngoLogin);

app.get("/ngo-register", staticController.ngoRegister);
app.post("/ngo-register", authController.ngoRegister);


// <<<<< ACL >>>>>
app.use(acl.authorize);
// <<<<< ADMIN >>>>>
app.get("/admin/ngo-list", adminController.ngoList);
app.get("/admin/donor-list", adminController.donorList);
app.get("/admin/donation-list", adminController.donationList);
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
