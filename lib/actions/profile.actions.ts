import { auth } from "@clerk/nextjs";

import { connectToDB } from "@/lib/db";

import Profile from "@/lib/models/profile.model";
import { transformFunction } from "@/lib/mongoose.utils";


export const getProfile = async () => {
  try {
    connectToDB();

    const { userId } = auth();

    if (!userId) {
      return null;
    }

    const profile = await Profile.findOne({ userId });

    if(!profile){
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

    const profile = new Profile({
      userId,
      name: `${firstName} ${lastName}`,
      imageUrl,
      email
    });

    await profile.save();

    return profile.toObject({ transform: transformFunction });
  } catch (error: any) {
    console.log("failed to create Profile ", error.message);
  }
}