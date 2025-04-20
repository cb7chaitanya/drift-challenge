import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export const WalletConnection = () => {

  return (
    <div className="flex items-center justify-end p-4">
      <WalletMultiButton />
    </div>
  );
}; 