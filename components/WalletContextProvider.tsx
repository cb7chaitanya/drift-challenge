'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { FC, ReactNode, useMemo } from 'react';

import '@solana/wallet-adapter-react-ui/styles.css';

interface Props {
  children: ReactNode;
}

export const WalletContextProvider: FC<Props> = ({ children }) => {
  const RPC_KEY = process.env.NEXT_PUBLIC_HELIUS_RPC_KEY;
  const endpoint = useMemo(() => 
    `https://mainnet.helius-rpc.com/?api-key=${RPC_KEY}`, 
    [RPC_KEY]
  );
  
  const wallets = useMemo(
    () => [],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}; 