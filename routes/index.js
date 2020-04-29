var express = require("express");
var router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");

/*Landing Page */
router.get("/", function (req, res, next) {
  res.render("landing");
});

//Homepage
router.get("/index", function (req, res, next) {
  Category.find().then((dbResCat) => {
    Course.find({})
      //.populate("participants")
      .populate({ path: "participants", model: User })
      .populate("category")
      .then((dbRes) => {
        let participants = dbRes[0].participants[0];
        // dbRes[0]
        //   .populate("participants")
        //   .execPopulate()
        //   .then((toto) => console.log(toto));
        res.render("index", {
          courses: dbRes,
          category: dbResCat,
          participants: participants,
          // participants: dbRes.participants,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/:id", function (req, res, next) {
  Category.find()
    .then((dbResCat) => {
      Course.findById(req.params.id)
        .populate("category")
        .populate({ path: "participants", model: User })
        .then((dbRes) => {
          const hasCourse = dbRes.participants
            .map((participants) => participants._id)
            .includes(req.session.currentUser._id);

          let par = dbRes.participants;
          console.log(par);
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
