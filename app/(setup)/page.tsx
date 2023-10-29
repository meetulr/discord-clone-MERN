import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";

import { getServer } from "@/lib/actions/server.actions";

const SetupPage = async () => {
  const profile = await initialProfile();

  const serverId = await getServer(profile.id);

  if (serverId) {
    return redirect(`/servers/${serverId}`);
  }

  return <InitialModal />;
};

export default SetupPage;
