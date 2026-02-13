const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },

    // existing field (kept as-is)
    service: {
      type: String,
      required: true,
      trim: true
    },

    // added fields (used in routes)
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service"
    },
    serviceName: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      default: 0
    },

    date: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
