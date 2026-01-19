
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
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
          {sources.map((source, idx) => (
            <a
              key={idx}
              href={source.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[10px] bg-slate-50 hover:bg-oil-navy hover:text-white text-slate-500 font-medium px-3 py-1.5 rounded transition-all border border-slate-200"
            >
              Leer noticia completa ↗
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnalysisCard;
