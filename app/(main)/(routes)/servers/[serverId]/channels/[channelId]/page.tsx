import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getProfile } from "@/lib/actions/profile.actions";
import { getChannel } from "@/lib/actions/channel.actions";
import { getMember } from "@/lib/actions/member.actions";
import { ChannelType } from "@/lib/models/channel.model";
import { ChannelObject, MemberObject, ProfileObject } from "@/lib/object-types";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  }
}

const ChannelIdPage = async ({
  params
}: ChannelIdPageProps) => {

  const profile: ProfileObject | null = await getProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const channel: ChannelObject | null = await getChannel({
    channelId: params.channelId
  });

  const member: MemberObject | null = await getMember({
    profileId: profile._id,
    serverId: params.serverId
  });

  if (!channel || !member) {
    redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={params.serverId}
        type="channel"
      />

      <ChatMessages
        member={member}
        name={channel.name}
        chatId={channel._id}
        type="channel"
        apiUrl="/api/messages"
        socketUrl="/api/socket/messages"
        socketQuery={{
          channelId: channel._id,
          serverId: channel.serverId as string,
        }}
        paramKey="channelId"
        paramValue={channel._id}
      />
      <ChatInput
        name={channel.name}
        type="channel"
        apiUrl="/api/socket/messages"
        query={{
          channelId: channel._id,
          serverId: channel.serverId
        }}
      />
    </div>
  );
}

export default ChannelIdPage;