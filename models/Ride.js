import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    pickup: { type: String, required: true },
    destination: { type: String, required: true },
    price: { type: Number },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    driverId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ride", rideSchema);
