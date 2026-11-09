const mongoose = require("mongoose");

async function connectMongoDB() {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is missing from backend/.env");
    }

    await mongoose.connect(mongoURI);

    console.log("MongoDB connected successfully!");
    console.log("Database: rentsure_evidence");

  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}

module.exports = connectMongoDB;