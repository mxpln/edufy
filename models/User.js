const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
  image: {
    type: String,
    default:
      "https://media-exp1.licdn.com/dms/image/C4D03AQE3_v9XLjqxgQ/profile-displayphoto-shrink_200_200/0?e=1593648000&v=beta&t=yN9dZ5gaVNjj2PIYy-I2qlNuBVdDujbO4fDjfvn8WmU",
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
