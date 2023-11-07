import { ChannelObject, ServerObject } from "@/lib/object-types";
import { create } from "zustand";

export type ModalType = "createServer" | "invite" | "editServer"
  | "members" | "createChannel" | "leaveServer" | "deleteServer"
  | "editChannel" | "deleteChannel" | "messageFile" | "deleteMessage";

interface ModalData {
  server?: ServerObject;
  channel?: ChannelObject;
  channelType?: "TEXT" | "AUDIO" | "VIDEO";
  apiUrl?: string;
  query?: Record<string, any>;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false })
}));