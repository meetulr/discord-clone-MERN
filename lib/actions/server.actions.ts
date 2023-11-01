import { v4 as uuidv4 } from "uuid";
import { connectToDB } from "@/lib/db";

import Server from "@/lib/models/server.model";
import Member from "@/lib/models/member.model";
import Channel from "@/lib/models/channel.model";
import { MemberRole } from "@/lib/models/member.model";

import { transformFunction } from "../mongoose.utils";
import { ServerObject } from "../object-interface";

export const getServer = async (profileId: string) => {
  try {
    connectToDB();
    const member = await Member.findOne({ profileId });

    return member?.serverId.toString();
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

    return updatedServer.toObject({ transform: transformFunction });
  } catch (error: any) {
    console.log("failed to create Server ", error.message);
  }
}


export const getServers = async (profileId: string) => {
  try {
    connectToDB();

    const members = await Member.find({ profileId });

    if (!members) {
      return null;
    }

    const memberIds = members.map(member => member._id);
    let servers = await Server.find({ members: { $in: memberIds } });

    if (!servers) {
      return null;
    }

    servers = servers.map((server) => server.toObject({ transform: transformFunction }));
    return servers;
  } catch (error) {
    console.log("couldn't get the servers", error);
  }
}

export const getCurrentServer = async (serverId: string, profileId: string) => {
  try {
    connectToDB();

    let server = await Server.findOne({ _id: serverId })
      .populate({
        path: 'channels',
        options: { sort: { 'createdAt': 'asc' } }
      })
      .populate({
        path: 'members',
        populate: { path: 'profileId' }
      });

    if (!server) {
      return null;
    }


    const roleOrder: any = { 'ADMIN': 1, 'MODERATOR': 2, 'GUEST': 3 };
    server.members.sort((a: any, b: any) => roleOrder[a.role] - roleOrder[b.role]);

    const memberExists = server.members.some((member: any) => member.profileId._id.toString() === profileId);

    if (!memberExists) {
      return null;
    }
    else {
      return server.toObject({ transform: transformFunction });
    }
  } catch (error) {
    console.log("couldn't get the servers", error);
  }
}

interface UpdateInviteCodeProps {
  serverId: string;
  profileId: string;
}

export const upDateInviteCode = async ({
  serverId,
  profileId
}: UpdateInviteCodeProps) => {
  try {
    connectToDB();

    const server: ServerObject | null = await Server.findOneAndUpdate(
      { _id: serverId, profileId },
      { inviteCode: uuidv4() },
      { new: true }
    );

    return server;
  } catch (error) {
    console.log("couldn't update the invite code", error);
  }
}

interface InviteMemberProps {
  inviteCode: string;
  profileId: string;
}

export const inviteMember = async ({
  inviteCode,
  profileId
}: InviteMemberProps) => {
  try {
    connectToDB();

    const server = await Server.findOne({ inviteCode: inviteCode })
      .populate("members");

    const member = server.members.find((member: any) => member.profileId.toString() === profileId);

    if (member) {
      return server;
    }

    const newMember = new Member({
      profileId,
      serverId: server._id
    });

    await newMember.save();

    server.members.push(newMember._id);

    const updatedServer = await server.save();

    return updatedServer.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("couldn't add new member to the server", error);
  }
}

interface UpdateServerProps {
  serverId: string;
  profileId: string;
  name: string;
  imageUrl: string;
}

export const updateServer = async ({
  serverId,
  profileId,
  name,
  imageUrl
}: UpdateServerProps) => {
  try {
    connectToDB();

    const server = await Server.findOneAndUpdate(
      { _id: serverId, profileId },
      { name, imageUrl },
      { new: true }
    );

    return server.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("couldn't update the server", error);
  }
}