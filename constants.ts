import { StrategicBrief, ProductionData, PriceTicker } from './types';

export const COLORS = {
  NAVY: '#0A192F',
  GOLD: '#C5A059',
  DANGER: '#E74C3C',
  SUCCESS: '#27AE60',
  WARNING: '#F1C40F',
  BG_LIGHT: '#F4F7F6',
};

export const INITIAL_TICKERS: PriceTicker[] = [
  { symbol: 'BRENT', price: 74.22, change: -0.90, changePercent: -1.2 },
  { symbol: 'WTI', price: 69.68, change: -0.56, changePercent: -0.8 },
  { symbol: 'MEXICAN MIX', price: 63.98, change: 0.25, changePercent: 0.4 },
];

export const INITIAL_PRODUCTION: ProductionData[] = [
  { month: 'Jul', actual: 1.62, target: 1.8 },
  { month: 'Ago', actual: 1.64, target: 1.8 },
  { month: 'Sep', actual: 1.63, target: 1.8 },
  { month: 'Oct', actual: 1.65, target: 1.8 },
  { month: 'Nov', actual: 1.66, target: 1.8 },
  { month: 'Dic', actual: 1.65, target: 1.8 },
];

export const INITIAL_BRIEF: StrategicBrief = {
  lastUpdated: 'Sincronizando terminal...',
  pillars: [],      // Importante: Array vacío
  historyRecap: [], // Importante: Array vacío
  macro: {
    sentiment: 'NEUTRAL',
    description: 'Cargando análisis macroeconómico...',
    recommendation: 'Aguarde por la actualización en vivo.'
  },
  actions: [],
  globalSources: []
};