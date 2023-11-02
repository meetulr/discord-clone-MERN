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

interface EditChannelProps {
  profileId: string;
  serverId: string;
  channelId: string;
  name: string;
  type: string;
}

export const editChannel = async ({
  profileId,
  serverId,
  channelId,
  name,
  type
}: EditChannelProps) => {
  try {
    const server = await Server.findById(serverId).populate('members');

    const member = server.members.find((member: any) => member.profileId.toString() === profileId);

    if (member.role === "ADMIN" || member.role === "MODERATOR") {
      const channel = await Channel.findById(channelId);

      if (channel.name !== 'general') {
        channel.name = name;
        channel.type = type;

        await channel.save();

        return channel.toObject({ transform: transformFunction });
      } else {
        console.log('Cannot edit a general channel');
      }
    } else {
      console.log('Member does not have sufficient permissions');
    }
  } catch (error) {
    console.log("couldn't edit the channel", error);
  }
}

interface DeleteChannelProps {
  profileId: string;
  serverId: string;
  channelId: string;
}

export const deleteChannel = async ({
  profileId,
  serverId,
  channelId
}: DeleteChannelProps) => {
  try {
    connectToDB();

    const server = await Server.findById(serverId)
      .populate("members")
      .populate("channels");

    const member = server.members.find((member: any) => member.profileId.toString() === profileId);

    if (member.role === "ADMIN" || member.role === "MODERATOR") {
      const channel = await Channel.findById(channelId);

      if (channel.name !== 'general') {
        await Channel.deleteOne({ _id: channelId });

        server.channels = server.channels.filter((channel: any) => channel._id.toString() !== channelId);

        await server.save();

        return server.toObject({ transform: transformFunction });
      } else {
        console.log('Cannot delete a general channel');
      }
    } else {
      console.log('Member does not have sufficient permissions');
    }
  } catch (error) {
    console.error(error);
  }
}