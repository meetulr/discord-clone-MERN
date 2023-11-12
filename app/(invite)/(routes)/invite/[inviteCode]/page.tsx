import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getProfile } from "@/lib/actions/profile.actions";
import { ProfileObject, ServerObject } from "@/lib/object-types";
import { inviteMember } from "@/lib/actions/member.actions";
import { initialProfile } from "@/lib/initial-profile";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
};

const InviteCodePage = async ({
  params
}: InviteCodePageProps) => {
  const profile: ProfileObject | null = await initialProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const server: ServerObject = await inviteMember({ inviteCode: params.inviteCode, profileId: profile._id });

  if (server) {
    return redirect(`/servers/${server._id}`);
  }

  return null;
}

export default InviteCodePage;