const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// TEMP admin credentials (you can later connect this to MongoDB)
const ADMIN_USER = "admin";
const ADMIN_PASS = "10191805iP";

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET || "10191805iP",
    { expiresIn: "2h" }
  );

  res.json({ token });
});

module.exports = router;
