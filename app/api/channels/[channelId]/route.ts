import { NextResponse } from "next/server";

import { deleteChannel, editChannel, getChannel } from "@/lib/actions/channel.actions";
import { getProfile } from "@/lib/actions/profile.actions";
import { ChannelObject, ProfileObject, ServerObject } from "@/lib/object-types";

export async function GET(
  req: Request,
  { params }: { params: { channelId: string } }
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

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const channel: ChannelObject | null = await getChannel({
      channelId: params.channelId
    });

    if (channel?.serverId !== serverId) {
      return NextResponse.json(null);
    }

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile: ProfileObject | null = await getProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const channel: ChannelObject = await editChannel({
      profileId: profile._id,
      serverId,
      channelId: params.channelId,
      name,
      type
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("[CHANNEL_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
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

    if (!params.channelId) {
      return new NextResponse("Channel ID missing", { status: 400 });
    }

    const server: ServerObject = await deleteChannel({
      profileId: profile._id,
      serverId,
      channelId: params.channelId
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}