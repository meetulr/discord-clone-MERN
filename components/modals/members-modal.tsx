"use client";

import axios from "axios";
import qs from "query-string";

import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { useModal } from "@/hooks/use-modal-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import { MemberObject } from "@/lib/object-types";

import { useState } from "react";
import { useRouter } from "next/navigation";

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500" />
}


export const MembersModal = () => {
  const router = useRouter();

  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data;

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?._id,
        },
      });

      const response = await axios.delete(url);

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  }

  const onRoleChange = async (memberId: string, role: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?._id,
        }
      });

      const response = await axios.patch(url, { role });

      console.log(response.data);

      router.refresh();
      onOpen("members", { server: response.data });
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId("");
    }
  }

  const handleClose = () => {
    onClose();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription
            className="text-center text-zinc-500"
          >
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => {
            if (typeof member === 'string' || typeof member.profileId === 'string') {
              return null;
            }

            return (
              <div key={member._id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profileId.imageUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center gap-x-1">
                    {member.profileId.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-xs text-zinc-500">
                    {member.profileId.email}
                  </p>
                </div>
                {server.profileId !== member.profileId._id && loadingId !== member._id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="h-4 w-4 text-zinc-500" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger
                            className="flex items-center"
                          >
                            <ShieldQuestion
                              className="w-4 h-4 mr-2"
                            />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => member.role !== "GUEST" && onRoleChange(member._id, "GUEST")}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check
                                    className="h-4 w-4 ml-auto"
                                  />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => member.role !== "MODERATOR" && onRoleChange(member._id, "MODERATOR")}
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check
                                    className="h-4 w-4 ml-auto"
                                  />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                        onClick={() => onKick(member._id)}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                {loadingId === member._id && (
                  <Loader2
                    className="animate-spin text-zinc-500 ml-auto w-4 h-4"
                  />
                )}
              </div>
            )
          })}
        </ScrollArea>
        <div className="p-6">
          Hello Members
        </div>
      </DialogContent>
    </Dialog>
  );
};

