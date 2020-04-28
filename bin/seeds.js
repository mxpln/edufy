require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Course = require("../models/Course");
const Category = require("../models/Category");
// name: String,
//   lastname: String,
//   username: String,
//   email: String,
//   password: String,
//   image: String,

// const myUser = [
//   {
//     name: "Tatijana",
//     lastname: "Rajcic",
//     username: "tatiraj",
//     email: "tatijana@ironhack.com",
//     password: "12345",
//     image: "",
//   },
//   {
//     name: "Henry",
//     lastname: "Charles",
//     username: "H77",
//     email: "henry@gmail.com",
//     password: "12345",
//     image: "",
//   },
//   {
//     name: "Logan",
//     lastname: "Smith",
//     username: "Lolo",
//     email: "logan@gmail.com",
//     password: "12345",
//     image: "",
//   },
// ];

// // const myCourse = [
// //   {
// //     title: "Learn how to play guitar in 60 minutes",
// //     description: "Lorem",
// //     image:
// //       "https://s.france24.com/media/display/7c4af900-0fcc-11e9-8b58-005056bff430/w:1240/p:16x9/a5dce48524c4310259346ab7b1a9bd55.webp",
// //     date: "2020-06-02",
// //     // category: "Music",
// //     // participants: "User",
// //     price: 100,
// //     place: "226 bvd Voltaire",
// //     minPeople: 10,
// //     maxPeople: 50,
// //     // teacher: "User2",
// //   },
// // ];

const categories = [
  {
    category: "Music",
  },
  {
    category: "Science",
  },
  {
    category: "Web Developpement",
  },
  {
    category: "DIY",
  },
  {
    category: "Photo",
  },
];

mongoose
  .connect("mongodb://localhost/edufy", { useNewUrlParser: true })
  .then((self) => {
    console.log(`Connected to ${self.connection.name}`);

    // Seeds
    Category.create(categories)
      .then((dbResponse) => {
        console.log(dbResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  })
  .catch((err) => {
    console.log(`Error occured while connecting to the Database ${err}`);
  });
