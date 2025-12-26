import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import { protect } from "../middleware/authMiddleware.js";
import { driverOnly } from "../middleware/driverOnly.js";

const router = express.Router();

router.post("/", protect, driverOnly, async (req, res) => {
  const { pickup, destination, price } = req.body;

  const ride = await Ride.create({
    pickup,
    destination,
    price,
    driverId: req.user.uid,
  });

  res.json(ride);
});


router.post("/:rideId/book", protect, async (req, res) => {
  const booking = await Booking.create({
    ride: req.params.rideId,
    userEmail: req.user.email,
  });
  res.json(booking);
});

router.get("/",protect, async (req, res) => {
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
});



router.patch("/:id/:action", protect, driverOnly, async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) return res.status(404).json({ error: "Not found" });

  booking.status =
    req.params.action === "approve" ? "approved" : "rejected";

  await booking.save();

  // 🔥 Update Firestore
  await admin.firestore()
    .collection("bookings")
    .doc(booking._id.toString())
    .update({ status: booking.status });

  res.json({ success: true });
});


export default router;
