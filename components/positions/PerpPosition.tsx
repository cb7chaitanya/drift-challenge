'use client';

import { BN } from '@project-serum/anchor';
import { PerpPosition as DriftPerpPosition, MainnetPerpMarkets } from '@drift-labs/sdk';

interface PerpPositionProps {
  position: DriftPerpPosition;
  index: number;
  formatNumber: (num: BN) => string;
}

export const PerpPosition = ({ position, index, formatNumber }: PerpPositionProps) => {
  const marketInfo = MainnetPerpMarkets.find(m => m.marketIndex === position.marketIndex);
  if (!marketInfo) return null;

  const baseAssetAmount = new BN(position.baseAssetAmount);
  const quoteAssetAmount = new BN(position.quoteAssetAmount);
  const settledPnl = new BN(position.settledPnl);
  
  const isLong = !baseAssetAmount.isNeg();

  // Base assets in perp markets use 9 decimals precision
  const formattedSize = formatNumber(
    baseAssetAmount.abs().div(new BN(10).pow(new BN(9)))
  );
  // Quote and PnL are always in USDC (6 decimals)
  const formattedQuote = formatNumber(
    quoteAssetAmount.abs().div(new BN(10).pow(new BN(6)))
  );
  const formattedPnl = formatNumber(
    settledPnl.abs().div(new BN(10).pow(new BN(6)))
  );

  return (
    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-all duration-200">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-gray-400 truncate">{marketInfo.baseAssetSymbol} Position</span>
            <div className="text-xs text-gray-500">
              {isLong ? 'Long' : 'Short'} Position {index + 1}
            </div>
          </div>
          <div className="text-right">
            <span className={`font-mono truncate ${isLong ? 'text-green-400' : 'text-red-400'}`}>
              {isLong ? '+' : '-'}{formattedSize} {marketInfo.baseAssetSymbol}
            </span>
          </div>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Quote Value</span>
          <span className="font-mono text-gray-300">
            ${formattedQuote}
          </span>
        </div>

        {!settledPnl.isZero() && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Settled PnL</span>
            <span className={`font-mono ${settledPnl.isNeg() ? 'text-red-400' : 'text-green-400'}`}>
              {settledPnl.isNeg() ? '-' : '+'}${formattedPnl}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}; 