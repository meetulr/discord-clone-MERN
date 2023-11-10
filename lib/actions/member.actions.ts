import { connectToDB } from "@/lib/db";
import Member from "@/lib/models/member.model";
import Server from "@/lib/models/server.model";
import { transformFunction } from "@/lib/mongoose.utils";
import Conversation from "@/lib/models/conversation.model";
import DirectMessage from "@/lib/models/directMessage.model";

interface GetMemberProps {
  profileId: string;
  serverId: string;
}

export const getMember = async ({
  profileId,
  serverId
}: GetMemberProps) => {
  try {
    connectToDB();

    const member = await Member.findOne({ serverId, profileId, deleted: false })
      .populate("profileId");

    if (!member) {
      return null;
    }

    return member.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("couldn't find the member", error);
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

interface UpdateMemberRoleProps {
  profileId: string;
  serverId: string;
  memberId: string;
  role: string;
}

export const updateMemberRole = async ({
  profileId,
  serverId,
  memberId,
  role
}: UpdateMemberRoleProps) => {
  try {
    connectToDB();

    let server = await Server.findOne({ _id: serverId, profileId: profileId })
      .populate({
        path: 'members',
      });

    const member = server.members.find((member: any) => member._id.toString() === memberId);

    if (member) {
      member.role = role;
      await server.save();
    }

    await Member.updateOne({ _id: memberId }, { role });

    server = await Server.findOne({ _id: serverId, profileId })
      .populate({
        path: 'members',
        populate: { path: 'profileId' }
      });

    return server.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("couldn't update the member role", error);
  }
}

interface KickMemberProps {
  profileId: string;
  serverId: string;
  memberId: string;
}

export const kickMember = async ({
  profileId,
  serverId,
  memberId,
}: KickMemberProps) => {
  try {
    connectToDB();

    let server = await Server.findOne({ _id: serverId, profileId: profileId })
      .populate({
        path: 'members',
      });

    server.members = server.members.filter((member: any) => member._id.toString() !== memberId);
    await server.save();

    await Member.updateOne(
      { _id: memberId },
      { deleted: true }
    );

    const conversations = await Conversation.find({
      $or: [
        { memberOneId: memberId },
        { memberTwoId: memberId }
      ]
    });

    const conversationIds = conversations.map(conversation => conversation._id);

    await DirectMessage.deleteMany({ conversationId: { $in: conversationIds } });

    await Conversation.deleteMany({ _id: { $in: conversationIds } });

    server = await Server.findOne({ _id: serverId, profileId })
      .populate({
        path: 'members',
        populate: { path: 'profileId' }
      });

    return server.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("couldn't update the member role", error);
  }
}
