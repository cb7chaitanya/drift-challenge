'use client';

import { useDriftStore } from '@/store/useDriftStore';
import { SubaccountCard } from './SubaccountCard';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';

export const SubaccountsList = () => {
  const { subaccounts } = useDriftStore();
  const { publicKey } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 rounded-2xl p-8 border border-gray-200/20 dark:border-gray-700/20"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Subaccounts ({subaccounts.length})
        </h2>
        {/* <CreateSubaccountButton /> */}
      </div>

      {Array.isArray(subaccounts) && subaccounts.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {subaccounts.map((subaccount, index) => (
            <motion.div
              key={subaccount.subAccountId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <SubaccountCard subaccount={subaccount} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center py-16 px-6 bg-gray-800/30 rounded-xl border border-gray-700/30"
        >
          <p className="text-lg text-gray-400">
            {!publicKey 
              ? "Connect your wallet to view your subaccounts or search for a wallet address"
              : "No subaccounts found, search for a wallet address or connect a different wallet"
            }
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}; 