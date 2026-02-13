require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES (UNCHANGED)
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const contactRoutes = require("./routes/contactRoutes");

app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/contact", contactRoutes);

// BASIC TEST ROUTE (UNCHANGED)
app.get("/", (req, res) => {
  res.send("API working ✅");
});

/* ==================================================
   ✅ EMAIL DEBUG TEST ROUTE (SAFE – TEMPORARY)
   DOES NOT TOUCH EXISTING BOOKING LOGIC
================================================== */
app.get("/test-email", async (req, res) => {
  try {
    const { sendConfirmEmail } = require("./utils/sendBookingEmail");

    await sendConfirmEmail(
      "test@gmail.com", // replace with your email for testing
      {
        name: "Test User",
        service: "Hair Cut",
        date: "Today",
        time: "5 PM",
      }
    );

    res.send("Test email sent ✅ Check inbox");
  } catch (err) {
    console.error("❌ Email test failed:", err);
    res.status(500).send("Email failed ❌");
  }
});

// DB
mongoose
  .connect("mongodb://127.0.0.1:27017/salon")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.error("MongoDB error:", err));

// SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("EMAIL USER:", process.env.EMAIL_USER ? "Loaded ✅" : "Missing ❌");
});
