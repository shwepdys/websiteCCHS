const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Admin = require("../models/Admin");

const router = express.Router();

// Register (everyone becomes a regular 'user')
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!username || !password || !emailRegex.test(username)) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ message: "Email already registered" });

  const user = new User({ username, password, role: "user" });
  await user.save();


  res.json({ message: "User registered successfully" });
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Check admin first
    let account = await Admin.findOne({ username });
    let role = "admin";

    // 2. If not admin, check users
    if (!account) {
      account = await User.findOne({ username });
      role = "user";
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ FIXED HERE
    const match = await account.matchPassword(password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: account._id, username: account.username, role },
      process.env.JWT_SECRET || "10191805iP",
      { expiresIn: "2h" }
    );

    res.json({ token });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
