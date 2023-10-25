import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";

import Profile from "@/lib/models/profile.model";

import { connectToDB } from "@/lib/db";

interface profileProps {
  userId: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
}

async function getOrCreateProfile({ userId, firstName, lastName, imageUrl, email }: profileProps) {
  try {
    connectToDB();

    let profile = await Profile.findOne({ userId });

    if (profile) {
      return profile;
    }

    profile = new Profile({
      userId,
      name: `${firstName} ${lastName}`,
      imageUrl,
      email
    });

    await profile.save();

    return profile;
  } catch (error: any) {
    console.log("failed to get or create Profile ", error.message);
  }
}

export default getOrCreateProfile;
