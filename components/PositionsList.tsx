'use client';

import { motion } from 'framer-motion';
import { SpotPosition as SpotPositionComponent } from './positions/SpotPosition';
import { PerpPosition } from './positions/PerpPosition';
import { SpotPosition as DriftSpotPosition, PerpPosition as DriftPerpPosition } from '@drift-labs/sdk';
import { BN } from '@project-serum/anchor';

interface PositionsListProps {
  activeTab: 'balances' | 'positions';
  spotPositions: DriftSpotPosition[];
  perpPositions: DriftPerpPosition[];
  formatNumber: (num: BN) => string;
}

export const PositionsList = ({ activeTab, spotPositions, perpPositions, formatNumber }: PositionsListProps) => (
  <motion.div
    key={activeTab}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="space-y-3 overflow-auto max-h-[300px] scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
  >
    {activeTab === 'balances' ? (
      spotPositions.length > 0 ? (
        spotPositions.map((position, index) => (
          <SpotPositionComponent
            key={`${position.marketIndex}-${index}`}
            position={position}
            index={index}
            formatNumber={formatNumber}
          />
        ))
      ) : (
        <div className="text-gray-500 text-center py-4">No spot positions found</div>
      )
    ) : (
      perpPositions.length > 0 ? (
        perpPositions.map((position, index) => (
          <PerpPosition
            key={`${position.marketIndex}-${index}`}
            position={position}
            index={index}
            formatNumber={formatNumber}
          />
        ))
      ) : (
        <div className="text-gray-500 text-center py-4">No perp positions found</div>
      )
    )}
  </motion.div>
); 