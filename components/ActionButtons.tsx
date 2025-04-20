'use client';

import { Button } from '@/components/ui/button';
import { ArrowDownToLine, ArrowUpFromLine, LineChart, Timer } from 'lucide-react';

interface ActionButtonsProps {
  setModalConfig: (config: {
    isOpen: boolean;
    type: 'deposit' | 'withdraw' | 'market' | 'limit';
  }) => void;
}

export const ActionButtons = ({ setModalConfig }: ActionButtonsProps) => {
  return (
    <div className="flex flex-wrap gap-2 my-4">
      <Button
        onClick={() => setModalConfig({ isOpen: true, type: 'deposit' })}
        className="bg-green-600 hover:bg-green-700"
      >
        <ArrowDownToLine className="w-4 h-4 mr-2" />
        Deposit
      </Button>
      <Button
        onClick={() => setModalConfig({ isOpen: true, type: 'withdraw' })}
        className="bg-red-600 hover:bg-red-700"
      >
        <ArrowUpFromLine className="w-4 h-4 mr-2" />
        Withdraw
      </Button>
      <Button
        onClick={() => setModalConfig({ isOpen: true, type: 'market' })}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <LineChart className="w-4 h-4 mr-2" />
        Market
      </Button>
      <Button
        onClick={() => setModalConfig({ isOpen: true, type: 'limit' })}
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Timer className="w-4 h-4 mr-2" />
        Limit
      </Button>
    </div>
  );
}; 