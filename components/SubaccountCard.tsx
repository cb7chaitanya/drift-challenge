'use client';

import { UserAccount } from '@drift-labs/sdk';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BN } from '@project-serum/anchor';
import { CardHeader } from './CardHeader';
import { ActionButtons } from './ActionButtons';
import { PositionsList } from './PositionsList';
import { TransactionModal } from './modals/TransactionModal';
import { PerpOrderModal } from './modals/PerpOrderModal';
import { useDriftStore } from '../store/useDriftStore';

interface SubaccountCardProps {
  subaccount: UserAccount;
}

export const SubaccountCard = ({ subaccount }: SubaccountCardProps) => {
  const { isViewingOtherWallet } = useDriftStore();
  const [activeTab, setActiveTab] = useState<'balances' | 'positions'>('balances');
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'deposit' | 'withdraw' | 'market' | 'limit';
  }>({ isOpen: false, type: 'deposit' });

  if (!subaccount) return null;

  const name = String.fromCharCode(...subaccount.name).trim();
  const spotPositions = subaccount.spotPositions?.filter(pos => !pos.scaledBalance.isZero()) || [];
  const perpPositions = subaccount.perpPositions?.filter(pos => !pos.baseAssetAmount.isZero()) || [];

  const formatNumber = (num: BN) => {
    const value = Number(num.toString());
    if (Math.abs(value) < 0.001 && value !== 0) {
      return value.toExponential(2);
    }
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="h-full w-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
    >
      {/* Header section with name and tabs */}
      <CardHeader 
        name={name} 
        subaccountId={subaccount.subAccountId}
        isMarginTradingEnabled={subaccount.isMarginTradingEnabled}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Only show action buttons if not viewing other wallet */}
      {!isViewingOtherWallet && (
        <ActionButtons setModalConfig={setModalConfig} />
      )}

      {/* Positions list */}
      <PositionsList
        activeTab={activeTab}
        spotPositions={spotPositions}
        perpPositions={perpPositions}
        formatNumber={formatNumber}
      />

      {/* Render appropriate modal based on type */}
      {(modalConfig.type === 'deposit' || modalConfig.type === 'withdraw') ? (
        <TransactionModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          type={modalConfig.type}
          subaccountId={subaccount.subAccountId}
        />
      ) : (
        <PerpOrderModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          type={modalConfig.type as 'market' | 'limit'}
          subaccountId={subaccount.subAccountId}
        />
      )}
    </motion.div>
  );
}; 