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
  let dateSort = {
    date: +1
  };
  let filter = {}
  console.log(req.query.from)

  if (req.query.category) {
    filter.category = req.query.category;
  }
  if ((req.query.from) && (req.query.to)) {
    filter = {
      $and: [{
        date: {
          $gte: new Date(req.query.from).toISOString()
        }
      }, {
        date: {
          $lte: new Date(req.query.to).toISOString()
        }
      }]
    };
  }
  if ((req.query.category) && ((req.query.from) && (req.query.to))) {
    // filter.category = req.query.category;
    filter = {
      $and: [{
        date: {
          $gte: new Date(req.query.from).toISOString()
        }
      }, {
        date: {
          $lte: new Date(req.query.to).toISOString()
        }
      }, {
        category: req.query.category
      }]
    };
  }
  Category.find()
    .then((dbResCat) => {
      Course
        .find(filter)
        .sort(dateSort)
        .populate("category")
        .then((dbRes) => {
          // let finalArr = []
          // let arrayDates = dbRes.map(oneCourse => oneCourse.date)
          // console.log(arrayDates)
          // arrayDates.forEach(date=> {
          //   let clusteredCourses =  dbRes.filter(oneCourse => oneCourse.date === date)
          //   finalArr.push(clusteredCourses)
          // })

          // console.log("final",finalArr)

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

router.post("/search/:id", (req, res, next) => {
  Category.findById(req.params.id)
    .then((dbRes) => {
      res.render("search-result", {
        category: dbRes
      });
    });
});




//mon profil
router.get("/profile", (req, res) => {
  res.render("profile");
});







module.exports = router;