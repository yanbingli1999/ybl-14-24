import { Guild, GuildReputation, GuildLevel, GuildReputationChange, StationOrder, DispatchResult } from '@/types';
import { GUILDS, GUILD_LEVEL_CONFIG, GUILD_REPUTATION_CONFIG, STATIONS, GAME_CONFIG } from '@/data/config';

export function getGuildById(guildId: string): Guild | undefined {
  return GUILDS.find(g => g.id === guildId);
}

export function getGuildByStationId(stationId: string): Guild | undefined {
  const station = STATIONS.find(s => s.id === stationId);
  if (!station) return undefined;
  return getGuildById(station.guildId);
}

export function getGuildReputation(guildReputations: GuildReputation[], guildId: string): GuildReputation {
  const existing = guildReputations.find(gr => gr.guildId === guildId);
  if (existing) return existing;
  return { guildId, reputation: 0, level: 'stranger' };
}

export function calculateGuildLevel(reputation: number): GuildLevel {
  const levels: GuildLevel[] = ['stranger', 'acquaintance', 'friend', 'partner', 'honored'];
  for (let i = levels.length - 1; i >= 0; i--) {
    const level = levels[i];
    if (reputation >= GUILD_LEVEL_CONFIG[level].minReputation) {
      return level;
    }
  }
  return 'stranger';
}

export function initializeGuildReputations(): GuildReputation[] {
  return GUILDS.map(guild => ({
    guildId: guild.id,
    reputation: 0,
    level: 'stranger' as GuildLevel,
  }));
}

export function updateGuildReputation(
  guildReputations: GuildReputation[],
  guildId: string,
  change: number
): GuildReputation[] {
  return guildReputations.map(gr => {
    if (gr.guildId !== guildId) return gr;
    const newReputation = Math.max(0, gr.reputation + change);
    return {
      ...gr,
      reputation: newReputation,
      level: calculateGuildLevel(newReputation),
    };
  });
}

export function calculateGuildReputationChanges(
  order: StationOrder,
  success: boolean,
  matchRate: number
): GuildReputationChange[] {
  const changes: GuildReputationChange[] = [];
  const guild = getGuildById(order.guildId);
  if (!guild) return changes;

  let baseChange: number;
  if (success) {
    baseChange = GUILD_REPUTATION_CONFIG.BASE_SUCCESS_GAIN;
    if (order.isExclusive) {
      baseChange = Math.floor(baseChange * GUILD_REPUTATION_CONFIG.EXCLUSIVE_BONUS_MULTIPLIER);
    }
    baseChange = Math.floor(baseChange * (0.5 + matchRate * 0.5));
  } else {
    baseChange = -GUILD_REPUTATION_CONFIG.BASE_FAIL_LOSS;
  }

  changes.push({
    guildId: guild.id,
    guildName: guild.name,
    change: baseChange,
    isRival: false,
  });

  guild.rivalGuildIds.forEach(rivalGuildId => {
    const rivalGuild = getGuildById(rivalGuildId);
    if (rivalGuild) {
      const rivalChange = success
        ? -Math.floor(Math.abs(baseChange) * GUILD_REPUTATION_CONFIG.RIVAL_DECAY_RATE)
        : 0;

      if (rivalChange !== 0) {
        changes.push({
          guildId: rivalGuildId,
          guildName: rivalGuild.name,
          change: rivalChange,
          isRival: true,
        });
      }
    }
  });

  return changes;
}

export function applyGuildReputationChanges(
  guildReputations: GuildReputation[],
  changes: GuildReputationChange[]
): GuildReputation[] {
  let updated = [...guildReputations];
  changes.forEach(change => {
    updated = updateGuildReputation(updated, change.guildId, change.change);
  });
  return updated;
}

export function getGuildLevelConfig(level: GuildLevel) {
  return GUILD_LEVEL_CONFIG[level];
}

export function getRewardMultiplier(guildReputations: GuildReputation[], guildId: string): number {
  const rep = getGuildReputation(guildReputations, guildId);
  return GUILD_LEVEL_CONFIG[rep.level].rewardMultiplier;
}

export function getPenaltyMultiplier(guildReputations: GuildReputation[], guildId: string): number {
  const rep = getGuildReputation(guildReputations, guildId);
  let multiplier = GUILD_LEVEL_CONFIG[rep.level].penaltyMultiplier;

  if (rep.reputation < GUILD_REPUTATION_CONFIG.LOW_REPUTATION_PENALTY_THRESHOLD) {
    multiplier *= GUILD_REPUTATION_CONFIG.LOW_REPUTATION_PENALTY_MULTIPLIER;
  }

  return multiplier;
}

export function canGetExclusiveOrder(guildReputations: GuildReputation[], guildId: string): boolean {
  const rep = getGuildReputation(guildReputations, guildId);
  const config = GUILD_LEVEL_CONFIG[rep.level];
  return Math.random() < config.exclusiveChance;
}

export function getRivalGuilds(guildId: string): Guild[] {
  const guild = getGuildById(guildId);
  if (!guild) return [];
  return guild.rivalGuildIds.map(id => getGuildById(id)).filter((g): g is Guild => g !== undefined);
}

export function getGuildStations(guildId: string) {
  return STATIONS.filter(s => s.guildId === guildId);
}

export function getEffectivePenaltyMultiplier(guildReputations: GuildReputation[], guildId: string): number {
  const rep = getGuildReputation(guildReputations, guildId);
  let multiplier = GUILD_LEVEL_CONFIG[rep.level].penaltyMultiplier;
  if (rep.reputation < GUILD_REPUTATION_CONFIG.LOW_REPUTATION_PENALTY_THRESHOLD) {
    multiplier *= GUILD_REPUTATION_CONFIG.LOW_REPUTATION_PENALTY_MULTIPLIER;
  }
  return multiplier;
}

export function isLowReputation(guildReputations: GuildReputation[], guildId: string): boolean {
  const rep = getGuildReputation(guildReputations, guildId);
  return rep.reputation < GUILD_REPUTATION_CONFIG.LOW_REPUTATION_PENALTY_THRESHOLD;
}

export function calculatePreviewRewardPenalty(
  order: StationOrder,
  guildReputations: GuildReputation[]
): { previewReward: number; previewPenalty: number; rewardMultiplier: number; penaltyMultiplier: number; lowRep: boolean } {
  const rewardMultiplier = getRewardMultiplier(guildReputations, order.guildId);
  const penaltyMultiplier = getEffectivePenaltyMultiplier(guildReputations, order.guildId);
  const lowRep = isLowReputation(guildReputations, order.guildId);

  const previewReward = Math.floor(order.reward * rewardMultiplier)
    + (order.isUrgent ? Math.floor(order.reward * GAME_CONFIG.URGENT_BONUS_RATE) : 0)
    + (order.isExclusive ? order.exclusiveBonus : 0);

  const previewPenalty = Math.floor(order.penalty * penaltyMultiplier);

  return { previewReward, previewPenalty, rewardMultiplier, penaltyMultiplier, lowRep };
}
