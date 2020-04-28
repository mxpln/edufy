var express = require('express');
var router = express.Router();
const Category = require("../models/Category.js");
const Course = require("../models/Course.js");
const upload = require("../config/cloudinary");

//get prof courses (dashboard)
router.get("/prof", function (req, res, next) {
  Course.find({})
  .then((dbRes) => {
    res.render("prof-courses", {
      courses : dbRes,
    });
  })
  .catch((err) => {
    console.log(err);
  })
  // res.render("prof-courses");
});



/* GET Course form. */
router.get('/add', function (req, res, next) {
  Category.find()
    .then((categories) => {
      res.render('create-course-form.hbs', {
        categories
      })
    })
    .catch(next);


});
//POST course form

// router.post("/add", (req, res) => {
//   Course.create(req.body)
//   .then((dbRes) => {
//     res.redirect("/courses/add");
//   })
//   .catch((err) => {
//     console.log(err)
//   });
// });


router.post('/add', upload.single('image'), (req, res, next) => {
  const {
    title,
    description,
    price,
    date,
    minPeople,
    maxPeople,
    place,
    id_cat
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
    id_cat
  });
  newCourse.save()
    .then(dbRes => {
      console.log("heeere");
      res.redirect('/courses/prof');
    })
    .catch(error => {
      console.log(error);
    });
});







//get student courses
router.get("/student", (req, res) => {
  res.render("my-courses");
});


//get student courses ID
router.get("/student/:id", (res, req) => {
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



module.exports = router;