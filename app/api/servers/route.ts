import { NextResponse } from "next/server";

import { getProfile } from "@/lib/actions/profile.actions";
import { createServer } from "@/lib/actions/server.actions";
import { ProfileObject, ServerObject } from "@/lib/object-interface";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();

    const profile: ProfileObject | null = await getProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server: ServerObject = await createServer({ profileId: profile._id, name, imageUrl });
    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVERS_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}