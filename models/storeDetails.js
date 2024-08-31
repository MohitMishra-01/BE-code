const mongoose = require("mongoose")

const storeDetails = new mongoose.Schema(
  {
    status: {
        type: String,
        enum: ["open","close"],
        default: "close"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Store", storeDetails); 