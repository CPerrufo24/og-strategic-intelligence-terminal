
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
  pillars: PillarContent[];
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
