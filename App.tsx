
import React, { useState, useEffect, useCallback } from 'react';
import Ticker from './components/Ticker';
import AnalysisCard from './components/AnalysisCard';
import ProductionChart from './components/ProductionChart';
import { INITIAL_BRIEF, INITIAL_PRODUCTION, INITIAL_TICKERS } from './constants';
import { StrategicBrief, PriceTicker } from './types';
import { generateStrategicBrief } from './services/geminiService';

const App: React.FC = () => {
  // Use INITIAL_BRIEF directly now that it matches the StrategicBrief type
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
      setError("Error al sincronizar datos en tiempo real. Mostrando última caché estratégica.");
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
        price: t.price + (Math.random() - 0.5) * 0.1,
        change: t.change + (Math.random() - 0.5) * 0.05
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (initialSync) {
    return (
      <div className="min-h-screen bg-oil-navy flex flex-col items-center justify-center text-white p-6 text-center">
        <div className="w-16 h-16 border-4 border-oil-gold border-t-transparent rounded-full animate-spin mb-6"></div>
        <h1 className="text-2xl font-condensed font-bold tracking-widest mb-2 uppercase italic">Protocolo de Búsqueda Activo</h1>
        <p className="text-oil-gold animate-pulse text-sm">Escaneando Reuters, Bloomberg y Comunicados Oficiales...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans bg-oil-light selection:bg-oil-gold selection:text-white">
      <Ticker tickers={tickers} />

      <header className="bg-oil-navy text-white pt-10 pb-16 px-6 text-center border-b-4 border-oil-gold relative">
        <div className="absolute top-4 right-4 flex gap-4">
           <button 
            onClick={() => handleRefreshBrief(false)}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all ${loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-oil-gold hover:bg-white hover:text-oil-navy shadow-lg'}`}
          >
            {loading ? 'SINCRONIZANDO...' : 'RECARGAR INTELIGENCIA'}
          </button>
        </div>
        <h1 className="text-3xl md:text-4xl font-condensed font-bold tracking-[0.2em] mb-2 uppercase">
          O&G STRATEGIC INTELLIGENCE
        </h1>
        <p className="text-oil-gold font-light tracking-wide text-sm md:text-lg">
          {brief.lastUpdated} | Terminal Ejecutiva
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-8 pb-20">
        {error && (
          <div className="mb-6 bg-status-danger text-white px-4 py-2 rounded text-sm text-center shadow-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <section>
              <h3 className="text-xs font-bold text-oil-navy/50 uppercase tracking-widest mb-4">Briefing de Pilares</h3>
              {brief.pillars.map((pillar, idx) => (
                <AnalysisCard 
                  key={idx} 
                  title={pillar.title} 
                  sentiment={pillar.sentiment}
                  borderColor={idx === 1 ? 'border-oil-gold' : 'border-oil-navy'}
                  sources={idx === 0 ? brief.globalSources.slice(0, 2) : brief.globalSources.slice(2, 4)}
                >
                  <p className="mb-4"><strong>Contexto:</strong> {pillar.context}</p>
                  <p className="p-3 bg-oil-light rounded border-l-4 border-oil-gold text-sm italic">
                    <strong>Implicación:</strong> {pillar.implication}
                  </p>
                </AnalysisCard>
              ))}
            </section>
          </div>

          <aside className="space-y-6">
            <h3 className="text-xs font-bold text-oil-navy/50 uppercase tracking-widest mb-4">Variables Externas</h3>
            
            <AnalysisCard title="Macroeconomía" sentiment={brief.macro.sentiment} borderColor="border-status-danger">
              <p className="text-sm mb-4">{brief.macro.description}</p>
              <div className="pt-4 border-t border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Decisión Ejecutiva:</span>
                <p className="text-sm font-semibold text-oil-navy">{brief.macro.recommendation}</p>
              </div>
            </AnalysisCard>

            <div className="bg-white rounded-lg p-6 shadow-md border-t-4 border-oil-navy">
              <h4 className="text-lg font-bold text-oil-navy mb-1">KPI Producción</h4>
              <div className="flex items-end justify-between mb-4">
                <span className="text-3xl font-condensed font-bold text-oil-navy">1.65M <small className="text-xs">bpd</small></span>
                <span className="text-status-danger text-xs font-bold">▼ 8.3%</span>
              </div>
              <ProductionChart data={INITIAL_PRODUCTION} />
            </div>
          </aside>
        </div>

        {/* Global Sources Bar */}
        <div className="mt-8 bg-oil-navy p-4 rounded-lg flex flex-col md:flex-row items-center gap-4 border-l-4 border-oil-gold">
          <div className="text-white text-xs font-bold uppercase tracking-widest">Fuentes de Verificación Hoy:</div>
          <div className="flex flex-wrap gap-3">
            {brief.globalSources.map((s, i) => (
              <a key={i} href={s.uri} target="_blank" className="text-[10px] text-oil-gold hover:text-white underline">
                {s.title}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-condensed font-bold text-oil-navy mb-6 flex items-center gap-4">
            MATRIZ DE ACCIÓN ESTRATÉGICA
            <span className="h-px flex-1 bg-slate-200"></span>
          </h2>
          <div className="overflow-x-auto rounded-lg shadow-xl border border-slate-200">
            <table className="w-full text-left bg-white">
              <thead>
                <tr className="bg-oil-navy text-white text-xs uppercase tracking-widest font-condensed">
                  <th className="p-5">Área</th>
                  <th className="p-5">Riesgo</th>
                  <th className="p-5">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {brief.actions.map((row, idx) => (
                  <tr key={idx} className="hover:bg-oil-light/50 transition-colors">
                    <td className="p-5 font-bold text-oil-navy">{row.focus}</td>
                    <td className="p-5 text-slate-600">{row.risk}</td>
                    <td className="p-5 font-medium text-slate-800 italic">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="bg-slate-100 py-10 text-center border-t border-slate-200 text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">
        TERMINAL DE INTELIGENCIA ESTRATÉGICA | FUENTES DE DATOS EXTERNAS SINCRONIZADAS
      </footer>
    </div>
  );
};

export default App;
