'use client';

import { useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { DriftClient } from '@drift-labs/sdk';
import { useDriftStore } from '@/store/useDriftStore';
import { PublicKey } from '@solana/web3.js';
import { Transaction } from '@solana/web3.js';

export const DriftClientProvider = () => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, signAllTransactions } = useWallet();
  const { setClient, setSubaccounts } = useDriftStore();

  useEffect(() => {
    let subscribed = false;
    
    const initializeDriftClient = async () => {
      if (!connection) return;

      try {
        const driftClient = new DriftClient({
          connection,
          wallet: {
            publicKey: publicKey || new PublicKey('arbJEWqPDYfgTFf3CdACQpZrk56tB6z7hPFc6K9KLUi'),
            signTransaction: signTransaction || (async (tx) => tx as Transaction),
            signAllTransactions: signAllTransactions || (async (txs) => txs as Transaction[]),
          },
          programID: new PublicKey('dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'),
          env: 'mainnet-beta',
          opts: {
            commitment: 'confirmed',
            skipPreflight: true,
            preflightCommitment: 'confirmed',
          }
        });

        // Subscribe with retry logic
        let retries = 3;
        while (retries > 0 && !subscribed) {
          try {
            await driftClient.subscribe();
            subscribed = true;
            setClient(driftClient);
          } catch (error) {
            retries--;
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }

        // Only fetch accounts if we have a public key
        if (publicKey) {
          const userAccounts = await driftClient.getUserAccountsForAuthority(publicKey);
          setSubaccounts(userAccounts);
        }

      } catch (error) {
        console.error('Error initializing Drift client:', error);
      }
    };

    initializeDriftClient();

    return () => {
      if (subscribed) {
        useDriftStore.getState().client?.unsubscribe();
        subscribed = false;
      }
    };
  }, [connection, publicKey, signTransaction, signAllTransactions, setClient, setSubaccounts]);

  return null;
}; 