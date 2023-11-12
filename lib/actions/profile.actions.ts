import { NextApiRequest } from "next";
import { auth } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";

import { connectToDB } from "@/lib/db";

import Profile from "@/lib/models/profile.model";
import Server from "@/lib/models/server.model";
import { transformFunction } from "@/lib/mongoose.utils";
import { deleteServer } from "@/lib/actions/server.actions";
import Member from "../models/member.model";
import Conversation from "../models/conversation.model";
import DirectMessage from "../models/directMessage.model";


export const getProfile = async () => {
  try {
    connectToDB();

    const { userId } = auth();

    if (!userId) {
      return null;
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return null;
    }

    return profile.toObject({ transform: transformFunction });
  } catch (error: any) {
    console.log("failed to get profile", error.message);
  }
}

export const getPagesProfile = async (req: NextApiRequest) => {
  try {
    connectToDB();

    const { userId } = getAuth(req);

    if (!userId) {
      return null;
    }

    const profile = await Profile.findOne({ userId });

    if (!profile) {
      return null;
    }

    return profile.toObject({ transform: transformFunction });
  } catch (error: any) {
    console.log("failed to get profile", error.message);
  }
}

interface ProfileProps {
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
}

export const createProfile = async ({
  userId,
  firstName,
  lastName,
  imageUrl,
  email
}: ProfileProps) => {
  try {
    connectToDB();

    let profile = await getProfile();

    if (!profile) {
      profile = new Profile({
        userId,
        name: `${firstName} ${lastName}`,
        imageUrl,
        email
      });

      await profile.save();
    }

    return profile.toObject({ transform: transformFunction });
  } catch (error: any) {
    console.log("failed to create Profile ", error.message);
  }
}

export const deleteProfile = async (userId: string) => {
  try {
    connectToDB();

    const profile = await Profile.findOne({ userId });

    const servers = await Server.find({ profileId: profile._id });

    for (const server of servers) {
      await deleteServer({
        profileId: profile._id,
        // @ts-ignore
        serverId: server._id
      });
    }

    const members = await Member.find({ profileId: profile._id });

    const memberIds = members.map(member => member._id);

    await Server.updateMany(
      {},
      { $pull: { members: { $in: memberIds } } }
    );

    const conversations = await Conversation.find({
      $or: [
        { memberOneId: { $in: memberIds } },
        { memberTwoId: { $in: memberIds } }
      ]
    });

    const conversationIds = conversations.map(conversation => conversation._id);

    await DirectMessage.deleteMany({ conversationId: { $in: conversationIds } });

    await Conversation.deleteMany({ _id: { $in: conversationIds } });

    await Member.updateMany({ _id: { $in: memberIds } }, { deleted: true });

    return profile.toObject({ transform: transformFunction });
  } catch (error) {
    console.log("couldn't delete the profile", error);
  }
}