import { CandyType, Station, Train, BOARD_SIZE, Guild, GuildLevel } from '@/types';

export const CANDY_CONFIG: Record<CandyType, { name: string; color: string; points: number; emoji: string }> = {
  strawberry: { name: '草莓糖', color: '#FF6B9D', points: 10, emoji: '🍓' },
  lemon: { name: '柠檬糖', color: '#FFD93D', points: 10, emoji: '🍋' },
  mint: { name: '薄荷糖', color: '#6BCB77', points: 10, emoji: '🍀' },
  blueberry: { name: '蓝莓糖', color: '#4D96FF', points: 10, emoji: '🫐' },
  grape: { name: '葡萄糖', color: '#9B59B6', points: 10, emoji: '🍇' },
  rainbow: { name: '彩虹糖', color: 'linear-gradient(135deg, #FF6B9D, #FFD93D, #6BCB77, #4D96FF, #9B59B6)', points: 50, emoji: '🌈' },
  bomb: { name: '炸弹糖', color: '#FF4757', points: 30, emoji: '💣' },
};

export const GUILDS: Guild[] = [
  {
    id: 'strawberry-sweet',
    name: '草莓甜心商会',
    themeColor: '#FF6B9D',
    description: '甜美浪漫的糖果商会，主打草莓系列产品',
    rivalGuildIds: ['lemon-sunshine'],
  },
  {
    id: 'lemon-sunshine',
    name: '柠檬阳光联盟',
    themeColor: '#FFD93D',
    description: '活力四射的联盟，以清爽柠檬和薄荷闻名',
    rivalGuildIds: ['blueberry-grape'],
  },
  {
    id: 'blueberry-grape',
    name: '蓝莓葡萄商会',
    themeColor: '#9B59B6',
    description: '高贵典雅的高端商会，经营珍稀浆果',
    rivalGuildIds: ['strawberry-sweet'],
  },
];

export const STATIONS: Station[] = [
  {
    id: 'candy-town',
    name: '糖果小镇',
    guildId: 'strawberry-sweet',
    reputationRequired: 0,
    themeColor: '#FF6B9D',
    description: '甜蜜的起点，适合新手列车长',
  },
  {
    id: 'lemon-estate',
    name: '柠檬庄园',
    guildId: 'lemon-sunshine',
    reputationRequired: 100,
    themeColor: '#FFD93D',
    description: '酸爽的柠檬订单，需要更多技巧',
  },
  {
    id: 'mint-forest',
    name: '薄荷森林',
    guildId: 'lemon-sunshine',
    reputationRequired: 300,
    themeColor: '#6BCB77',
    description: '急单频发的森林车站',
  },
  {
    id: 'blueberry-port',
    name: '蓝莓港口',
    guildId: 'blueberry-grape',
    reputationRequired: 600,
    themeColor: '#4D96FF',
    description: '大额订单的港口贸易站',
  },
  {
    id: 'grape-castle',
    name: '葡萄城堡',
    guildId: 'blueberry-grape',
    reputationRequired: 1000,
    themeColor: '#9B59B6',
    description: '皇家级别的复杂订单',
  },
];

export const GUILD_LEVEL_CONFIG: Record<GuildLevel, { minReputation: number; name: string; rewardMultiplier: number; penaltyMultiplier: number; exclusiveChance: number }> = {
  stranger: { minReputation: 0, name: '陌生人', rewardMultiplier: 1.0, penaltyMultiplier: 1.0, exclusiveChance: 0 },
  acquaintance: { minReputation: 50, name: '熟人', rewardMultiplier: 1.1, penaltyMultiplier: 0.9, exclusiveChance: 0 },
  friend: { minReputation: 150, name: '朋友', rewardMultiplier: 1.2, penaltyMultiplier: 0.75, exclusiveChance: 0.15 },
  partner: { minReputation: 350, name: '伙伴', rewardMultiplier: 1.35, penaltyMultiplier: 0.5, exclusiveChance: 0.3 },
  honored: { minReputation: 700, name: '贵宾', rewardMultiplier: 1.5, penaltyMultiplier: 0.25, exclusiveChance: 0.5 },
};

export const GUILD_REPUTATION_CONFIG = {
  BASE_SUCCESS_GAIN: 15,
  BASE_FAIL_LOSS: 10,
  RIVAL_DECAY_RATE: 0.5,
  EXCLUSIVE_BONUS_MULTIPLIER: 1.5,
  LOW_REPUTATION_PENALTY_THRESHOLD: 30,
  LOW_REPUTATION_PENALTY_MULTIPLIER: 2.0,
};

export const INITIAL_TRAIN: Train = {
  id: 'candy-express',
  name: '糖果快车',
  carriages: [
    { id: 'car-1', candyType: 'strawberry', capacity: 20, currentLoad: 0 },
    { id: 'car-2', candyType: 'lemon', capacity: 20, currentLoad: 0 },
    { id: 'car-3', candyType: 'mint', capacity: 20, currentLoad: 0 },
    { id: 'car-4', candyType: 'blueberry', capacity: 20, currentLoad: 0 },
    { id: 'car-5', candyType: 'grape', capacity: 20, currentLoad: 0 },
  ],
};

export const GAME_CONFIG = {
  BOARD_SIZE,
  INITIAL_MOVES: 30,
  COMBO_BONUS_MULTIPLIER: 0.5,
  MATCH_MIN: 3,
  FOUR_MATCH_SPECIAL: 'bomb' as const,
  FIVE_MATCH_SPECIAL: 'rainbow' as const,
  DISPATCH_BASE_REWARD: 50,
  MISMATCH_PENALTY_RATE: 0.3,
  URGENT_BONUS_RATE: 0.5,
  REPUTATION_PER_SUCCESS: 10,
  REPUTATION_PER_FAIL: -5,
  LOAD_PER_MATCH: 1,
};
