const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

/*
========================
 USER: Get ACTIVE services (Booking page)
 GET /api/services/active/list
========================
*/
router.get("/active/list", async (req, res) => {
  try {
    const services = await Service.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active services" });
  }
});

/*
========================
 (Optional) BACKWARD SUPPORT
 GET /api/services/active
========================
*/
router.get("/active", async (req, res) => {
  try {
    const services = await Service.find({ status: "active" }).sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch active services" });
  }
});

/*
========================
 ADMIN: Get ALL services
 GET /api/services
========================
*/
router.get("/", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

/*
========================
 ADMIN: Get SINGLE service
 GET /api/services/:id
========================
*/
router.get("/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service" });
  }
});

/*
========================
 ADMIN: ADD new service
 POST /api/services
========================
*/
router.post("/", async (req, res) => {
  try {
    const { name, category, price, duration, status } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = new Service({
      name,
      category,
      price,
      duration,
      status: status || "active"
    });

    await service.save();

    res.status(201).json({
      success: true,
      message: "Service added ✅",
      service
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add service" });
  }
});

/*
========================
 ADMIN: UPDATE service
 PUT /api/services/:id
========================
*/
router.put("/:id", async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update service" });
  }
});

/*
========================
 ADMIN: DELETE service
 DELETE /api/services/:id
========================
*/
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json({ message: "Service deleted 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service" });
  }
});

module.exports = router;
