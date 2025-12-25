import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
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



router.patch("/:id/approve", async (req, res) => {
  console.log("APPROVE HIT", req.params.id);

  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  booking.status = "approved";
  await booking.save();

  res.json({ success: true, booking });
});


router.patch("/:id/reject", async (req, res) => {
  console.log("REJECT HIT", req.params.id);

  const booking = await Booking.findById(req.params.id);
  booking.status = "rejected";
  await booking.save();

  res.json(booking);
});

export default router;
