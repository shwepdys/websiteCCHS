const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: "No token provided" });

  if (req.user.role !== "admin") {
  return res.status(403).json({ message: "Admin only" });
}

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "10191805iP");
    req.user = decoded; // Attach decoded info to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
