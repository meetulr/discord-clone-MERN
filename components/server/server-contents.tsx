"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { ServerSection } from "@/components/server/server-section";
import { ServerChannel } from "@/components/server/server-channel";
import { ServerMember } from "@/components/server/server-member";

import { useServerQuery } from "@/hooks/use-server-query";

import { ChannelObject, MemberObject, ServerObject } from "@/lib/object-types";

interface ServerContentsProps {
  profileId: string;
  currServer: ServerObject;
}

export const ServerContents = ({
  profileId,
  currServer
}: ServerContentsProps) => {

  const router = useRouter();

  const { fetchedServer } = useServerQuery({
    currServer
  })

  const server: ServerObject = fetchedServer;
  const currServerOwnerId = currServer.profileId;

  const currMember = server?.members?.some((member): member is MemberObject => typeof member !== "string" && typeof member.profileId !== "string" && member.profileId?._id === profileId)
  const serverId = server?._id;
  const updatedAt = server?.updatedAt;

  useEffect(() => {
    if (profileId !== currServerOwnerId) {
      if (!serverId || !currMember) {
        router.push("/");
      }
      else {
        router.refresh();
      }
    }

  }, [serverId, currMember, updatedAt])

  const textChannels = server?.channels.filter((channel): channel is ChannelObject => typeof channel !== 'string' && channel.type === "TEXT")
  const audioChannels = server?.channels.filter((channel): channel is ChannelObject => typeof channel !== 'string' && channel.type === "AUDIO")
  const videoChannels = server?.channels.filter((channel): channel is ChannelObject => typeof channel !== 'string' && channel.type === "VIDEO")

  const members = server?.members.filter((member): member is MemberObject => typeof member !== "string" && typeof member.profileId !== "string" && member.profileId?._id !== profileId)
  const role = server?.members.find((member): member is MemberObject => typeof member !== "string" && typeof member.profileId !== "string" && member.profileId._id === profileId)?.role;

  return (
    <>
      {!!textChannels?.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType="TEXT"
            role={role}
            label="Text Channels"
          />
          <div className="space-y-[2px]">
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel._id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        </div>
      )}
      {!!audioChannels?.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType="AUDIO"
            role={role}
            label="Voice Channels"
          />
          <div className="space-y-[2px]">
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel._id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        </div>
      )}
      {!!videoChannels?.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="channels"
            channelType="VIDEO"
            role={role}
            label="Video Channels"
          />
          <div className="space-y-[2px]">
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel._id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        </div>
      )}
      {!!members?.length && (
        <div className="mb-2">
          <ServerSection
            sectionType="members"
            role={role}
            label="Members"
            server={server}
          />
          <div className="space-y-[2px]">
            {members.map((member) => (
              <ServerMember
                key={member._id}
                member={member}
                server={server}
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}