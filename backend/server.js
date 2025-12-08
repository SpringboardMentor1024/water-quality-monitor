const dotenv = require("dotenv");
dotenv.config();
console.log("Database URL:", process.env.MONGO_URI);

const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // allow JSON

app.get("/", (req, res) => {
  res.send("Water Monitoring Backend Running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

