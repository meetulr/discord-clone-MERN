import mongoose from "mongoose";

const serverSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  inviteCode: {
    type: String,
    unique: true
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  }],
  channels: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  }]
}, { timestamps: true });

const Server = mongoose.models.Server || mongoose.model("Server", serverSchema);

export default Server;