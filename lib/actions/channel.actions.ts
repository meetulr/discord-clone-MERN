import { connectToDB } from "@/lib/db";
import Server from "@/lib/models/server.model";
import Channel from "@/lib/models/channel.model";
import { transformFunction } from "@/lib/mongoose.utils";

interface CreateChannelProps {
  profileId: string;
  serverId: string;
  name: string;
  type: string;
}

export const createChannel = async ({
  profileId,
  serverId,
  name,
  type
}: CreateChannelProps) => {
  try {
    connectToDB();

    const server = await Server.findOne({ _id: serverId })
      .populate('members');

    const member = server.members.find((member: any) => member.profileId.toString() === profileId);

    if (member && member.role === "ADMIN" || member.role === "MODERATOR") {
      const newChannel = new Channel({
        profileId,
        serverId,
        name,
        type
      });

      await newChannel.save();

      server.channels.push(newChannel);

      await server.save();

      return newChannel.toObject({ transform: transformFunction });
    } else {
      throw new Error("Not an Admin or a Moderator");
    }
  } catch (error) {
    console.log("counldn't create the channel", error);
  }
}
