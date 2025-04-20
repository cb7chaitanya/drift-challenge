'use client';

import { useState } from 'react';
import { BN } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { useDriftStore } from '@/store/useDriftStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { showTransactionNotification } from "@/components/ui/notifications";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
  subaccountId: number;
}

export const TransactionModal = ({ isOpen, onClose, type, subaccountId }: TransactionModalProps) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { client } = useDriftStore();

  const handleTransaction = async () => {
    if (!client || !amount) return;
    setIsLoading(true);
    setError(null);

    try {
      const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
      const tokenAccount = await getAssociatedTokenAddress(usdcMint, client.wallet.publicKey);

      // Create and sign transaction
      const tx = type === 'deposit' 
        ? await client.createDepositTxn(
            new BN(Number(amount) * 1e6),
            0,
            tokenAccount,
            subaccountId,
            false,
          )
        : await client.buildTransaction(
            await client.getWithdrawalIxs(
              new BN(Number(amount) * 1e6),
              0,
              tokenAccount,
              false,
              subaccountId,
            )
          );

      // Send and confirm transaction
      const { txSig } = await client.sendTransaction(tx, [], {
        skipPreflight: true,
        commitment: 'confirmed',
      });

      const latestBlockhash = await client.connection.getLatestBlockhash();
      await client.connection.confirmTransaction({
        signature: txSig,
        ...latestBlockhash
      }, 'confirmed');

      // Add notification
      showTransactionNotification({
        txid: txSig,
        type,
        amount,
      });

      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="w-full max-w-md bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {type === 'deposit' ? 'Deposit USDC' : 'Withdraw USDC'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Enter the amount you want to {type === 'deposit' ? 'deposit into' : 'withdraw from'} your subaccount
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={isLoading}
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleTransaction}
            disabled={isLoading || !amount}
            className={`${
              type === 'deposit' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-600 hover:bg-red-700'
            } text-white`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              type === 'deposit' ? 'Deposit' : 'Withdraw'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 