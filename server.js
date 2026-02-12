const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Add user route
app.post("/add-user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send("User saved successfully ✅");
  } catch (error) {
    res.status(500).send("Error saving user");
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
