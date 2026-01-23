import React, { useState, useEffect } from 'react';
import { PriceTicker } from '../types';
import { COLORS } from '../constants';

interface TickerProps {
  initialTickers: PriceTicker[];
}

const Ticker: React.FC<TickerProps> = ({ initialTickers }) => {
  const [tickers, setTickers] = useState<PriceTicker[]>(initialTickers);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prev => prev.map(t => ({
        ...t,
        price: t.price + (Math.random() - 0.5) * 0.15,
        changePercent: t.changePercent + (Math.random() - 0.5) * 0.02
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white py-1.5 overflow-hidden sticky top-0 z-50 border-b border-white/10 shadow-lg">
      <div className="flex justify-center items-center gap-12 font-condensed text-[10px] tracking-[0.2em] animate-pulse-slow whitespace-nowrap uppercase">
        {tickers.map((ticker) => (
          <div key={ticker.symbol} className="flex items-center gap-2">
            <span className="font-bold text-oil-gold">{ticker.symbol}:</span>
            <span className="font-bold">{ticker.price.toFixed(2)} USD</span>
            <span className={`font-bold ${ticker.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {ticker.change >= 0 ? '▲' : '▼'} {Math.abs(ticker.changePercent).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
