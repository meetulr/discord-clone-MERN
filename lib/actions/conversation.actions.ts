import mongoose from 'mongoose';
import Conversation from '@/lib/models/conversation.model';
import Member from '@/lib/models/member.model';
import { transformFunction } from '@/lib/mongoose.utils';
import { connectToDB } from '../db';

export const getOrCreateConversation = async (memberOneId: string, memberTwoId: string) => {
  let conversation = await findConversation(memberOneId, memberTwoId) || await findConversation(memberTwoId, memberOneId);

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }

  return conversation;
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const conversation = await Conversation.findOne({
      memberOneId,
      memberTwoId
    }).populate({
      path: 'memberOneId',
      populate: {
        path: 'profileId',
        model: 'Profile'
      }
    }).populate({
      path: 'memberTwoId',
      populate: {
        path: 'profileId',
        model: 'Profile'
      }
    });

    return conversation.toObject({ transform: transformFunction });
  } catch {
    return null;
  }
}

const createNewConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    const newConversation = new Conversation({
      memberOneId,
      memberTwoId
    });

    await newConversation.save();

    const conversation = await Conversation.populate(newConversation, [{
      path: 'memberOneId',
      populate: {
        path: 'profileId',
        model: 'Profile'
      }
    }, {
      path: 'memberTwoId',
      populate: {
        path: 'profileId',
        model: 'Profile'
      }
    }]);

    return conversation.toObject({ transform: transformFunction });
  } catch {
    return null;
  }
}

interface GetConversationProps {
  profileId: string;
  conversationId: string;
}

export const getConversation = async ({
  profileId,
  conversationId
}: GetConversationProps) => {
  try {
    connectToDB();

    const conversation = await Conversation.findOne({ conversationId })
      .populate({
        path: 'memberOneId',
        populate: {
          path: 'profileId',
          model: 'Profile'
        }
      }).populate({
        path: 'memberTwoId',
        populate: {
          path: 'profileId',
          model: 'Profile'
        }
      });

    if (!conversation) {
      return null;
    }

    const member = conversation.memberOneId.profileId._id.toString() === profileId ?
    conversation.memberOneId : conversation.memberTwoId.profileId._id.toString() === profileId ?
    conversation.memberTwoId : null;
    
    if(!member){
      return null;
    }

    return conversation.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("couldn't find the conversation");
  }
}