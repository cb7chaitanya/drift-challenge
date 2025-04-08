'use client';

import { useDriftStore } from '@/store/useDriftStore';

export const SubaccountsList = () => {
  const { subaccounts } = useDriftStore();

  if (!subaccounts.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No subaccounts found. Connect your wallet to view subaccounts.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subaccounts.map((subaccount, index) => (
        <div
          key={index}
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Subaccount {index + 1}</h3>
          <div className="space-y-2">
            <p className="text-gray-300">
              Authority: {subaccount.authority.toString()}
            </p>
            {/* Add more subaccount details here */}
          </div>
        </div>
      ))}
    </div>
  );
}; 