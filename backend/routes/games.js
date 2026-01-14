const express = require("express");
const Game = require("../models/Game");
const auth = require("../middleware/auth");

const router = express.Router();

// public
router.get("/", async (req, res) => {
  res.json(await Game.find());
});

// admin only
router.post("/", auth, async (req, res) => {
  await new Game(req.body).save();
  res.json({ success: true });
});

router.get("/:id", auth, async (req, res) => {
  const game = await Game.findById(req.params.id);
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json(game);
});

router.put("/:id", auth, async (req, res) => {
  const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json({ success: true });
});

router.delete("/:id", auth, async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
