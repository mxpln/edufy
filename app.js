var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const moment = require("moment")
var logger = require("morgan");
var sassMiddleware = require("node-sass-middleware");
require("dotenv").config();
require("./config/mongodb");
// require("./helpers/hbs");
const hbs = require("hbs");

const session = require("express-session");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const mongoose = require("mongoose");
const coursesRouter = require("./routes/courses");
const authRouter = require("./routes/auth");
const MongoStore = require("connect-mongo")(session);

var app = express();
hbs.registerHelper("formatDateForInput", function (date, compare, options) {
  if (compare === "current")
    return moment(date).format("YYYY-DD-MMTkk:mm")
  if (compare === "min") return moment().format("YYYY-DD-MMTkk:mm");
});

hbs.registerHelper("formatDate", function (date) {
  return moment(date).format("dddd DD MMMM YYYY");
});

hbs.registerHelper("placesLeft", function (arr, max) {
  return max - arr.length;
});
hbs.registerHelper("priceUpdate", function (par, price) {
  return Math.floor(price / par.length);
});
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(
  sassMiddleware({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    // secret: process.env.CLOUDINARY_SECRET,
    cookie: {
      maxAge: 600000,
    }, // in millisec
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    saveUninitialized: true,
    resave: true,
  })
);

function checkloginStatus(req, res, next) {
  res.locals.user = req.session.currentUser ? req.session.currentUser : null;
  // access this value @ {{user}} or {{user.prop}} in .hbs
  res.locals.isLoggedIn = Boolean(req.session.currentUser);
  // access this value @ {{isLoggedIn}} in .hbs
  next(); // continue to the requested route
}

app.use(checkloginStatus);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/courses", coursesRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;