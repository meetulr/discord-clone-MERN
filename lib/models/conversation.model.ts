import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  memberOneId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  memberTwoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
}, {
  timestamps: true,
});

const Conversation = mongoose.models?.Conversation || mongoose.model('Conversation', conversationSchema);

export default Conversation;
