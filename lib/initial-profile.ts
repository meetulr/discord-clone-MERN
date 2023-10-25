import { currentUser, redirectToSignIn } from "@clerk/nextjs";

import getOrCreateProfile from "@/lib/actions/profile.actions";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await getOrCreateProfile({
    userId: user.id,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    imageUrl: user.imageUrl,
    email: user.emailAddresses[0].emailAddress
  });

  return profile;
};