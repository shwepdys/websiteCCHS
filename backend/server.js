const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Middleware
app.use(cors({
  origin: "https://websitecchs.vercel.app",
  credentials: true
}));

app.use(express.json());


// Routes (THIS IS CRITICAL)
app.use("/api/auth", require("./routes/auth"));
app.use("/api/games", require("./routes/games"));

// Test route (to verify backend works)
app.get("/", (req, res) => {
  res.send("Backend is working");
});

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));

app.get("/api/test", (req, res) => {
  res.json({ working: true });
});

app.post("/api/stats/time", async (req, res) => {
  try {
    const { token, tabTime, activeTime } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await User.findByIdAndUpdate(decoded.id, {
      $inc: {
        timeTab: tabTime || 0,
        timeActive: activeTime || 0
      }
    });

    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }
});

import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP per window
  message: "Too many requests, try again later"
});

app.use("/api/", limiter);

app.use(express.json({ limit: "10kb" }));

