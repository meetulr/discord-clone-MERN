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