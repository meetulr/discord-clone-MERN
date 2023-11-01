import { NextResponse } from "next/server";

import { getProfile } from "@/lib/actions/profile.actions";
import { upDateInviteCode } from "@/lib/actions/server.actions";

import { ProfileObject, ServerObject } from "@/lib/object-types";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile: ProfileObject | null = await getProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID Missing", { status: 400 });
    }

    const server: ServerObject | null | undefined = await upDateInviteCode({ serverId: params.serverId, profileId: profile._id });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}