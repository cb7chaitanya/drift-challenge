'use client';

import { useState } from 'react';
import { SubaccountsList } from './SubaccountsList';
import { WalletLookup } from './WalletLookup';
import { WalletConnection } from './WalletConnection';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { SunIcon, MoonIcon } from 'lucide-react';

export const DriftDashboard = () => {
  const [activeTab, setActiveTab] = useState<'subaccounts' | 'lookup'>('subaccounts');
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="relative">
        <nav className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('subaccounts')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'subaccounts'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                My Subaccounts
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('lookup')}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'lookup'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Wallet Lookup
              </motion.button>
            </div>
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              >
                {theme === 'dark' ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </motion.button>
              <WalletConnection />
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'subaccounts' ? (
              <SubaccountsList />
            ) : (
              <WalletLookup />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}; 