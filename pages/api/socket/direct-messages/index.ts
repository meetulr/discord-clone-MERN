import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/lib/types";
import { getPagesProfile } from "@/lib/actions/profile.actions";
import { getConversation } from "@/lib/actions/conversation.actions";
import { ConversationObject, DirectMessageObject, MemberObject, ProfileObject } from "@/lib/object-types";
import { createDirectMessage } from "@/lib/actions/direct-message.actions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile: ProfileObject | null = await getPagesProfile(req);
    const { content, fileUrl } = req.body;
    const { conversationId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const conversation: ConversationObject | null = await getConversation({
      profileId: profile._id,
      conversationId: conversationId as string
    });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member = ((conversation.memberOneId as MemberObject).profileId as ProfileObject)._id === profile._id ? conversation.memberOneId : conversation.memberTwoId;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message: DirectMessageObject = await createDirectMessage({
      content,
      fileUrl,
      conversationId: conversationId as string,
      memberId: typeof member !== "string" ? member._id : ""
    })

    const channelKey = `chat:${conversationId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[DIRECT_MESSAGES_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}