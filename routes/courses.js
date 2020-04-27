var express = require('express');
var router = express.Router();
const Category = require("../models/Category.js")

/* GET users listing. */
router.get('/add', function(req, res, next) {
  Category.find()
  .then((categories) => {
      console.log(categories)
          res.render('create-course-form.hbs', {categories})
        })
  .catch(next);


});
//POST



module.exports = router;