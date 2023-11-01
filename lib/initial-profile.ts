import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import { getProfile, createProfile } from "@/lib/actions/profile.actions";
import { ProfileObject } from "./object-types";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile: ProfileObject | null = await getProfile();

  if (profile) {
    return profile;
  }

  const newProfile: ProfileObject = await createProfile({
    userId: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0].emailAddress
  });

  return newProfile;
};