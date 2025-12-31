import express from "express";
import Booking from "../models/Booking.js";
import Ride from "../models/Ride.js";
import admin from "../firebaseAdmin.js";
import { protect } from "../middleware/authMiddleware.js";
import { driverOnly } from "../middleware/driverOnly.js";

const router = express.Router();

/**
 * CREATE A RIDE (Driver)
 */
router.post("/", protect, driverOnly, async (req, res) => {
  try {
    const { pickup, destination, price } = req.body;

    const ride = await Ride.create({
      pickup,
      destination,
      price,
      driverId: req.user.uid,
    });

    // Save to Firestore
    await admin.firestore().collection("rides").doc(ride._id.toString()).set({
      pickup,
      destination,
      price,
      driverId: req.user.uid,
      status: "available",
    });

    res.status(201).json(ride);
  } catch (err) {
    console.error("Create ride error:", err);
    res.status(500).json({ error: "Failed to create ride" });
  }
});

/**
 * BOOK A RIDE (User)
 */
router.post("/:rideId/book", protect, async (req, res) => {
  try {
    const booking = await Booking.create({
      ride: req.params.rideId,
      userEmail: req.user.email,
      status: "pending",
    });

    // Store in Firestore
    await admin.firestore()
      .collection("bookings")
      .doc(booking._id.toString())
      .set({
        ride: req.params.rideId,
        userEmail: req.user.email,
        status: "pending",
      });

    res.json(booking);
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ error: "Booking failed" });
  }
});

/**
 * GET BOOKINGS
 */
router.get("/", protect, async (req, res) => {
  try {
    const { driverId, userEmail } = req.query;

    let bookings = await Booking.find().populate("ride");

    if (driverId) {
      bookings = bookings.filter(
        b => b.ride && b.ride.driverId === req.user.uid
      );
    }

    if (userEmail) {
      bookings = bookings.filter(
        b => b.userEmail === req.user.email
      );
    }

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/**
 * APPROVE / REJECT BOOKING
 */
router.patch("/:id/:action", protect, driverOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    booking.status =
      req.params.action === "approve" ? "approved" : "rejected";

    await booking.save();

    // Update Firestore
    await admin.firestore()
      .collection("bookings")
      .doc(booking._id.toString())
      .update({ status: booking.status });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking" });
  }
});

export default router;
