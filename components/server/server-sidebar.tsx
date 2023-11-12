import { MemberRole } from "@/lib/models/member.model";
import { ChannelType } from "@/lib/models/channel.model";

import { redirect } from "next/navigation";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

import { getProfile } from "@/lib/actions/profile.actions";
import { getCurrentServer } from "@/lib/actions/server.actions";

import { ChannelObject, MemberObject, ProfileObject, ServerObject } from "@/lib/object-types";

import { ServerHeader } from "@/components/server/server-header";
import { ServerSearch } from "@/components/server/server-search";
import { ServerContents } from "@/components/server/server-contents";

const iconMap = {
  [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />
}

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

  const server: ServerObject | null = await getCurrentServer(serverId, profile._id);

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

      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel._id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel._id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel._id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member._id,
                  name: typeof member.profileId !== "string" ? member.profileId.name : "",
                  icon: roleIconMap[member.role],
                }))
              },
            ]}
          />
        </div>

        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

        <ServerContents
          profileId={profile._id}
          currServer={server}
        />
      </ScrollArea>
    </div>
  );
}