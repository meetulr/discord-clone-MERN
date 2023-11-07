import { NextApiRequest } from "next";

import { NextApiResponseServerIo } from "@/lib/types";

import { getPagesProfile } from "@/lib/actions/profile.actions";
import { getCurrentServer } from "@/lib/actions/server.actions";
import { getChannel } from "@/lib/actions/channel.actions";
import { createMessage } from "@/lib/actions/message.actions";

import { ChannelObject, MessageObject, ProfileObject, ServerObject } from "@/lib/object-types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const profile: ProfileObject | null = await getPagesProfile(req);

    const { content, fileUrl } = req.body;
    const { serverId, channelId } = req.query;

    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID missing" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const server: ServerObject | null = await getCurrentServer(serverId as string, profile._id);

    if (!server) {
      return res.status(404).json({ message: "Server not found" });
    }

    const channel: ChannelObject | null = await getChannel({ channelId } as { channelId: string });

    if (!channel || channel.serverId !== serverId) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const member = server.members.find((member) => typeof member !== "string" && typeof member.profileId !== "string" && member.profileId._id === profile._id);

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message: MessageObject = await createMessage({
      content,
      fileUrl,
      channelId: channelId as string,
      memberId: typeof member !== "string" ? member._id : ""
    })

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[Messages_POST]", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}