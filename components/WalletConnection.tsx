import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnection = () => {
  const { connected } = useWallet();

  return (
    <div className="flex items-center justify-end p-4">
      <WalletMultiButton />
    </div>
  );
}; 