require("dotenv").config({ path: "../.env" });
const connectDB = require("../config/db");
const User = require("../models/User");

connectDB();

User.create({
  name: "Ritu",
  email: "ritu@example.com",
  password: "1234"
})
  .then(() => {
    console.log("User Created!");
    process.exit();
  })
  .catch(err => console.log(err));
