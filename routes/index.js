var express = require("express");
var router = express.Router();
const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

/*Landing Page */
router.get("/", function (req, res, next) {
  res.render("landing");
});

//Homepage
router.get("/index", function (req, res, next) {
  res.render("index");
});

//Homepage -id
router.get("/index/:id", (res, req) => {
  Course.findById(req.params.id)
    .then((dbRes) => {
      res.render("index-id", {
        course: dbRes,
      });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

module.exports = router;
