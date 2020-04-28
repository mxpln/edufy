var express = require("express");
var router = express.Router();
const Category = require("../models/Category.js");
const Course = require("../models/Course.js");
const upload = require("../config/cloudinary");

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
  Category.find().then((dbResCat) => {
    Course.findById(req.params.id)
      .populate("category")
      .then((dbRes) => {
        res.render("my-course-id", {
          course: dbRes,
          category: dbResCat
        });
      });
  });
});


router.get("/:id/edit", function (req, res, next) {
  Category.find().then((dbResCat) => {
    Course.findById(req.params.id)
      .populate("category")
      .then((dbRes) => {
        res.render("one-course-edit", {
          course: dbRes,
          category: dbResCat
        });
      });
  });
});


router.post("/:id/edit", upload.single("image"), (req, res, next) => {
  let editedCourse 
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
    editedCourse = req.body
  }
  console.log(editedCourse)
  Course.findByIdAndUpdate(req.params.id, editedCourse, {
      new: true
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
  })
})

module.exports = router;