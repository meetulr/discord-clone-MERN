import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getProfile } from "@/lib/actions/profile.actions";
import { MemberObject, ProfileObject } from "@/lib/object-types";
import { getMember } from "@/lib/actions/member.actions";
import { getOrCreateConversation } from "@/lib/conversation";
import { ChatHeader } from "@/components/chat/chat-header";

interface MemberIdPageProps {
  params: {
    memberId: string;
    serverId: string;
  }
}

const MemberPage = async ({
  params
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

  const conversation = await getOrCreateConversation(currentMember._id, params.memberId);

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOneId, memberTwoId } = conversation;

  const otherMember = memberOneId.profileId._id === profile._id ? memberTwoId : memberOneId;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader 
        imageUrl={otherMember.profileId.imageUrl}
        name={otherMember.profileId.name}
        serverId={params.serverId}
        type="conversation"
      />
    </div>
  );
}

export default MemberPage;