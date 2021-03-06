const path = require("path"),
  bcrypt = require("bcrypt"),
  ngoModel = require("../src/models/ngo"),
  donorModel = require("../src/models/donor");

let authController = {};
// authController.x = "hi";
// authController.y = "hio";
// console.log(authController);

authController.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

authController.adminLogin = async function (req, res) {
  let name = req.body.name;
  let password = req.body.password;
  console.log(req.body);
  if (name === "admin" && password === "admin123") {
    req.session.role = "admin";
    req.session.name = "Admin";
    console.log("admin session created");
    res.send({ status: "success" });
  } else {
    res.send({
      status: "failed",
      message: "Credencials mismatch, Please try again",
    });
  }
};

authController.donorLogin = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(`${email}${password}`);

    const donor = await donorModel.findOne({
      email: email,
      isActive: true,
    });
    console.log(`${email}`);

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
          res.send({ status: "success" });
        } else {
          res.send({
            status: "failed",
            message: "Credencials mismatch, Please try again",
          });
          console.log("11");
        }
      });
    } else {
      res.send({
        status: "failed",
        message: "Credencials mismatch, Please try again",
      });
      console.log("21");
    }
  } catch (error) {
    res.status(400).send(error);
  }
  console.log("31");
};

authController.ngoLogin = async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const ngo = await ngoModel.findOne({ email: email, isActive: true });
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
          console.log("hello session");
          res.send({ status: "success" });
          console.log(req.session);
        } else {
          res.send({
            status: "failed",
            message: "Credencials mismatch, Please try again",
          });
          console.log("11");
        }
      });
    } else {
      res.send({
        status: "failed",
        message: "Credencials mismatch, Please try again",
      });
      console.log("22");
    }
  } catch (error) {
    res.status(400).send(error);
  }
  console.log("33");
};

authController.donorRegister = async function (req, res) {
  //authController.donorRegister = async function (req, res, errormessage) {
  try {
    console.log(req.body);
    let password = req.body.password;
    let confPassword = req.body.confirmpassword;
    req.session.role = "donor";

    if (password === confPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedpassword = await bcrypt.hash(password, salt);
      const newdonorDoc = new donorModel({
        isActive: true,
        name: req.body.donorname,
        email: req.body.email,
        contact: req.body.contact,
        location: req.body.location,
        //  donation: req.body.donation,
        dod: req.body.dod,
        password: hashedpassword,
      });
      console.log(req.body);

      console.log("to save");
      try {
        let x = await newdonorDoc.save();
      } catch (err) {
        res.send({});
        console.log("save errror");
        console.log("err", err);
      }
      console.log("register success");

      res.redirect("/donor-login");
    } else {
      // res.send('<script>alert("mismatch password")</script>');
      //  res.render("donor-register", { errormessage: "mismatch password" });
      res.send("mismatch password");
    }
  } catch (err) {
    console.error("dono-signup failed", err);
    res.status(400).send(err);
  }
};

authController.ngoRegister = async function (req, res) {
  try {
    console.log(req.body);
    let password = req.body.password;
    let confPassword = req.body.confirmpassword;
    if (password === confPassword) {
      const salt = await bcrypt.genSalt(10);
      hashedpassword = await bcrypt.hash(password, salt);
      const newNgoDoc = new ngoModel({
        isActive: true,
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
};

module.exports = authController;
