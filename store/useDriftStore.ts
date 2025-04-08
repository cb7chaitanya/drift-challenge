import { create } from 'zustand';
import { DriftClient, UserAccount, PerpPosition } from '@drift-labs/sdk';

interface DriftStore {
  client: DriftClient | null;
  subaccounts: UserAccount[];
  positions: PerpPosition[];
  setClient: (client: DriftClient) => void;
  setSubaccounts: (subaccounts: UserAccount[]) => void;
  setPositions: (positions: PerpPosition[]) => void;
}

export const useDriftStore = create<DriftStore>((set) => ({
  client: null,
  subaccounts: [],
  positions: [],
  setClient: (client) => set({ client }),
  setSubaccounts: (subaccounts) => set({ subaccounts }),
  setPositions: (positions) => set({ positions }),
})); 