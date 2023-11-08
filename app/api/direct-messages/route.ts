import { NextResponse } from "next/server";

import { getProfile } from "@/lib/actions/profile.actions";
import { DirectMessageObject } from "@/lib/object-types";
import { getDirectMessages } from "@/lib/actions/direct-message.actions";

const MESSAGES_BATCH = 10;

export async function GET(
  req: Request
) {
  try {
    const profile = await getProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    if (!conversationId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    let messages: DirectMessageObject[] | undefined = [];
    messages = await getDirectMessages({
      cursor,
      conversationId,
      messagesBatch: MESSAGES_BATCH
    });

    let nextCursor = null;

    if (messages?.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1]._id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor
    });
  } catch (error) {
    console.log("[Direct_MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}