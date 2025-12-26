import express from "express";
import Ride from "../models/Ride.js";
import admin from "../firebaseAdmin.js";
import { protect } from "../middleware/authMiddleware.js";
import { driverOnly } from "../middleware/driverOnly.js";

const router = express.Router();

// Confirm route loaded
console.log("✅ rides routes loaded");

/**
 * Create a new ride
 */
router.post("/", protect, driverOnly, async (req, res) => {
  const ride = await Ride.create({
    pickup: req.body.pickup,
    destination: req.body.destination,
    price: req.body.price,
    driverId: req.user.uid,
  });

  // 🔥 Add to Firestore
  await admin.firestore().collection("rides").doc(ride._id.toString()).set({
    pickup: ride.pickup,
    destination: ride.destination,
    price: ride.price,
    driverId: ride.driverId,
    status: "available",
  });

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
