const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    // Service basic info
    name: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    duration: {
      type: String // e.g. "30 min", "1 hour"
    },

    // Admin control
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
