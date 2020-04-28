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
  Category.find().then((dbResCat) => {
    Course.find({})
      .populate("category")
      .then((dbRes) => {
        res.render("index", {
          courses: dbRes,
          category: dbResCat,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});


router.get("/:id", function (req, res, next) {
  Category.find().then((dbResCat) => {
    Course.findById(req.params.id)
      .populate("category")
      .then((dbRes) => {
        res.render("course-id", {
          course: dbRes,
          category: dbResCat
        });
      });
  });
});


// res.render("index");

//Homepage -id
// router.get("/index/:id", (res, req) => {
//   Course.findById(req.params.id)
//     .then((dbRes) => {
//       res.render("index-id", {
//         course: dbRes,
//       });
//     })
//     .catch((dbErr) => {
//       console.log(dbErr);
//     });
// });

//mon profil
router.get("/profile", (req, res) => {
  res.render("profile");
});







module.exports = router;

