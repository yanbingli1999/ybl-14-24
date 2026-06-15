export type CandyType =
  | 'strawberry'
  | 'lemon'
  | 'mint'
  | 'blueberry'
  | 'grape'
  | 'rainbow'
  | 'bomb';

export type SpecialCandyType = 'rainbow' | 'bomb' | null;

export interface Candy {
  id: string;
  type: CandyType;
  row: number;
  col: number;
  isSpecial: boolean;
  specialType: SpecialCandyType;
  isMatched: boolean;
  isFalling: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface MatchResult {
  candies: Candy[];
  positions: Position[];
  matchType: 'horizontal' | 'vertical' | 'both' | 'special';
  specialGenerated: SpecialCandyType;
  specialPosition: Position | null;
}

export interface Carriage {
  id: string;
  candyType: CandyType;
  capacity: number;
  currentLoad: number;
}

export interface Train {
  id: string;
  name: string;
  carriages: Carriage[];
}

export interface OrderItem {
  candyType: CandyType;
  quantity: number;
}

export interface StationOrder {
  id: string;
  stationId: string;
  stationName: string;
  guildId: string;
  items: OrderItem[];
  reward: number;
  penalty: number;
  isUrgent: boolean;
  urgentBonus: number;
  isExclusive: boolean;
  exclusiveBonus: number;
}

export interface Guild {
  id: string;
  name: string;
  themeColor: string;
  description: string;
  rivalGuildIds: string[];
}

export interface GuildReputation {
  guildId: string;
  reputation: number;
  level: GuildLevel;
}

export type GuildLevel = 'stranger' | 'acquaintance' | 'friend' | 'partner' | 'honored';

export interface Station {
  id: string;
  name: string;
  guildId: string;
  reputationRequired: number;
  themeColor: string;
  description: string;
}

export interface PlayerProfile {
  id: string;
  name: string;
  coins: number;
  reputation: number;
  level: number;
  unlockedStations: string[];
  guildReputations: GuildReputation[];
}

export interface GameState {
  board: (Candy | null)[][];
  selectedCandy: Position | null;
  score: number;
  moves: number;
  combo: number;
  maxCombo: number;
  train: Train;
  currentOrder: StationOrder | null;
  currentStationId: string;
  isAnimating: boolean;
  gamePhase: 'playing' | 'dispatching' | 'result' | 'gameover';
  dispatchResult: DispatchResult | null;
}

export interface GuildReputationChange {
  guildId: string;
  guildName: string;
  change: number;
  isRival: boolean;
}

export interface DispatchResult {
  success: boolean;
  matchRate: number;
  reward: number;
  penalty: number;
  mismatches: OrderItem[];
  correctItems: OrderItem[];
  reputationChange: number;
  guildReputationChanges: GuildReputationChange[];
}

export interface StatsStep {
  id: string;
  date: string;
  totalMoves: number;
  bestMoves: number;
  gamesPlayed: number;
}

export interface StatsCombo {
  id: string;
  date: string;
  totalCombos: number;
  maxCombo: number;
  avgCombo: number;
}

export interface StatsMismatch {
  id: string;
  date: string;
  mismatchCount: number;
  totalPenalty: number;
  dispatches: number;
}

export interface StatsUrgent {
  id: string;
  date: string;
  urgentCount: number;
  successCount: number;
  successRate: number;
}

export interface StatsReputation {
  id: string;
  date: string;
  reputation: number;
  changeAmount: number;
}

export interface AllStats {
  steps: StatsStep[];
  combos: StatsCombo[];
  mismatches: StatsMismatch[];
  urgents: StatsUrgent[];
  reputations: StatsReputation[];
}

export const BOARD_SIZE = 8;
export const BASIC_CANDY_TYPES: CandyType[] = ['strawberry', 'lemon', 'mint', 'blueberry', 'grape'];
