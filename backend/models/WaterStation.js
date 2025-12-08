const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  stationName: String,
  location: String,
  ph: Number,
  turbidity: Number,
  tds: Number,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }
});

module.exports = mongoose.model("WaterStation", stationSchema);
