'use client';

import { WalletConnection } from '@/components/WalletConnection';
import { DriftClientProvider } from '@/components/DriftClientProvider';
import { SubaccountsList } from '@/components/SubaccountsList';
import { WalletSearch } from '@/components/WalletSearch';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Topbar */}
        <div className="flex items-center justify-between gap-4 py-4 mb-8">
          <WalletSearch />
          <WalletConnection />
        </div>

        <DriftClientProvider />
        
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8 text-white">Drift Subaccounts</h1>
          <SubaccountsList />
        </div>
      </div>
    </main>
  );
} 