import { Doc } from "@/convex/_generated/dataModel";
import { create } from "zustand";

interface ClientStore {
  selectedClient: Doc<"clients"> | null;
  setSelectedClient: (client: Doc<"clients"> | null | null) => void;
  clearSelectedClient: () => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  selectedClient: null,
  setSelectedClient: (client) => set({ selectedClient: client }),
  clearSelectedClient: () => set({ selectedClient: null }),
}));
