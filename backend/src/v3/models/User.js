import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 130,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    sourceVersion: {
      type: String,
      enum: ["v1", "v2", "v3"],
      default: "v3",
    },
  },
  { timestamps: true, collection: "users_v3" },
);

const User = mongoose.model("UserV3", userSchema);

export default User;
