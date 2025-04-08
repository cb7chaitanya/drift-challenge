'use client';

import { useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { DriftClient, initialize } from '@drift-labs/sdk';
import { useDriftStore } from '@/store/useDriftStore';

export const DriftClientProvider = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const { setClient, setSubaccounts } = useDriftStore();

  useEffect(() => {
    const initializeDriftClient = async () => {
      if (!publicKey || !connection) return;

      try {
        const driftClient = new DriftClient({
          connection,
          wallet: {
            publicKey,
            signTransaction: async (tx) => tx,
            signAllTransactions: async (txs) => txs,
          },
          env: 'devnet', // or 'mainnet-beta' based on your needs
        });

        await driftClient.subscribe();
        setClient(driftClient);
``
        // Fetch subaccounts
        const userAccount = await driftClient.getUserAccount();
        if (userAccount) {
          setSubaccounts([userAccount]);
        }
      } catch (error) {
        console.error('Error initializing Drift client:', error);
      }
    };

    initializeDriftClient();

    return () => {
      // Cleanup
      useDriftStore.getState().client?.unsubscribe();
    };
  }, [connection, publicKey, setClient, setSubaccounts]);

  return null;
}; 