var express = require("express");
var router = express.Router();
const moment = require("moment");
const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");

/*Landing Page */
router.get("/", function (req, res, next) {
  res.render("landing");
});

//Homepage
router.get("/index", function (req, res, next) {
  let dateSort = {
    date: +1,
  };
  let filter = {};
  console.log(req.query.from);

  if (req.query.category) {
    filter.category = req.query.category;
  }
  if (req.query.from && req.query.to) {
    filter = {
      $and: [
        {
          date: {
            $gte: new Date(req.query.from).toISOString(),
          },
        },
        {
          date: {
            $lte: new Date(req.query.to).toISOString(),
          },
        },
      ],
    };
  }
  if (req.query.category && req.query.from && req.query.to) {
    // filter.category = req.query.category;
    filter = {
      $and: [
        {
          date: {
            $gte: new Date(req.query.from).toISOString(),
          },
        },
        {
          date: {
            $lte: new Date(req.query.to).toISOString(),
          },
        },
        {
          category: req.query.category,
        },
      ],
    };
  }
  Category.find().then((dbResCat) => {
    Course.find(filter)
      .sort(dateSort)
      .populate({
        path: "participants",
        model: User,
      })
      .populate("category")
      .populate({ path: "teacher", model: User })
      .then((dbRes) => {
        let today = new Date();

        let comingCourses = dbRes.filter((course) => {
          return course.date >= today;
        });
        let finalArr = [];
        let arrayDates = comingCourses.map((oneCourse) => oneCourse.date);
        let stringifiedDates = new Set(
          arrayDates.map((oneDate) => oneDate.toString())
        );

        stringifiedDates.forEach((date) => {
          let clusteredCourses = dbRes.filter(
            (oneCourse) => oneCourse.date.toString() === date
          );
          finalArr.push({
            date: moment(date).format("dddd DD MMMM YYYY"),
            courses: clusteredCourses,
          });
        });

        res.render("index", {
          // futureCourses,
          courses: dbRes,
          category: dbResCat,
          participants: dbRes,
          // teacher: teacher,
          finalArr: finalArr,
          // participants: dbRes.participants,
        });
      });
  });
});

router.get("/:id", function (req, res, next) {
  Category.find()
    .then((dbResCat) => {
      Course.findById(req.params.id)
        .populate("category")
        .populate({ path: "participants", model: User })
        .populate({ path: "teacher", model: User })
        .then((dbRes) => {
          const hasCourse = dbRes.participants
            .map((participants) => participants._id)
            .includes(req.session.currentUser._id);

          let par = dbRes.participants;
          res.render("course-id", {
            course: dbRes,
            category: dbResCat,
            hasCourse: hasCourse,
            participants: par,
          });
        })
        .catch((dbErr) => {
          console.log(dbErr);
        });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

router.post("/search/:id", (req, res, next) => {
  Category.findById(req.params.id).then((dbRes) => {
    res.render("search-result", {
      category: dbRes,
    });
  });
});

//mon profil
router.get("/profile", (req, res) => {
  res.render("profile");
});

module.exports = router;
