import { v4 as uuidv4 } from "uuid";
import { connectToDB } from "@/lib/db";

import Server from "@/lib/models/server.model";
import Member from "@/lib/models/member.model";
import Channel from "@/lib/models/channel.model";
import { MemberRole } from "@/lib/models/member.model";

export const getServer = async (profileId: string) => {
  try {
    connectToDB();
    const member = await Member.findOne({ profileId });

    return member?.serverId;
  } catch (error) {
    console.log("cannot find the server", error);
  }
}


interface ServerProps {
  profileId: string;
  name: string;
  imageUrl: string;
}

export const createServer = async ({
  profileId,
  name,
  imageUrl
}: ServerProps) => {
  try {
    connectToDB();

    const newServer = new Server({
      name,
      imageUrl,
      inviteCode: uuidv4(),
      profileId
    });


    await newServer.save();

    const newChannel = new Channel({
      name: "general",
      profileId,
      serverId: newServer._id
    });

    await newChannel.save();

    const newMember = new Member({
      profileId,
      role: MemberRole.ADMIN,
      serverId: newServer._id
    });

    await newMember.save();

    const updatedServer = await Server.findOneAndUpdate(
      { _id: newServer._id },
      { $push: { channels: newChannel._id, members: newMember._id } },
      { new: true }
    );

    return updatedServer;
  } catch (error: any) {
    console.log("failed to create Server ", error.message);
  }
}


export const getServers = async (profileId: string) => {
  try {
    connectToDB();

    const members = await Member.find({ profileId: profileId });
    const memberIds = members.map(member => member._id);
    const servers = await Server.find({ members: { $in: memberIds } });

    return servers;
  } catch (error) {
    console.log("couldn't get the servers", error);
  }
}