import { NextResponse } from "next/server";

import { getProfile } from "@/lib/actions/profile.actions";
import { kickMember, updateMemberRole } from "@/lib/actions/member.actions";
import { ProfileObject, ServerObject } from "@/lib/object-types";

export async function PATCH(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile: ProfileObject | null = await getProfile();

    const { searchParams } = new URL(req.url);
    const { role } = await req.json();

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    if (profile._id === params.memberId) {
      return new NextResponse("Can't change Admin's role", { status: 400 });
    }

    const server: ServerObject = await updateMemberRole({
      profileId: profile._id,
      serverId,
      memberId: params.memberId,
      role
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBERS_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const profile = await getProfile();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get("serverId");

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    if (!params.memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }

    if (profile._id === params.memberId) {
      return new NextResponse("Can't kick the Admin", { status: 400 });
    }

    const server: ServerObject = await kickMember({
      profileId: profile._id,
      serverId,
      memberId: params.memberId
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}