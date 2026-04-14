import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
}, { timestamps: true, collection: "users_v1" });

const User = mongoose.model("UserV1", userSchema);

export default User;
