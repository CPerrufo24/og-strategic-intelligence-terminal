
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
  { symbol: 'BRENT', price: 74.20, change: -0.90, changePercent: -1.2 },
  { symbol: 'WTI', price: 69.85, change: -0.56, changePercent: -0.8 },
  { symbol: 'MEXICAN MIX', price: 64.12, change: 0.25, changePercent: 0.4 },
];

export const INITIAL_PRODUCTION: ProductionData[] = [
  { month: 'Jul', actual: 1.62, target: 1.8 },
  { month: 'Ago', actual: 1.64, target: 1.8 },
  { month: 'Sep', actual: 1.63, target: 1.8 },
  { month: 'Oct', actual: 1.65, target: 1.8 },
  { month: 'Nov', actual: 1.66, target: 1.8 },
  { month: 'Dic', actual: 1.65, target: 1.8 },
];

// Added globalSources to satisfy StrategicBrief interface and fix Type error
export const INITIAL_BRIEF: StrategicBrief = {
  lastUpdated: new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  pillars: [
    {
      title: 'PEMEX y Soberanía Energética',
      sentiment: 'NEUTRAL',
      context: 'La administración ha inyectado 392,000 mdp para blindar la liquidez operativa. No obstante, el crecimiento del presupuesto está condicionado a la reducción del huachicol fiscal.',
      implication: 'Se espera una mayor fiscalización en toda la cadena de suministro de petrolíferos.',
    },
    {
      title: 'Mercado Privado y Exploración',
      sentiment: 'BULLISH',
      context: 'La reactivación de diálogos con gigantes como Exxon y Chevron para el Campo Zama marca un cambio de tono hacia las Asociaciones Público-Privadas (APPs).',
      implication: 'Ventana abierta para proveedores de servicios especializados en EOR y aguas someras.',
    }
  ],
  macro: {
    sentiment: 'BEARISH',
    description: 'La sobreoferta global proyecta el Brent hacia los 50 USD. La volatilidad geopolítica añade una prima de riesgo incierta.',
    recommendation: 'Ejecutar coberturas (hedging) para el segundo semestre.',
  },
  actions: [
    { focus: 'Refinación & Fertilizantes', risk: 'Dependencia de subsidios directos.', action: 'Optimizar dieta de crudo en Dos Bocas.' },
    { focus: 'Deuda Financiera', risk: 'Vencimiento de 14 mil mdd.', action: 'Refinanciamiento vía apoyo soberano.' },
    { focus: 'Relaciones Int.', risk: 'Tensiones comerciales con EE.UU.', action: 'Diversificar portafolio de exportación.' }
  ],
  globalSources: []
};
