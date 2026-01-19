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
    <div className="bg-white text-oil-navy py-2 overflow-hidden sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="flex justify-center items-center gap-12 font-condensed text-xs md:text-sm tracking-wider animate-pulse-slow whitespace-nowrap">
        {tickers.map((ticker) => (
          <div key={ticker.symbol} className="flex items-center gap-2">
            <span className="font-bold opacity-70 text-slate-500">{ticker.symbol}:</span>
            <span className="font-bold text-slate-800">{ticker.price.toFixed(2)}</span>
            <span className={`font-bold ${ticker.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {ticker.change >= 0 ? '▲' : '▼'} {Math.abs(ticker.changePercent).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
