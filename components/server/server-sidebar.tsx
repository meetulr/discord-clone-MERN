import { ChannelType } from "@/lib/models/channel.model";

import { getProfile } from "@/lib/actions/profile.actions";
import { getCurrentServer } from "@/lib/actions/server.actions";

import { ChannelObject, MemberObject, ProfileObject, ServerObject } from "@/lib/object-types";

import { ServerHeader } from "@/components/server/server-header";

import { redirect } from "next/navigation";

interface ServerSidebarProps {
  serverId: string;
}

export const ServerSidebar = async ({
  serverId
}: ServerSidebarProps) => {

  const profile: ProfileObject | null = await getProfile();

  if (!profile) {
    return redirect("/");
  }

  let server: ServerObject | null = await getCurrentServer(serverId, profile._id);

  if (!server) {
    return redirect("/");
  }

  const textChannels = server.channels.filter((channel): channel is ChannelObject => typeof channel !== 'string' && channel.type === ChannelType.TEXT)
  const audioChannels = server.channels.filter((channel): channel is ChannelObject => typeof channel !== 'string' && channel.type === ChannelType.AUDIO)
  const videoChannels = server.channels.filter((channel): channel is ChannelObject => typeof channel !== 'string' && channel.type === ChannelType.VIDEO)

  const members = server.members.filter((member): member is MemberObject => typeof member !== "string" && typeof member.profileId !== "string" && member.profileId?._id !== profile._id)
  const role = server.members.find((member): member is MemberObject => typeof member !== "string" && typeof member.profileId !== "string" && member.profileId._id === profile._id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader
        server={server}
        role={role}
      />
    </div>
  );
}