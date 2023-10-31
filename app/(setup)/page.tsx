import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { getServer } from "@/lib/actions/server.actions";
import { ProfileObject } from "@/lib/object-interface";

import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
  const profile: ProfileObject = await initialProfile();

  const serverId: string | null = await getServer(profile._id);

  if (serverId) {
    return redirect(`/servers/${serverId}`);
  }

  return <InitialModal />;
};

export default SetupPage;
