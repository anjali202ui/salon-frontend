const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");

/*
=======================
 USER: Send contact message
=======================
 POST /api/contact
*/
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const msg = new ContactMessage({ name, email, message });
    await msg.save();

    res.json({ success: true, message: "Message sent 💌" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
=======================
 ADMIN: Get all messages
=======================
 GET /api/contact
*/
router.get("/", async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
=======================
 ADMIN: Mark message read/unread
=======================
 PUT /api/contact/:id
*/
router.put("/:id", async (req, res) => {
  try {
    const { read } = req.body;

    const updatedMsg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read },
      { new: true }
    );

    if (!updatedMsg) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json(updatedMsg);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
=======================
 ADMIN: Delete ONE message
=======================
 DELETE /api/contact/:id
*/
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted 🗑️" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/*
=======================
 ADMIN: Delete ALL messages  ✅ FIX
=======================
 DELETE /api/contact
*/
router.delete("/", async (req, res) => {
  try {
    await ContactMessage.deleteMany({});
    res.json({ success: true, message: "All messages deleted 🧹" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
