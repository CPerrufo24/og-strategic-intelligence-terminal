export type Sentiment = 'BULLISH' | 'BEARISH' | 'NEUTRAL';

export interface Source {
  uri: string;
  title: string;
}

export interface PriceTicker {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

export interface PillarContent {
  title: string;
  sentiment: Sentiment;
  context: string;
  implication: string;
  sources?: Source[];
}

// Interfaz para la memoria estratégica (24-36h)
export interface HistoryItem {
  title: string;
  context: string;
  impact: string;
  sources?: Source[];
}

export interface MacroRisk {
  sentiment: Sentiment;
  description: string;
  recommendation: string;
}

export interface StrategicAction {
  focus: string;
  risk: string;
  action: string;
}

export interface StrategicBrief {
  breaking: PillarContent[];     // Inteligencia Breaking (0-12h)
  historyRecap: HistoryItem[]; // Memoria Estratégica (24-36h)
  macro: MacroRisk;
  actions: StrategicAction[];
  lastUpdated: string;
  globalSources: Source[];
}

export interface ProductionData {
  month: string;
  actual: number;
  target: number;
}