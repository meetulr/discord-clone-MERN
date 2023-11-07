import { connectToDB } from "@/lib/db";
import Message from "@/lib/models/message.model";
import { transformFunction } from "@/lib/mongoose.utils";

interface CreateMessageProps {
  content: string;
  fileUrl: string;
  channelId: string;
  memberId: string;
}

export const createMessage = async ({
  content,
  fileUrl,
  channelId,
  memberId
}: CreateMessageProps) => {
  try {
    connectToDB();

    const message = new Message({
      content,
      fileUrl,
      channelId,
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

interface GetMessagesProps {
  cursor: string | null;
  channelId: string;
  messagesBatch: number
}

export const getMessages = async ({
  cursor,
  channelId,
  messagesBatch
}: GetMessagesProps) => {
  try {
    connectToDB();

    let messages = [];

    if (cursor) {
      messages = await Message.find({
        _id: { $lt: cursor },
        channelId
      })
        .populate({
          path: 'memberId',
          populate: { path: 'profileId' }
        })
        .sort({ createdAt: -1 })
        .limit(messagesBatch)
    } else {
      messages = await Message.find({
        channelId
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

interface GetMessageProps {
  messageId: string;
  channelId: string;
}

export const getMessage = async ({
  messageId,
  channelId
}: GetMessageProps) => {
  try {
    connectToDB();

    const message = await Message.findOne({ _id: messageId, channelId })
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

interface UpdateMessageProps {
  messageId: string
  deleteMsg: boolean;
  updateMsg: boolean;
  content: string;
}

export const updateMessage = async ({
  messageId,
  deleteMsg,
  updateMsg,
  content
}: UpdateMessageProps) => {
  try {
    connectToDB();

    let message;

    if (deleteMsg) {
      message = await Message.findOneAndUpdate(
        { _id: messageId },
        { content, fileUrl: null, deleted: true },
        { new: true }
      );
    }
    else if (updateMsg) {
      message = await Message.findOneAndUpdate(
        { _id: messageId },
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