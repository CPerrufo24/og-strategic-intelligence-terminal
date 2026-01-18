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
      setError("Sincronización interrumpida. Verifique conexión o cuota de API.");
      if (isInitial) setInitialSync(false);
      setTimeout(() => setError(null), 6000);
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
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (initialSync) {
    return (
      <div className="min-h-screen bg-oil-navy flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="relative">
          <div className="w-20 h-20 border-2 border-oil-gold/20 rounded-full"></div>
          <div className="absolute top-0 w-20 h-20 border-t-2 border-oil-gold rounded-full animate-spin"></div>
        </div>
        <h1 className="text-xl font-condensed font-bold tracking-[0.3em] mt-8 mb-2 uppercase italic">Protocolo de Inteligencia</h1>
        <p className="text-oil-gold/60 text-xs tracking-widest animate-pulse uppercase">Escaneando Mercados Globales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-oil-light selection:bg-oil-gold selection:text-white pb-12">
      <Ticker tickers={tickers} />

      <header className="bg-oil-navy text-white pt-12 pb-20 px-6 text-center border-b-4 border-oil-gold relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #C5A059 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

        <div className="absolute top-4 right-6 flex items-center gap-4 z-10">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
            <span className="w-2 h-2 bg-status-success rounded-full animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-tighter">LIVE DATA</span>
          </div>
          <button
            onClick={() => handleRefreshBrief(false)}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2 rounded font-condensed text-xs font-bold transition-all shadow-xl ${loading ? 'bg-slate-800 cursor-wait' : 'bg-oil-gold hover:bg-white hover:text-oil-navy'}`}
          >
            {loading ? 'CALIBRANDO...' : 'RECARGAR INTELIGENCIA'}
          </button>
        </div>

        <h1 className="text-3xl md:text-5xl font-condensed font-bold tracking-[0.15em] mb-3 uppercase italic drop-shadow-md">
          O&G <span className="text-oil-gold">STRATEGIC</span> INTELLIGENCE
        </h1>
        <p className="text-white/50 font-medium tracking-[0.2em] text-[10px] md:text-xs uppercase">
          {brief.lastUpdated} | Terminal Ejecutiva
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
        {error && (
          <div className="mb-6 bg-status-danger/90 backdrop-blur-sm text-white px-6 py-3 rounded shadow-2xl text-xs font-bold flex items-center gap-3 border-l-4 border-white">
            <span>⚠</span> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-[10px] font-bold text-oil-navy uppercase tracking-[0.3em]">Briefing de Pilares</h3>
                <div className="h-px flex-1 bg-oil-navy/10"></div>
              </div>
              {brief.pillars.map((pillar, idx) => (
                <AnalysisCard
                  key={idx}
                  title={pillar.title}
                  sentiment={pillar.sentiment}
                  borderColor={idx % 2 === 0 ? 'border-oil-navy' : 'border-oil-gold'}
                  sources={brief.globalSources?.slice(idx * 2, (idx * 2) + 2)}
                >
                  <p className="mb-4 text-slate-700 leading-relaxed"><strong>Análisis:</strong> {pillar.context}</p>
                  <div className="p-4 bg-oil-light border-l-4 border-oil-gold rounded-r shadow-inner">
                    <p className="text-sm italic font-medium text-oil-navy">
                      <span className="text-[10px] not-italic font-bold block mb-1 opacity-50 uppercase tracking-wider">Implicación Estratégica:</span>
                      "{pillar.implication}"
                    </p>
                  </div>
                </AnalysisCard>
              ))}
            </section>
          </div>

          <aside className="space-y-8">
            <section>
              <h3 className="text-[10px] font-bold text-oil-navy uppercase tracking-[0.3em] mb-4">Variables Macroeconómicas</h3>
              <AnalysisCard title="Proyecciones" sentiment={brief.macro.sentiment} borderColor="border-status-danger">
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">{brief.macro.description}</p>
                <div className="pt-5 border-t border-slate-100">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recomendación Táctica:</span>
                  <p className="text-xs font-bold text-oil-navy leading-normal p-3 bg-slate-50 rounded border border-slate-100 uppercase italic">
                    {brief.macro.recommendation}
                  </p>
                </div>
              </AnalysisCard>
            </section>

            <div className="bg-white rounded-lg p-6 shadow-xl border-t-4 border-oil-navy">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-sm font-bold text-oil-navy uppercase tracking-widest">Producción</h4>
                <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-tighter">Real-Time Est.</span>
              </div>
              <div className="flex items-end justify-between mb-6">
                <div>
                  <span className="text-4xl font-condensed font-bold text-oil-navy">1.65M</span>
                  <span className="text-xs font-bold text-slate-400 ml-1 uppercase">bpd</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-status-danger text-sm font-bold">▼ 8.3%</span>
                </div>
              </div>
              <ProductionChart data={INITIAL_PRODUCTION} />
            </div>
          </aside>
        </div>

        {brief.globalSources && brief.globalSources.length > 0 && (
          <div className="mt-10 bg-oil-navy p-5 rounded-lg flex flex-col md:flex-row items-center gap-6 border-l-4 border-oil-gold shadow-2xl">
            <div className="text-oil-gold text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">Fuentes de Inteligencia:</div>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {brief.globalSources.map((s, i) => (
                <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2">
                  <span className="text-[10px] text-white/70 group-hover:text-oil-gold transition-colors font-medium border-b border-transparent group-hover:border-oil-gold pb-0.5">
                    {s.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-xl font-condensed font-bold text-oil-navy mb-8 flex items-center gap-6 uppercase tracking-widest">
            Matriz de Respuesta Táctica
            <span className="h-[1px] flex-1 bg-slate-200"></span>
          </h2>
          <div className="overflow-x-auto rounded-xl shadow-2xl border border-slate-200">
            <table className="w-full text-left bg-white">
              <thead>
                <tr className="bg-oil-navy text-white text-[10px] uppercase tracking-[0.2em] font-condensed">
                  <th className="p-6">Área de Operación</th>
                  <th className="p-6">Riesgo Detectado</th>
                  <th className="p-6">Acción Mitigante</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {brief.actions.map((row, idx) => (
                  <tr key={idx} className="hover:bg-oil-light/60 transition-colors">
                    <td className="p-6 font-bold text-oil-navy uppercase tracking-tighter">{row.focus}</td>
                    <td className="p-6 text-slate-500 font-medium">{row.risk}</td>
                    <td className="p-6 font-bold text-slate-800 italic bg-slate-50/30">
                      "{row.action}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="mt-20 py-12 text-center border-t border-slate-200 text-slate-400">
        <div className="text-[9px] font-bold uppercase tracking-[0.5em] mb-2 opacity-50">
          O&G Strategic Terminal | Powered by Gemini 2.5 Flash
        </div>
        <div className="text-[8px] italic opacity-30">
          Uso estrictamente corporativo.
        </div>
      </footer>
    </div>
  );
};

export default App;