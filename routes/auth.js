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
        res.render("sign-up", {
          errorMessage: "Email already exists",
        });
        return;
      } else {
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
router.post("/login", (req, res, next) => {
  const theEmail = req.body.email;
  const thePassword = req.body.password;

  if (theEmail === "" || thePassword === "") {
    res.render("log-in", {
      errorMessage: "Please enter both, username and password to sign up.",
    });
    return;
  }

  User.findOne({ email: theEmail })
    .then((user) => {
      if (!user) {
        res.render("log-in", {
          errorMessage: "The username doesn't exist.",
        });
        return;
      }
      if (bcrypt.compareSync(thePassword, user.password)) {
        req.session.currentUser = user;
        res.redirect("/index");
      } else {
        res.render("log-in", {
          errorMessage: "Incorrect password",
        });
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
module.exports = router;
