import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import rideRoutes from "./routes/rides.js";
import bookingRoutes from "./routes/bookings.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rides", rideRoutes);
app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
  res.send("HopInHub backend is running 🚀");
});

// ✅ CONNECT TO MONGODB FIRST
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

startServer();
