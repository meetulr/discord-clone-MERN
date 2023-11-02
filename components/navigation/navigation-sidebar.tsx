import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { getProfile } from "@/lib/actions/profile.actions";
import { getServers } from "@/lib/actions/server.actions";

import { NavigationAction } from "@/components/navigation/navigation-action";
import { NavigationItem } from "@/components/navigation/navigation-item";
import { ProfileObject, ServerObject } from "@/lib/object-types";

export const NavigationSidebar = async () => {
  const profile: ProfileObject | null = await getProfile();

  if (!profile) {
    return redirect("/");
  }

  const servers: ServerObject[] | undefined | null = await getServers(profile._id);

  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
      <NavigationAction />
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />

      <ScrollArea className="flex-1 w-full">
        {servers && servers.map((server) => (
          <div key={server._id} className="mb-4">
            <NavigationItem
              id={server._id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>

      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: "h-[38px] w-[38px]",
            },
          }}
        />
      </div>
    </div>
  );
};