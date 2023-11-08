import { connectToDB } from "@/lib/db";
import DirectMessage from "@/lib/models/directMessage.model";
import { transformFunction } from "@/lib/mongoose.utils";

interface CreateDirectMessageProps {
  content: string;
  fileUrl: string;
  conversationId: string;
  memberId: string;
}

export const createDirectMessage = async ({
  content,
  fileUrl,
  conversationId,
  memberId
}: CreateDirectMessageProps) => {
  try {
    connectToDB();

    const message = new DirectMessage({
      content,
      fileUrl,
      conversationId,
      memberId,
    });

    await message.save();

    await message.populate({
      path: 'memberId',
      populate: { path: 'profileId' }
    });

    return message.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("couldn't create the message", error);
  }
}


interface GetDirectMessagesProps {
  cursor: string | null;
  conversationId: string;
  messagesBatch: number
}

export const getDirectMessages = async ({
  cursor,
  conversationId,
  messagesBatch
}: GetDirectMessagesProps) => {
  try {
    connectToDB();

    let messages = [];

    if (cursor) {
      messages = await DirectMessage.find({
        _id: { $lt: cursor },
        conversationId
      })
        .populate({
          path: 'memberId',
          populate: { path: 'profileId' }
        })
        .sort({ createdAt: -1 })
        .limit(messagesBatch)
    } else {
      messages = await DirectMessage.find({
        conversationId
      })
        .populate({
          path: 'memberId',
          populate: { path: 'profileId' }
        })
        .sort({ createdAt: -1 })
        .limit(messagesBatch)
    }

    if (!messages) {
      return [];
    }

    messages = messages.map((message) => message.toObject({ transform: transformFunction }));

    return messages;
  } catch (error) {
    console.log("couldn't get messages", error);
  }
}

interface GetDirectMessageProps {
  directMessageId: string;
  conversationId: string;
}

export const getDirectMessage = async ({
  directMessageId,
  conversationId
}: GetDirectMessageProps) => {
  try {
    connectToDB();

    const message = await DirectMessage.findOne({ _id: directMessageId, conversationId })
      .populate({
        path: 'memberId',
        populate: { path: 'profileId' }
      });

    if (!message) {
      return null;
    }

    return message.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("coundn't get the messagge", error);
  }
}

interface UpdateDirectMessageProps {
  directMessageId: string
  deleteMsg: boolean;
  updateMsg: boolean;
  content: string;
}

export const updateDirectMessage = async ({
  directMessageId,
  deleteMsg,
  updateMsg,
  content
}: UpdateDirectMessageProps) => {
  try {
    connectToDB();

    let message;

    if (deleteMsg) {
      message = await DirectMessage.findOneAndUpdate(
        { _id: directMessageId },
        { content, fileUrl: null, deleted: true },
        { new: true }
      );
    }
    else if (updateMsg) {
      message = await DirectMessage.findOneAndUpdate(
        { _id: directMessageId },
        { content },
        { new: true }
      )
    }

    await message.populate({
      path: 'memberId',
      populate: { path: 'profileId' }
    });

    return message.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("couldn't update the message", error);
  }
}