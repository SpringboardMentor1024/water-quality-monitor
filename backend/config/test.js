const User = require("./models/User");
require("./config/db");  // Connect to DB

User.create({
    name: "Test User",
    email: "test@gmail.com",
    password: "1234"
})
.then(() => {
    console.log("User created successfully");
    process.exit();
})
.catch(err => console.log(err));
