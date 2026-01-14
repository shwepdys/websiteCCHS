require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "admin@example.com";      // CHANGE THIS
    const password = "123456";              // CHANGE THIS
    const role = "admin";                   // "user" or "admin"

    // Check if already exists
    const existing = await User.findOne({ username: email });
    if (existing) {
      console.log("User already exists");
      process.exit();
    }

    const user = new User({
      username: email,
      password: password,
      role: role
    });

    await user.save();
    console.log("✅ User created successfully!");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", role);

    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

createUser();
