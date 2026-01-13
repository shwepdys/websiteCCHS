require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fetch = require("node-fetch");

app.use(cors({ origin: true }));
app.use(cors({
  origin: "https://websitecchs.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
const app = express();
app.use(express.json());
app.options("*", cors());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/games", require("./routes/games"));

/* Basic proxy endpoint */
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

app.listen(process.env.PORT || 3000);
