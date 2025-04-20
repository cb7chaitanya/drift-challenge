'use client';

import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';
import { useDriftStore } from '@/store/useDriftStore';
import { showErrorNotification, showInfoNotification } from '@/components/ui/notifications';
import { useWallet } from '@solana/wallet-adapter-react';

export const WalletSearch = () => {
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey } = useWallet();
  const { 
    client, 
    setSubaccounts, 
    setIsViewingOtherWallet,
    isViewingOtherWallet 
  } = useDriftStore();

  const handleSearch = async () => {
    if (!client || !address.trim()) return;
    setIsLoading(true);

    try {
      const pubkey = new PublicKey(address);
      const userAccounts = await client.getUserAccountsForAuthority(pubkey);
      
      if (userAccounts.length === 0) {
        showInfoNotification(
          'No accounts found',
          'This wallet has no Drift subaccounts'
        );
        return;
      }

      setSubaccounts(userAccounts);
      setIsViewingOtherWallet(true);
      showInfoNotification(
        'Accounts loaded',
        `Found ${userAccounts.length} subaccounts`
      );
    } catch (error) {
      console.error('Error searching for accounts:', error);
      showErrorNotification(
        'Invalid address',
        'Please enter a valid Solana address'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!client || !publicKey) return;
    setIsLoading(true);

    try {
      const userAccounts = await client.getUserAccountsForAuthority(publicKey);
      setSubaccounts(userAccounts);
      setIsViewingOtherWallet(false);
      setAddress('');
      showInfoNotification(
        'Reset view',
        'Showing your wallet accounts'
      );
    } catch (error) {
      console.error('Error resetting view:', error);
      showErrorNotification(
        'Reset failed',
        'Failed to load your accounts'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full">
      <div className="flex gap-2 w-full max-w-xl">
        <Input
          placeholder="Enter wallet address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500"
        />
        {isViewingOtherWallet ? (
          <Button
            onClick={handleReset}
            disabled={isLoading || !publicKey}
            variant="outline"
            className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
          >
            {isLoading ? (
              <span className="animate-pulse">Resetting...</span>
            ) : (
              <>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </>
            )}
          </Button>
        ) : (
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !address.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
          >
            {isLoading ? (
              <span className="animate-pulse">Searching...</span>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Search
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}; 