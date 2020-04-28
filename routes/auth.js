const express = require("express");
const router = new express.Router();
const User = require("../models/User");

router.get("/signup", (req, res, next) => {
  res.render("sign-up.hbs");
});

router.get("/login", (req, res, next) => {
  res.render("log-in.hbs");
});

module.exports = router;
