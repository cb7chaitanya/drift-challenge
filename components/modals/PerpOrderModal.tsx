'use client';

import { useState, useEffect } from 'react';
import { BN } from '@project-serum/anchor';
import { useDriftStore } from '@/store/useDriftStore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { showTransactionNotification, showErrorNotification } from '@/components/ui/notifications';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle } from 'lucide-react';
import { MainnetPerpMarkets } from '@drift-labs/sdk';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PerpOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'market' | 'limit';
  subaccountId: number;
}

export const PerpOrderModal = ({ isOpen, onClose, type, subaccountId }: PerpOrderModalProps) => {
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [market, setMarket] = useState('SOL-PERP');
  const [isLoading, setIsLoading] = useState(false);
  const { client } = useDriftStore();
  const [hasTakeProfit, setHasTakeProfit] = useState(false);
  const [hasStopLoss, setHasStopLoss] = useState(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState('');
  const [stopLossPrice, setStopLossPrice] = useState('');
  const [isScaledOrder, setIsScaledOrder] = useState(false);
  const [numOrders, setNumOrders] = useState(3);
  const [priceRangePercent, setPriceRangePercent] = useState<[number, number]>([0, 10]);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  const perpMarkets = MainnetPerpMarkets.filter(market => 
    // Filter out prediction markets and not yet launched markets
    !market.category?.includes('Prediction') && 
    market.launchTs < Date.now()
  ).sort((a, b) => a.marketIndex - b.marketIndex);

  useEffect(() => {
    const fetchPrice = () => {
      if (!client) return;
      const selectedMarket = perpMarkets.find(m => m.symbol === market);
      if (!selectedMarket) return;
      
      const oraclePrice = client.getOracleDataForPerpMarket(selectedMarket.marketIndex);
      setCurrentPrice(Number(oraclePrice.price) / 1e6);
    };

    fetchPrice();
  }, [client, perpMarkets, market]);

  const calculatePriceRange = () => {
    // For limit orders, show ranges only when price is entered
    if (type === 'limit' && !price) {
      return { from: 0, to: 0 };
    }

    const basePrice = type === 'market' ? currentPrice : Number(price);
    if (!basePrice) return { from: 0, to: 0 };

    const from = basePrice * (1 + priceRangePercent[0] / 100);
    const to = basePrice * (1 + priceRangePercent[1] / 100);
    
    return {
      from: Number(from.toFixed(2)),
      to: Number(to.toFixed(2))
    };
  };

  const handleSubmit = async () => {
    if (!client || !size) return;
    setIsLoading(true);

    try {
      const selectedMarket = perpMarkets.find(m => m.symbol === market);
      if (!selectedMarket) return;

      // Place main order
      const mainOrderParams = {
        marketIndex: selectedMarket.marketIndex,
        direction: side === 'long' ? 'long' : 'short',
        baseAssetAmount: new BN(Number(size) * 1e9),
        price: type === 'market' ? null : new BN(Number(price) * 1e6),
        orderType: type,
      };

      const txSig = await client.placePerpOrder(mainOrderParams, undefined, subaccountId);

      // Place take profit order if enabled
      if (hasTakeProfit && takeProfitPrice) {
        await client.placePerpOrder({
          ...mainOrderParams,
          direction: side === 'long' ? 'short' : 'long', // Opposite of main order
          price: new BN(Number(takeProfitPrice) * 1e6),
          orderType: 'limit',
          reduceOnly: true,
        }, undefined, subaccountId);
      }

      // Place stop loss order if enabled
      if (hasStopLoss && stopLossPrice) {
        await client.placePerpOrder({
          ...mainOrderParams,
          direction: side === 'long' ? 'short' : 'long', // Opposite of main order
          price: new BN(Number(stopLossPrice) * 1e6),
          orderType: 'triggerMarket',
          triggerPrice: new BN(Number(stopLossPrice) * 1e6),
          reduceOnly: true,
        }, undefined, subaccountId);
      }

      showTransactionNotification({
        txid: txSig,
        type: 'order',
        amount: size,
        symbol: selectedMarket.baseAssetSymbol,
      });
      onClose();
    } catch (error) {
      showErrorNotification(
        'Order failed',
        error instanceof Error ? error.message : 'Failed to place order'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
      <DialogContent className="max-w-lg mx-auto w-full bg-gray-900 text-white border-gray-800">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle className="text-xl font-bold">
              {type === 'market' ? 'Place Market Order' : 'Place Limit Order'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-gray-400">
            Enter the details for your {type} order
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Select value={market} onValueChange={setMarket}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select market" />
            </SelectTrigger>
            <SelectContent>
              {perpMarkets.map((market) => (
                <SelectItem key={market.marketIndex} value={market.symbol}>
                  {market.baseAssetSymbol} ({market.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 mb-2">
            <label>Position Side</label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Long: Profit when price goes up</p>
                  <p>Short: Profit when price goes down</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Select value={side} onValueChange={(value: 'long' | 'short') => setSide(value)}>
            <SelectTrigger className="bg-gray-800 border-gray-700">
              <SelectValue placeholder="Select side" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="long">Long (Buy)</SelectItem>
              <SelectItem value="short">Short (Sell)</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Enter size"
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
          />

          {type === 'limit' && (
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter limit price"
              className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
            />
          )}
        </div>

        <div className="space-y-4 border-t border-gray-700/50 py-4 my-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-400">Advanced Order Settings</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Take Profit: Close position at target price</p>
                  <p>Stop Loss: Limit losses at specified price</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="space-y-4 bg-gray-800/30 p-4 rounded-lg border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="take-profit"
                  checked={hasTakeProfit}
                  onCheckedChange={setHasTakeProfit}
                />
                <Label htmlFor="take-profit">Take Profit</Label>
              </div>
              {hasTakeProfit && (
                <Input
                  type="number"
                  value={takeProfitPrice}
                  onChange={(e) => setTakeProfitPrice(e.target.value)}
                  placeholder="Enter TP price"
                  className="w-32 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="stop-loss"
                  checked={hasStopLoss}
                  onCheckedChange={setHasStopLoss}
                />
                <Label htmlFor="stop-loss">Stop Loss</Label>
              </div>
              {hasStopLoss && (
                <Input
                  type="number"
                  value={stopLossPrice}
                  onChange={(e) => setStopLossPrice(e.target.value)}
                  placeholder="Enter SL price"
                  className="w-32 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                />
              )}
            </div>

            <div className="border-t border-gray-700/30 my-4" />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="scaled-orders"
                  checked={isScaledOrder}
                  onCheckedChange={setIsScaledOrder}
                />
                <Label htmlFor="scaled-orders">Scaled Orders</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Split order into multiple smaller orders</p>
                      <p>across a price range for better average entry</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {isScaledOrder && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Number of Orders</span>
                  <Input
                    type="number"
                    min={2}
                    max={10}
                    value={numOrders}
                    onChange={(e) => setNumOrders(Number(e.target.value))}
                    className="w-20 bg-gray-800 border-gray-700"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Price Range (%)</span>
                    <span>{priceRangePercent[0]}% to {priceRangePercent[1]}%</span>
                  </div>
                  <Slider
                    min={-20}
                    max={20}
                    step={0.5}
                    value={priceRangePercent}
                    onValueChange={(value: [number, number]) => setPriceRangePercent(value)}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    {type === 'limit' && !price ? (
                      <span className="text-center w-full">Enter limit price to see range</span>
                    ) : (
                      <>
                        <span>≈ ${calculatePriceRange().from}</span>
                        <span>≈ ${calculatePriceRange().to}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !size || (type === 'limit' && !price)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Place Order'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 