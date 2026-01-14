require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// CORS configuration - must be before other middleware
const corsOptions = {
  origin: "https://websitecchs.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Explicitly handle OPTIONS preflight requests as a fallback
app.options("*", cors(corsOptions));

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

// Test route to verify CORS is working
app.get("/api/test-cors", (req, res) => {
  res.json({ message: "CORS is working!", origin: req.headers.origin });
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/games", require("./routes/games"));

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});

app.get("/proxy", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.send("No URL");

  try {
    const r = await fetch(url);
    const text = await r.text();
    res.send(text);
  } catch {
    res.status(500).send("Proxy error");
  }
});
