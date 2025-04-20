import { BN } from '@project-serum/anchor';
import { SpotPosition as DriftSpotPosition, SpotMarkets } from '@drift-labs/sdk';

interface SpotPositionProps {
  position: DriftSpotPosition;
  index: number;
  formatNumber: (num: BN) => string;
}

export const SpotPosition = ({ position, index, formatNumber }: SpotPositionProps) => {
  const marketInfo = SpotMarkets['mainnet-beta'].find(m => m.marketIndex === position.marketIndex);
  if (!marketInfo) return null;

  const isBorrow = 'borrow' in position.balanceType;
  const scaledBalance = new BN(position.scaledBalance);
  const formattedBalance = formatNumber(
    scaledBalance.div(new BN(10).pow(new BN(marketInfo.precisionExp)))
  );

  return (
    <div className="bg-gray-800/30 p-4 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-all duration-200">
      <div className="flex justify-between items-center gap-2">
        <div>
          <span className="text-gray-400 truncate">{marketInfo.symbol} Balance</span>
          <div className="text-xs text-gray-500">
            {isBorrow ? 'Borrowed' : 'Spot'} Position {index + 1}
          </div>
        </div>
        <div className="text-right">
          <span className={`font-mono truncate ${isBorrow ? 'text-red-400' : 'text-white'}`}>
            {isBorrow ? '-' : ''}{formattedBalance} {marketInfo.symbol}
          </span>
        </div>
      </div>
    </div>
  );
}; 