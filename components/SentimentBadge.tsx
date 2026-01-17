
import React from 'react';
import { Sentiment } from '../types';

interface SentimentBadgeProps {
  sentiment: Sentiment;
}

const SentimentBadge: React.FC<SentimentBadgeProps> = ({ sentiment }) => {
  const styles = {
    BULLISH: 'bg-status-success/10 text-status-success border-status-success',
    BEARISH: 'bg-status-danger/10 text-status-danger border-status-danger',
    NEUTRAL: 'bg-status-warning/10 text-status-warning border-status-warning',
  };

  const labels = {
    BULLISH: 'OPORTUNIDAD',
    BEARISH: 'RIESGO ALTO',
    NEUTRAL: 'ESTABILIZADO',
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${styles[sentiment]}`}>
      SENTIMIENTO: {labels[sentiment]}
    </span>
  );
};

export default SentimentBadge;
