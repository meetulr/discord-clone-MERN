import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/lib/types";
import { getPagesProfile } from "@/lib/actions/profile.actions";
import { getCurrentServer } from "@/lib/actions/server.actions";
import { Stringifiable } from "query-string";
import { getChannel } from "@/lib/actions/channel.actions";
import { ChannelObject, MemberObject, MessageObject, ProfileObject, ServerObject } from "@/lib/object-types";
import { getMessage, updateMessage } from "@/lib/actions/message.actions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo,
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile: ProfileObject | null = await getPagesProfile(req);
    const { messageId, serverId, channelId } = req.query;
    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    const profileId = profile._id;

    const server: ServerObject | null = await getCurrentServer(
      (serverId as string),
      profileId
    );

    if (!server) {
      return res.status(404).json({ error: "Server not found" });
    }

    const channel: ChannelObject | null = await getChannel({ channelId: channelId as string });

    if (!channel || channel.serverId !== serverId) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const member = server.members.find((member) => typeof member !== "string" && typeof member.profileId !== "string" && member.profileId._id === profile._id);

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    let message: MessageObject | null = await getMessage({
      messageId: messageId as string,
      channelId: channelId as string
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
      message = await updateMessage({
        messageId: messageId as string,
        deleteMsg: true
      });
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      console.log("here");

      message = await updateMessage({
        messageId: messageId as string,
        content: content as string,
        updateMsg: true
      })
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGE_ID]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}