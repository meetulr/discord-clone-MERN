import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getProfile } from "@/lib/actions/profile.actions";
import { ConversationObject, MemberObject, ProfileObject } from "@/lib/object-types";
import { getConvoMember, getMember } from "@/lib/actions/member.actions";
import { getOrCreateConversation } from "@/lib/actions/conversation.actions";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  },
  searchParams: {
    video?: boolean;
  }
}

const MemberPage = async ({
  params,
  searchParams
}: MemberIdPageProps) => {

  const profile: ProfileObject | null = await getProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember: MemberObject | null = await getMember({
    profileId: profile._id,
    serverId: params.serverId
  })

  if (!currentMember) {
    return redirect("/");
  }

  const convoMember: MemberObject | null = await getConvoMember({
    memberId: params.memberId,
    serverId: params.serverId
  })

  if (!convoMember) {
    return redirect(`/servers/${params.serverId}`);
  }

  const conversation: ConversationObject | null = await getOrCreateConversation(currentMember._id, params.memberId);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOneId, memberTwoId } = conversation;

  const otherMember = ((((memberOneId as MemberObject).profileId as ProfileObject))._id === profile._id ? memberTwoId : memberOneId) as MemberObject;

  if (otherMember.deleted) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={(otherMember.profileId as ProfileObject).imageUrl}
        name={(otherMember.profileId as ProfileObject).name}
        serverId={params.serverId}
        type="conversation"
      />

      {searchParams.video && (
        <MediaRoom
          chatId={conversation._id}
          video={true}
          audio={true}
        />
      )}

      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={(otherMember.profileId as ProfileObject).name}
            chatId={conversation._id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation._id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation._id,
            }}
            currContent={conversation}
          />
          <ChatInput
            name={(otherMember.profileId as ProfileObject).name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation._id,
            }}
          />
        </>
      )}
    </div>
  );
}

export default MemberPage;