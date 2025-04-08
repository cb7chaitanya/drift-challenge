'use client';

import { WalletConnection } from '@/components/WalletConnection';
import { DriftClientProvider } from '@/components/DriftClientProvider';
import { SubaccountsList } from '@/components/SubaccountsList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <WalletConnection />
      <DriftClientProvider />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Drift Subaccounts</h1>
        <SubaccountsList />
      </div>
    </main>
  );
} 