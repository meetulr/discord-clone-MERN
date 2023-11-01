import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { getProfile } from "@/lib/actions/profile.actions";
import { getCurrentServer } from "@/lib/actions/server.actions";

import { ServerSidebar } from "@/components/server/server-sidebar";
import { ProfileObject, ServerObject } from "@/lib/object-types";

const ServerIdLayout = async ({
  children,
  params
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile: ProfileObject | null = await getProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server: ServerObject | null = await getCurrentServer(params.serverId, profile._id);

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="h-full">
      <div
        className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
}

export default ServerIdLayout;