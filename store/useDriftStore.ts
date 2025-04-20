import { create } from 'zustand';
import { DriftClient, UserAccount } from '@drift-labs/sdk';

interface DriftStore {
  client: DriftClient | null;
  subaccounts: UserAccount[];
  isViewingOtherWallet: boolean;
  setClient: (client: DriftClient | null) => void;
  setSubaccounts: (subaccounts: UserAccount[]) => void;
  setIsViewingOtherWallet: (isViewing: boolean) => void;
}

export const useDriftStore = create<DriftStore>((set) => ({
  client: null,
  subaccounts: [],
  isViewingOtherWallet: false,
  setClient: (client) => set({ client }),
  setSubaccounts: (subaccounts) => {
    set({ subaccounts });
  },
  setIsViewingOtherWallet: (isViewing) => set({ isViewingOtherWallet: isViewing }),
})); 