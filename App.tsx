import React, { useState, useEffect, useCallback } from 'react';
import Ticker from './components/Ticker';
import AnalysisCard from './components/AnalysisCard';
import ProductionChart from './components/ProductionChart';
import { INITIAL_BRIEF, INITIAL_PRODUCTION, INITIAL_TICKERS, COLORS } from './constants';
import { StrategicBrief } from './types';
import { generateStrategicBrief } from './services/geminiService';

const App: React.FC = () => {
  const [brief, setBrief] = useState<StrategicBrief>(INITIAL_BRIEF);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // CACHE STRATEGY: Load from local storage immediately
  useEffect(() => {
    const cached = localStorage.getItem('og_strategic_brief');
    if (cached) {
      try {
        setBrief(JSON.parse(cached));
        setInitialLoad(false); // Show content immediately if cache exists
      } catch (e) {
        console.error("Cache corrupto", e);
      }
    }
  }, []);

  const handleRefreshBrief = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);
    try {
      const newBrief = await generateStrategicBrief();
      setBrief(newBrief);
      localStorage.setItem('og_strategic_brief', JSON.stringify(newBrief));
      if (initialLoad) setInitialLoad(false);
    } catch (err) {
      console.error(err);
      setError("Conexión inestable. Mostrando última inteligencia válida.");
      if (initialLoad) setInitialLoad(false); // Fallback to initial state or cache
      setTimeout(() => setError(null), 5000);
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [initialLoad]);

  // Initial fetch (background if cache exists)
  useEffect(() => {
    handleRefreshBrief(true);
  }, [handleRefreshBrief]);

  if (initialLoad) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-oil-navy p-6 text-center">
        <div className="relative mb-8">
          <div className="w-16 h-16 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 w-16 h-16 border-t-4 border-oil-gold rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-sans font-bold tracking-widest uppercase text-oil-navy">Estableciendo Enlace Satelital Segudo</h1>
        <p className="text-slate-400 text-xs tracking-widest mt-2 uppercase">Descifrando vectores de mercado...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-[#F4F6F8] text-slate-800 pb-0">
      <Ticker initialTickers={INITIAL_TICKERS} />

      {/* HEADER PROFESSIONAL */}
      <header className="bg-white pt-12 pb-16 px-6 text-center border-b border-gray-200 relative shadow-sm z-30">
        <div className="max-w-7xl mx-auto relative">
          <div className="absolute top-0 right-0">
            <button
              onClick={() => handleRefreshBrief(false)}
              disabled={loading}
              className={`px-5 py-2 rounded text-[10px] font-bold tracking-widest transition-all border ${loading ? 'bg-slate-100 text-slate-400 border-transparent' : 'bg-white text-oil-navy border-slate-200 hover:border-oil-gold hover:text-oil-gold shadow-sm'}`}
            >
              {loading ? 'ACTUALIZANDO...' : 'ACTUALIZAR INTELIGENCIA'}
            </button>
          </div>

          <h1 className="text-3xl md:text-4xl font-condensed font-bold tracking-wider mb-2 text-oil-navy">
            STRATEGIC <span className="text-oil-gold">TERMINAL</span>
          </h1>
          <div className="flex justify-center items-center gap-3">
            <div className="h-px w-12 bg-oil-gold/30"></div>
            <p className="text-slate-400 font-medium tracking-[0.2em] text-[10px] uppercase">
              {brief.lastUpdated}
            </p>
            <div className="h-px w-12 bg-oil-gold/30"></div>
          </div>
        </div>

        {/* MARKET PULSE BAR */}
        <div className="absolute bottom-0 left-0 w-full bg-oil-navy text-white py-2 flex justify-center gap-8 md:gap-16 text-[9px] font-bold tracking-[0.2em] uppercase">
          <span>Diferencial Maya: <span className="text-oil-gold">-$12.40 USD</span></span>
          <span>Riesgo Geopolítico: <span className="text-red-400">ALTO</span></span>
          <span className="hidden md:inline">Márgenes: <span className="text-green-400">OPTIMIZADOS ▲</span></span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-10 relative z-20 pb-24">
        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 text-red-800 px-6 py-3 rounded text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-3">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-10">

            {/* SECCIÓN 1: BREAKING (0-12h) */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-xs font-bold text-oil-navy uppercase tracking-[0.2em] border-b-2 border-oil-gold pb-1">Breaking Intelligence (0-12h)</h3>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
              </div>
              <div className="space-y-6">
                {brief.pillars?.map((pillar, idx) => (
                  <AnalysisCard
                    key={idx}
                    title={pillar.title}
                    sentiment={pillar.sentiment}
                    borderColor="border-oil-gold"
                    sources={pillar.sources}
                  >
                    <p className="mb-4 text-slate-600"><strong>Análisis:</strong> {pillar.context}</p>
                    <div className="p-4 bg-slate-50 border-l-4 border-oil-gold rounded-r text-xs text-oil-navy font-medium italic">
                      "Implicación Táctica: {pillar.implication}"
                    </div>
                  </AnalysisCard>
                ))}
              </div>
            </section>

            {/* SECCIÓN 2: STRATEGIC RECAP (24-36h) */}
            <section className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Strategic Recap (24-36h)</h3>
                <div className="h-px flex-1 bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {brief.historyRecap?.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-lg bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all group">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Jornada Anterior</span>
                    <h4 className="text-sm font-bold text-oil-navy mb-2 group-hover:text-oil-gold transition-colors">{item.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.context}</p>
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-[10px] font-semibold text-slate-400 italic">Impacto: {item.impact}</p>
                      {item.sources && item.sources.length > 0 && (
                        <div className="mt-2 text-[9px] text-slate-400 truncate">Fuente: {item.sources[0].title}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <AnalysisCard title="Variables Macro" sentiment={brief.macro.sentiment} borderColor="border-slate-200">
              <p className="text-xs text-slate-500 mb-6 leading-relaxed text-justify">{brief.macro.description}</p>
              <div className="bg-slate-50 p-5 rounded border border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Recomendación Ejecutiva:</span>
                <p className="text-sm font-bold text-oil-navy italic uppercase border-l-2 border-oil-gold pl-3">{brief.macro.recommendation}</p>
              </div>
            </AnalysisCard>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Producción Nacional (M bpd)</h4>
              <div className="flex items-end justify-between mb-2">
                <span className="text-4xl font-condensed font-bold text-oil-navy tracking-tight">1.65</span>
                <div className="text-right">
                  <span className="text-red-500 text-xs font-bold block">▼ 8.3%</span>
                  <span className="text-[9px] text-slate-400 uppercase">vs Objetivo</span>
                </div>
              </div>
              <ProductionChart data={INITIAL_PRODUCTION} />
            </div>
          </aside>
        </div>

        {/* Matriz Estratégica */}
        <div className="mt-16 overflow-hidden rounded-xl border border-slate-200 shadow-lg bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-oil-navy text-white text-[10px] uppercase tracking-[0.2em] font-sans">
                <th className="p-5 font-medium">Área Operativa</th>
                <th className="p-5 font-medium">Riesgo Detectado</th>
                <th className="p-5 font-medium">Acción Mitigante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
              {brief.actions?.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="p-5 font-bold text-oil-navy uppercase">{row.focus}</td>
                  <td className="p-5">{row.risk}</td>
                  <td className="p-5 font-bold text-oil-gold italic">"{row.action}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sources Fallback (if any global) NOT needed per design, but keeping section hidden or minimal if needed? 
            Design requested sources in cards. We have implemented that.
            We can remove the global sources section to keep it clean, or keep it as a 'Bibliografía' at bottom.
            Let's keep it discrete.
        */}
        {brief.globalSources?.length > 0 && (
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4 text-center">Referencias Adicionales</h5>
            <div className="flex flex-wrap gap-4 justify-center">
              {brief.globalSources.map((s, i) => (
                <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] text-slate-500 hover:text-oil-navy uppercase tracking-wider transition-colors">
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="mt-0 py-12 text-center bg-white border-t border-slate-200 z-10 relative">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="h-1 w-8 bg-oil-gold mb-2"></div>
          <p className="text-slate-800 text-[10px] font-bold uppercase tracking-[0.3em]">
            Inteligencia Estratégica Corporativa
          </p>
          <p className="text-slate-400 text-[9px] uppercase tracking-widest">
            Powered by Gemini Advanced Architecture • 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;