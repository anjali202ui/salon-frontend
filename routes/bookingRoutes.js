const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Service = require("../models/Service");

// Optional email utils (won’t break if you add later)
let sendConfirmEmail, sendCancelEmail;
try {
  ({ sendConfirmEmail, sendCancelEmail } = require("../utils/sendBookingEmail"));
} catch (err) {
  console.log("Email utils not configured yet 📧");
}

/*
=======================
 USER: Create booking
=======================
*/
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, serviceId, serviceName, date, time } = req.body;

    // 🔧 require email (needed for confirmation email)
    if (!name || !email || !phone || !date || !time || (!serviceId && !serviceName)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let finalServiceName = serviceName;
    let price = 0;
    let finalServiceId = serviceId;

    // If serviceId is provided → fetch service details
    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      finalServiceName = service.name;
      price = service.price || 0;
      finalServiceId = service._id;
    }

    const booking = new Booking({
      name,
      email,
      phone,

      // 🔧 model-required field
      service: finalServiceName,

      serviceId: finalServiceId,
      serviceName: finalServiceName,
      price,

      date,
      time
      // status defaults to "pending"
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking successful ✅",
      booking
    });

  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ message: "Booking failed ❌" });
  }
});

/*
=======================
 ADMIN: Get all bookings
=======================
*/
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

/*
=======================
 ADMIN: Confirm booking
=======================
*/
router.put("/confirm/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔧 lowercase status (matches model & admin)
    booking.status = "confirmed";
    await booking.save();

    if (sendConfirmEmail && booking.email) {
      await sendConfirmEmail(booking.email, booking);
    }

    res.json({
      success: true,
      message: "Booking confirmed ✅"
    });

  } catch (error) {
    console.error("Confirm booking error:", error);
    res.status(500).json({ message: "Failed to confirm booking" });
  }
});

/*
=======================
 ADMIN: Cancel booking
=======================
*/
router.put("/cancel/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🔧 lowercase status
    booking.status = "cancelled";
    await booking.save();

    if (sendCancelEmail && booking.email) {
      await sendCancelEmail(booking.email, booking);
    }

    res.json({
      success: true,
      message: "Booking cancelled ❌"
    });

  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
});

/*
=======================
 ADMIN: Update booking status (generic)
=======================
*/
router.put("/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
