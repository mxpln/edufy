var express = require("express");
var router = express.Router();
const Category = require("../models/Category.js");
const User = require("../models/User");
const Course = require("../models/Course.js");
const upload = require("../config/cloudinary");



router.get("/student", (req, res) => {

  let dateSort = {
    date: +1,
  };

  let today = new Date();
  User.findById(req.session.currentUser._id)
    .populate("courses")
    .then((dbResUser) => {

      let pastCourses = dbResUser.courses.filter((course) => {
        return course.date <= today
      });

      function compare(a, b) {
        if (a.date <= b.date) {
          return -1;
        }
        if (a.date >= b.date) {
          return 1;
        }
        // a must be equal to b
        return 0;
      };

      pastCourses.sort(compare)


      let futureCourses = dbResUser.courses.filter((course) => {
        return course.date >= today
      });

      futureCourses.sort(compare)

      

      res.render("my-courses", {
        user: dbResUser,
        // courses: dbResUser.courses
        pastCourses,
        futureCourses
      });
    })
    .catch((dbError) => {
      console.log(dbError);
    });
});





//get prof courses (dashboard)
router.get("/prof", function (req, res, next) {

  Category.find().then((dbResCat) => {
    Course.find({})
      .populate("category")

      .then((dbRes) => {
        res.render("prof-courses", {

          courses: dbRes,
          category: dbResCat,
        });
      })

      .catch((err) => {
        console.log(err);
      });
  });
});

/* GET Course form. -> get localhost:3000/courses/add*/
router.get("/add", function (req, res, next) {
  Category.find()
    .then((categories) => {
      res.render("create-course-form.hbs", {
        categories,
      });
    })
    .catch(next);
});

router.post("/add", upload.single("image"), (req, res, next) => {
  const {
    title,
    description,
    price,
    date,
    minPeople,
    maxPeople,
    place,
    category,
  } = req.body;
  const image = req.file.url;
  const newCourse = new Course({
    title,
    description,
    price,
    date,
    minPeople,
    maxPeople,
    place,
    image,
    category,
  });
  newCourse
    .save()
    .then((dbRes) => {
      res.redirect("/courses/prof");
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/:id", function (req, res, next) {
  Category.find()
    .then((dbResCat) => {
      Course.findById(req.params.id)
        .populate("category")
        .then((dbRes) => {
          res.render("my-course-id", {
            course: dbRes,
            category: dbResCat,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.get("/:id/edit", function (req, res, next) {
  Category.find()
    .then((dbResCat) => {
      Course.findById(req.params.id)
        .populate("category")
        .then((dbRes) => {
          res.render("one-course-edit", {
            course: dbRes,
            category: dbResCat,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

router.post("/:id/edit", upload.single("image"), (req, res, next) => {
  let editedCourse;
  if (req.file) {
    const {
      title,
      description,
      price,
      date,
      minPeople,
      maxPeople,
      place,
      category,
    } = req.body;
    const image = req.file.url;
    editedCourse = {
      title,
      description,
      price,
      date,
      minPeople,
      maxPeople,
      place,
      image,
      category,
    };
  } else {
    editedCourse = req.body;
  }
  console.log(editedCourse);
  Course.findByIdAndUpdate(req.params.id, editedCourse, {
      new: true,
    })
    .then((dbRes) => {
      console.log(dbRes);
      res.redirect("/courses/prof");
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

router.post("/:id/delete", (req, res, next) => {
  Course.findByIdAndDelete(req.params.id)
    .then((dbRes) => {
      res.redirect("/courses/prof");
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});
router.post("/:id/add", (req, res) => {
  Course.findByIdAndUpdate(req.params.id, {
      $addToSet: {
        participants: req.session.currentUser._id
      },
    })
    .then((dbRes) => {
      User.findByIdAndUpdate(req.session.currentUser._id, {
          $addToSet: {
            courses: req.params.id
          },
        })
        .then((dbResUser) => {
          req.session.currentUser = dbResUser;
          res.redirect("/index");
        })
        .catch((dbErr) => {
          console.log(dbErr);
        });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

router.post("/:id/remove", (req, res) => {
  Course.findByIdAndUpdate(req.params.id, {
      $pull: {
        participants: req.session.currentUser._id
      },
    })
    .then((dbRes) => {
      User.findByIdAndUpdate(req.session.currentUser._id, {
          $pull: {
            courses: req.params.id
          },
        })
        .then((dbResUser) => {
          req.session.currentUser = dbResUser;
          res.redirect("/courses/student");
        })
        .catch((dbErr) => {
          console.log(dbErr);
        });
    })
    .catch((dbErr) => {
      console.log(dbErr);
    });
});

module.exports = router;