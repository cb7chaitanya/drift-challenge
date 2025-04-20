'use client';

import { Wallet, LineChart } from 'lucide-react';

interface CardHeaderProps {
  name: string;
  subaccountId: number;
  isMarginTradingEnabled: boolean;
  activeTab: 'balances' | 'positions';
  setActiveTab: (tab: 'balances' | 'positions') => void;
}

export const CardHeader = ({ 
  name, 
  subaccountId, 
  isMarginTradingEnabled, 
  activeTab, 
  setActiveTab 
}: CardHeaderProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text truncate">
          {name}
        </h3>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-sm text-gray-400">Subaccount {subaccountId}</p>
        {isMarginTradingEnabled && (
          <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
            Margin Trading
          </span>
        )}
      </div>
    </div>
    <div className="flex gap-1 bg-gray-900/50 p-1 rounded-lg self-start">
      <button
        onClick={() => setActiveTab('balances')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
          activeTab === 'balances' 
            ? 'bg-blue-500 text-white shadow-lg' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }`}
      >
        <span className="flex items-center gap-1">
          <Wallet className="w-4 h-4" />
          Balances
        </span>
      </button>
      <button
        onClick={() => setActiveTab('positions')}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
          activeTab === 'positions' 
            ? 'bg-blue-500 text-white shadow-lg' 
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }`}
      >
        <span className="flex items-center gap-1">
          <LineChart className="w-4 h-4" />
          Positions
        </span>
      </button>
    </div>
  </div>
); 