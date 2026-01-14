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
