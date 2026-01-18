import React, { useState, useEffect, useCallback } from 'react';
import Ticker from './components/Ticker';
import AnalysisCard from './components/AnalysisCard';
import ProductionChart from './components/ProductionChart';
import { INITIAL_BRIEF, INITIAL_PRODUCTION, INITIAL_TICKERS } from './constants';
import { StrategicBrief, PriceTicker } from './types';
import { generateStrategicBrief } from './services/geminiService';

const App: React.FC = () => {
  const [brief, setBrief] = useState<StrategicBrief>(INITIAL_BRIEF);
  const [tickers, setTickers] = useState<PriceTicker[]>(INITIAL_TICKERS);
  const [loading, setLoading] = useState(false);
  const [initialSync, setInitialSync] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleRefreshBrief = useCallback(async (isInitial = false) => {
    setLoading(true);
    setError(null);
    try {
      const newBrief = await generateStrategicBrief();
      setBrief(newBrief);
      if (isInitial) setInitialSync(false);
    } catch (err) {
      console.error(err);
      setError("Falla de sincronización. Mostrando datos de respaldo.");
      if (isInitial) setInitialSync(false);
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    handleRefreshBrief(true);
  }, [handleRefreshBrief]);

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

  if (initialSync) {
    return (
      <div className="min-h-screen bg-oil-navy flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-oil-gold/20 rounded-full animate-pulse"></div>
          <div className="absolute top-0 w-16 h-16 border-t-2 border-oil-gold rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-condensed font-bold tracking-[0.3em] mt-8 mb-2 uppercase italic text-oil-gold">Calibrando Inteligencia</h1>
        <p className="text-white/40 text-[10px] tracking-widest animate-pulse uppercase">Escaneando Mercados Globales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-[#0a0c10] text-slate-300 selection:bg-oil-gold selection:text-white pb-12">
      <Ticker tickers={tickers} />

      <header className="bg-oil-navy text-white pt-12 pb-20 px-6 text-center border-b-4 border-oil-gold relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        {/* WOW FACTOR: Live Market Pulse */}
        <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md py-2 flex justify-around text-[9px] font-bold tracking-[0.2em] uppercase text-oil-gold border-t border-white/5">
          <span>Diferencial Maya: <span className="text-white">-$12.40 USD</span></span>
          <span>Riesgo Geopolítico: <span className="text-status-danger">ALTO</span></span>
          <span className="hidden md:inline">Márgenes: <span className="text-status-success">OPTIMIZADOS ▲</span></span>
        </div>

        <div className="absolute top-4 right-6">
          <button
            onClick={() => handleRefreshBrief(false)}
            disabled={loading}
            className={`px-6 py-2 rounded font-condensed text-[10px] font-bold tracking-widest transition-all ${loading ? 'bg-slate-800' : 'bg-oil-gold text-oil-navy hover:bg-white'}`}
          >
            {loading ? 'SINC...' : 'ACTUALIZAR TERMINAL'}
          </button>
        </div>

        <h1 className="text-3xl md:text-5xl font-condensed font-bold tracking-[0.2em] mb-3 uppercase italic">
          O&G STRATEGIC <span className="text-oil-gold">TERMINAL</span>
        </h1>
        <p className="text-white/30 font-medium tracking-[0.3em] text-[10px] uppercase">
          {brief.lastUpdated}
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20">
        {error && (
          <div className="mb-6 bg-status-danger/90 text-white px-6 py-2 rounded text-[10px] font-bold uppercase tracking-widest">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-12">

            {/* SECCIÓN 1: BREAKING (0-12h) */}
            <section>
              <div className="flex items-center gap-4 mb-6">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.4em]">Breaking Intelligence (0-12h)</h3>
                <div className="h-px flex-1 bg-white/10"></div>
                <span className="w-2 h-2 bg-status-danger rounded-full animate-pulse"></span>
              </div>
              <div className="space-y-6">
                {brief.pillars?.map((pillar, idx) => (
                  <AnalysisCard
                    key={idx}
                    title={pillar.title}
                    sentiment={pillar.sentiment}
                    borderColor="border-oil-gold"
                  >
                    <p className="mb-4 text-slate-300"><strong>Análisis:</strong> {pillar.context}</p>
                    <div className="p-4 bg-white/5 border-l-4 border-oil-gold rounded-r italic text-xs text-oil-gold">
                      "Implicación: {pillar.implication}"
                    </div>
                  </AnalysisCard>
                ))}
              </div>
            </section>

            {/* SECCIÓN 2: STRATEGIC RECAP (24-36h) */}
            <section className="bg-white/[0.02] p-8 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <h3 className="text-[10px] font-bold text-oil-gold/80 uppercase tracking-[0.4em]">Strategic Recap (24-36h)</h3>
                <div className="h-px flex-1 bg-white/5"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {brief.historyRecap?.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-xl bg-black/40 border border-white/5 hover:border-oil-gold/30 transition-all group">
                    <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest block mb-2">Jornada Anterior</span>
                    <h4 className="text-sm font-bold text-slate-200 mb-2 group-hover:text-oil-gold transition-colors">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4">{item.context}</p>
                    <p className="text-[10px] font-semibold text-white/40 italic border-t border-white/5 pt-3">Impacto Acumulado: {item.impact}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <AnalysisCard title="Variables Macro" sentiment={brief.macro.sentiment} borderColor="border-status-danger">
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">{brief.macro.description}</p>
              <div className="bg-white/5 p-4 rounded border border-white/10">
                <span className="text-[9px] font-bold text-oil-gold uppercase tracking-widest block mb-1">Recomendación Táctica:</span>
                <p className="text-xs font-bold text-white italic uppercase">{brief.macro.recommendation}</p>
              </div>
            </AnalysisCard>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-2xl">
              <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-6">Producción Nacional</h4>
              <div className="flex items-end justify-between mb-6">
                <span className="text-3xl font-condensed font-bold text-white tracking-tighter">1.65M <small className="text-[10px] opacity-20">bpd</small></span>
                <span className="text-status-danger text-xs font-bold">▼ 8.3%</span>
              </div>
              <ProductionChart data={INITIAL_PRODUCTION} />
            </div>
          </aside>
        </div>

        {/* Matriz Estratégica */}
        <div className="mt-16 overflow-hidden rounded-xl border border-white/5 shadow-2xl bg-black/20">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-oil-navy text-white text-[10px] uppercase tracking-[0.2em] font-condensed">
                <th className="p-6">Área Operativa</th>
                <th className="p-6">Riesgo Detectado</th>
                <th className="p-6">Acción Mitigante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-400">
              {brief.actions?.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6 font-bold text-slate-200 uppercase">{row.focus}</td>
                  <td className="p-6">{row.risk}</td>
                  <td className="p-6 font-bold text-oil-gold italic">"{row.action}"</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fuentes */}
        {brief.globalSources?.length > 0 && (
          <div className="mt-12 flex flex-wrap gap-4 justify-center">
            {brief.globalSources.map((s, i) => (
              <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] text-slate-600 hover:text-oil-gold uppercase tracking-widest border-b border-transparent hover:border-oil-gold transition-all">
                {s.title} ↗
              </a>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-20 py-12 text-center border-t border-white/5 text-slate-700 text-[8px] font-bold uppercase tracking-[0.5em]">
        O&G STRATEGIC NODE | TERMINAL V.2.5
      </footer>
    </div>
  );
};

export default App;