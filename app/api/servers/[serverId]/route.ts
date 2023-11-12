import { NextResponse } from "next/server";

import { getProfile } from "@/lib/actions/profile.actions";
import { deleteServer, getCurrentServer, updateServer } from "@/lib/actions/server.actions";
import { ProfileObject, ServerObject } from "@/lib/object-types";

export async function GET(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile: ProfileObject | null = await getProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("No serverId", { status: 404 });
    }

    const server: ServerObject = await getCurrentServer(params.serverId, profile._id);

    return NextResponse.json( server );
  } catch (error) {
    console.log("[SERVER_ID_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile: ProfileObject | null = await getProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server: ServerObject = await updateServer({
      serverId: params.serverId,
      profileId: profile._id,
      name,
      imageUrl
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await getProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await deleteServer({
      profileId: profile._id,
      serverId: params.serverId
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}