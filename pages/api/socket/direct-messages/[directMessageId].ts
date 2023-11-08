import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/lib/types";
import { getPagesProfile } from "@/lib/actions/profile.actions";
import { ConversationObject, DirectMessageObject, MemberObject, ProfileObject } from "@/lib/object-types";
import { getConversation } from "@/lib/actions/conversation.actions";
import { getDirectMessage, updateDirectMessage } from "@/lib/actions/direct-message.actions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile: ProfileObject | null = await getPagesProfile(req);
    const { directMessageId, conversationId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "ConversationId ID missing" });
    }

    const conversation: ConversationObject | null = await getConversation({
      profileId: profile._id,
      conversationId: conversationId as string
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    const member = ((conversation.memberOneId as MemberObject).profileId as ProfileObject)._id === profile._id ? conversation.memberOneId : conversation.memberTwoId;

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message: DirectMessageObject | null = await getDirectMessage({
      directMessageId: directMessageId as string,
      conversationId: conversationId as string
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = (message.memberId as MemberObject)._id === (member as MemberObject)._id;
    const isAdmin = (member as MemberObject).role === "ADMIN";
    const isModerator = (member as MemberObject).role === "MODERATOR";
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.method === "DELETE") {
      message = await updateDirectMessage({
        directMessageId: directMessageId as string,
        content: "This message has been deleted",
        deleteMsg: true,
        updateMsg: false
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      message = await updateDirectMessage({
        directMessageId: directMessageId as string,
        content: content as string,
        deleteMsg: false,
        updateMsg: true
      })
    }

    const updateKey = `chat:${conversationId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}