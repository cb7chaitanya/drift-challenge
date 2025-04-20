'use client';

import { toast } from "sonner";
import { ExternalLink, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

interface NotificationProps {
  txid: string;
  type: 'deposit' | 'withdraw' | 'order';
  amount: string;
  symbol?: string;
}

export const showTransactionNotification = ({ txid, type, amount, symbol = 'USDC' }: NotificationProps) => {
  const solscanUrl = `https://solscan.io/tx/${txid}`;

  toast.success(
    `${type === 'deposit' ? 'Deposit' : type === 'withdraw' ? 'Withdraw' : 'Order'} Successful`,
    {
      description: (
        <div className="flex flex-col gap-2">
          <p>Successfully {type === 'deposit' ? 'deposited' : type === 'withdraw' ? 'withdrew' : 'placed'} {amount} {symbol}</p>
          <a 
            href={solscanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            View on Solscan
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      ),
      icon: <CheckCircle2 className="text-green-500" />,
      duration: 5000,
    }
  );
};

export const showErrorNotification = (message: string, description: string) => {
  toast.error(message, {
    description,
    icon: <XCircle className="text-red-500" />,
    duration: 5000,
  });
};

export const showInfoNotification = (message: string, description: string) => {
  toast.info(message, {
    description,
    icon: <AlertCircle className="text-blue-500" />,
    duration: 5000,
  });
}; 