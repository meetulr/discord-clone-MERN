import { NextResponse } from "next/server";

import { getProfile } from "@/lib/actions/profile.actions";
import { ConversationObject, ProfileObject } from "@/lib/object-types";
import { getConversation } from "@/lib/actions/conversation.actions";

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const profile: ProfileObject | null = await getProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.conversationId) {
      return new NextResponse("Conversation ID missing", { status: 400 });
    }

    const conversation: ConversationObject | null = await getConversation({
      profileId: profile._id,
      conversationId: params.conversationId
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.log("[CONVERSATION_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
