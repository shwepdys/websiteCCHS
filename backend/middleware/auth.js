// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "10191805iP");
    req.user = decoded; // attach decoded token to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
