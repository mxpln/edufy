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

//mon profil
router.get("/profile", (req, res) => {
  res.render("profile");
});

//mes cours
router.get("/mycourses", (req, res) => {
  res.render("my-courses");
});

router.get("/mycourse/:id", (res, req) => {
  Course.findById(req.params.id)
    .then((dbRes) => {
      res.render("mycourse", {
        course: dbRes,
      });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

//create course
router.get("/create", function (req, res, next) {
  res.render("create-course");
});

//create course form
// router.get("/add", function (req, res, next) {
//   res.render("create-course-form");
// });

module.exports = router;
