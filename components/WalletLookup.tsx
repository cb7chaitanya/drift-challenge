'use client';

import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useDriftStore } from '@/store/useDriftStore';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

export const WalletLookup = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const { client } = useDriftStore();

  const handleLookup = async () => {
    try {
      const pubkey = new PublicKey(walletAddress);
      await client?.getUserAccountsForAuthority(pubkey);
    } catch (error) {
      console.error('Error looking up wallet:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-xl mx-auto backdrop-blur-sm bg-white/10 dark:bg-gray-900/10 rounded-2xl p-8 border border-gray-200/20 dark:border-gray-700/20"
    >
      <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text mb-6">
        Wallet Lookup
      </h2>
      <div className="relative flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="w-full px-4 py-3 bg-white/5 dark:bg-gray-800/5 rounded-xl border border-gray-200/20 dark:border-gray-700/20 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLookup}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          Lookup
        </motion.button>
      </div>
    </motion.div>
  );
}; 