import mongoose from 'mongoose';

const directMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  fileUrl: String,
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const DirectMessage = mongoose.models?.DirectMessage || mongoose.model('DirectMessage', directMessageSchema);

export default DirectMessage;
