import mongoose from "mongoose";

const ChannelType = Object.freeze({
  TEXT: 'TEXT',
  AUDIO: 'AUDIO',
  VIDEO: 'VIDEO'
});

const channelSchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: Object.values(ChannelType),
    default: ChannelType.TEXT
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  serverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Server'
  },
  messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  }]
}, { timestamps: true });

Object.assign(channelSchema.statics, { ChannelType });

const Channel = mongoose.models.Channel || mongoose.model('Channel', channelSchema);

export default Channel;
