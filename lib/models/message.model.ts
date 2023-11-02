import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  fileUrl: String,
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member'
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel'
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

const Message = mongoose.models?.Message || mongoose.model('Message', messageSchema);

export default Message;