import { getProfile } from "@/lib/actions/profile.actions";
import { createChannel } from "@/lib/actions/channel.actions";
import { ChannelObject } from "@/lib/object-types";
import { NextResponse } from "next/server";


export async function POST(
  req: Request
) {
  try {
    const profile = await getProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    const channel: ChannelObject = await createChannel({
      profileId: profile._id,
      serverId,
      name,
      type
    });

    return NextResponse.json(channel);
  } catch (error) {
    console.log("CHANNELS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}