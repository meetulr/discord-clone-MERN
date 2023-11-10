import mongoose from "mongoose";
import { boolean, string } from "zod";

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
  deleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

Object.assign(memberSchema.statics, { MemberRole });

const Member = mongoose.models?.Member || mongoose.model('Member', memberSchema);

export default Member;
