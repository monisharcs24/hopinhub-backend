import express from "express";
import Ride from "../models/Ride.js";

const router = express.Router();

// Confirm route loaded
console.log("✅ rides routes loaded");

/**
 * Create a new ride
 */
router.post("/", async (req, res) => {
  const { pickup, destination, price, driverId } = req.body;

  const ride = new Ride({
    pickup,
    destination,
    price,
    driverId,
  });

  await ride.save();
  res.json(ride);
});


/**
 * Get all rides
 */
router.get("/", async (req, res) => {
  try {
    const rides = await Ride.find().sort({ createdAt: -1 });
    res.json(rides);
  } catch (err) {
    console.error("❌ Fetch rides error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
