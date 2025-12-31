import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  photo: String,

  role: {
    type: String,
    enum: ["user", "driver"],
    default: "user",
  },
});

export default mongoose.model("User", userSchema);
