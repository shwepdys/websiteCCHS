const express = require("express");
const Game = require("../models/Game");
const auth = require("../middleware/auth");

const router = express.Router();

// public
router.get("/games", async (req, res) => {
  res.json(await Game.find());
});

// admin only
router.post("/games", auth, async (req, res) => {
  await new Game(req.body).save();
  res.json({ success: true });
});

router.delete("/games/:id", auth, async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
