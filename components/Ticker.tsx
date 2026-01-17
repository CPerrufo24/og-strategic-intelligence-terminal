
import React from 'react';
import { PriceTicker } from '../types';

interface TickerProps {
  tickers: PriceTicker[];
}

const Ticker: React.FC<TickerProps> = ({ tickers }) => {
  return (
    <div className="bg-black text-white py-2 overflow-hidden sticky top-0 z-50 border-b border-oil-gold/30">
      <div className="flex justify-center items-center gap-12 font-condensed text-xs md:text-sm tracking-wider animate-pulse-slow">
        {tickers.map((ticker) => (
          <div key={ticker.symbol} className="flex items-center gap-2">
            <span className="font-bold opacity-70">{ticker.symbol}:</span>
            <span className="font-bold">{ticker.price.toFixed(2)} USD</span>
            <span className={ticker.change >= 0 ? 'text-status-success' : 'text-status-danger'}>
              {ticker.change >= 0 ? '▲' : '▼'} {Math.abs(ticker.changePercent).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
