const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  title: String,
  description: String,
  image: String,
  date: Date,
  // time: Date,
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
  price: Number,
  place: String,
  minPeople: Number,
  maxPeople: Number,
  teacher: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const courseModel = mongoose.model("Course", courseSchema);

module.exports = courseModel;
