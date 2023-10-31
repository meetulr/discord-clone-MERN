import mongoose from "mongoose";

export const MemberRole = Object.freeze({
  ADMIN: 'ADMIN',
  MODERATOR: 'MODERATOR',
  GUEST: 'GUEST'
});

const memberSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: Object.values(MemberRole),
    default: MemberRole.GUEST
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
  }],
  directMessages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DirectMessage'
  }],
  conversationsInitiated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }],
  conversationsReceived: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation'
  }]
}, { timestamps: true });

Object.assign(memberSchema.statics, { MemberRole });

const Member = mongoose.models?.Member || mongoose.model('Member', memberSchema);

export default Member;
