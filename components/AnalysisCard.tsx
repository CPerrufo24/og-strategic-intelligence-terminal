
import React from 'react';
import { Sentiment, Source } from '../types';
import SentimentBadge from './SentimentBadge';

interface AnalysisCardProps {
  title: string;
  sentiment?: Sentiment;
  borderColor?: string;
  sources?: Source[];
  children: React.ReactNode;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ title, sentiment, borderColor = 'border-oil-navy', sources, children }) => {
  return (
    <div className={`bg-white rounded-lg p-6 mb-6 shadow-lg border-t-4 ${borderColor} transition-transform hover:scale-[1.01]`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <h2 className="text-xl font-bold text-oil-navy">{title}</h2>
        {sentiment && <SentimentBadge sentiment={sentiment} />}
      </div>
      <div className="text-slate-600 leading-relaxed text-sm md:text-base">
        {children}
      </div>
      {sources && sources.length > 0 && (
        <div className="mt-6">
          <h4 className="text-[9px] font-bold text-oil-gold uppercase tracking-[0.2em] mb-2">Fuentes de Inteligencia:</h4>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {sources.map((source, idx) => {
              const domain = new URL(source.uri).hostname.replace('www.', '');
              return (
                <a
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-slate-400 hover:text-oil-navy transition-colors flex items-center gap-1"
                >
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{domain} /</span>
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisCard;
