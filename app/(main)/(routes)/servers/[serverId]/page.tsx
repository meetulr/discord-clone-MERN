import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getProfile } from "@/lib/actions/profile.actions";
import { ChannelObject, ProfileObject } from "@/lib/object-types";
import { getGeneralChannel } from "@/lib/actions/channel.actions";

interface ServerIdPageProps {
  params: {
    serverId: string;
  }
};

const ServerIdPage = async ({
  params
}: ServerIdPageProps) => {

  const profile: ProfileObject | null = await getProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel: ChannelObject = await getGeneralChannel({
    profileId: profile._id,
    serverId: params.serverId
  });

  if (channel?.name !== "general") {
    return null;
  }

  return redirect(`/servers/${params.serverId}/channels/${channel?._id}`)
}

export default ServerIdPage;