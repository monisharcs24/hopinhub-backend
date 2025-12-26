import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: String,
  email: String,
  role: { type: String, enum: ["user", "driver"], default: "user" },
});

export default mongoose.model("User", userSchema);
