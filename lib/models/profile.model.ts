import mongoose from "mongoose";
import { boolean } from "zod";

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true
  },
  name: String,
  imageUrl: String,
  email: String,
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Profile = mongoose.models?.Profile || mongoose.model("Profile", profileSchema);

export default Profile;