var express = require("express");
var router = express.Router();
const User = require("../models/User");
const upload = require("../config/cloudinary");
const bcrypt = require("bcrypt");
//mon profil

router.get("/profile", (req, res) => {
  console.log(req.session.currentUser);
  User.findById(req.session.currentUser._id)
    .then((dbRes) => {
      res.render("profile", {
        user: dbRes,
      });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});
router.get("/profile/edit", (req, res) => {
  User.findById(req.session.currentUser._id)
    .then((dbRes) => {
      res.render("profile-edit", {
        user: dbRes,
      });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

router.post("/profile/edit/:id", upload.single("image"), (req, res) => {
  let editedProfile;
  if (req.file) {
    const { name, lastname, username, email, password } = req.body;
    const image = req.file.url;
    // const salt = 10;
    // const hashedPassword = bcrypt.hashSync(password, salt);
    editedProfile = {
      name,
      lastname,
      username,
      email,
      image,
      // password: hashedPassword,
    };
  } else {
    editedProfile = req.body;
  }
  User.findByIdAndUpdate(req.params.id, editedProfile, { new: true })
    .then((dbResult) => {
      console.log(req.body);
      res.redirect(`/users/profile`);
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});
module.exports = router;
