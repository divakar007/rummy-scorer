export interface Player {
  id: string;
  name: string;
  scores: number[];
  totalScore: number;
  isKnockedOut: boolean;
  moneyWon: number;
}

export type Currency = "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD";

export interface GameConfig {
  totalScoreLimit: number;
  dropScore: number;
  middleDropScore: number;
  moneyPerGame: number;
  currency: Currency;
}

export interface GameState {
  players: Player[];
  rounds: number;
  config: GameConfig;
  roundHistory: RoundScores[];
  isStarted: boolean;
}

export type RoundScores = Record<string, number>;

export interface RoundInput {
  [playerId: string]: number;
}
