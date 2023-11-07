import { NextResponse } from "next/server";

import { getProfile } from "@/lib/actions/profile.actions";
import { MessageObject } from "@/lib/object-types";
import { getMessages } from "@/lib/actions/message.actions";

const MESSAGES_BATCH = 10;

export async function GET(
  req: Request
) {
  try {
    const profile = await getProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const channelId = searchParams.get("channelId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  
    if (!channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    let messages: MessageObject[] | undefined = [];
    messages = await getMessages({
      cursor,
      channelId,
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
    console.log("[MESSAGES_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}