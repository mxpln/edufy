const express = require("express");
const router = new express.Router();
const User = require("../models/User");
const upload = require("../config/cloudinary");
const bcrypt = require("bcrypt");

router.get("/signup", (req, res, next) => {
  res.render("sign-up.hbs");
});

router.get("/login", (req, res, next) => {
  res.render("log-in");
});
router.post("/signup", upload.single("image"), (req, res) => {
  const { name, lastname, username, email, password } = req.body;
  User.findOne({ email: email })
    .then((foundUser) => {
      if (foundUser) {
        res.redirect("/auth/signup");
      } else {
        console.log(req.file);
        const salt = 10;
        const hashedPassword = bcrypt.hashSync(password, salt);
        const newUser = {
          name,
          lastname,
          username,
          email,
          password: hashedPassword,
        };
        if (req.file) {
          newUser.image = req.file.url;
        }
        User.create(newUser)
          .then((createdUser) => {
            res.redirect("/auth/login"); // Redirect to signin !
          })
          .catch((dbErr) => {
            console.log(dbErr);
          });
      }
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

module.exports = router;
