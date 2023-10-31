import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true
  },
  name: String,
  imageUrl: String,
  email: String,
  servers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server'
  }],
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }]
}, { timestamps: true });

const Profile = mongoose.models?.Profile || mongoose.model("Profile", profileSchema);

export default Profile;