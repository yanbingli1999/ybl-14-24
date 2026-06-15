import useGameStore from '@/store/useGameStore';
import { CANDY_CONFIG, STATIONS, GUILDS } from '@/data/config';
import { getCandyLoad } from '@/engine/loadingSystem';
import { getGuildByStationId, getGuildReputation, getGuildLevelConfig, calculatePreviewRewardPenalty } from '@/engine/guildSystem';
import { MapPin, Flame, Coins, AlertTriangle, Crown, Building2, TrendingUp, TrendingDown } from 'lucide-react';

export default function StationOrderPanel() {
  const { currentOrder, train, currentStationId, profile, changeStation } = useGameStore();

  if (!currentOrder) return null;

  const station = STATIONS.find(s => s.id === currentStationId);
  const guild = getGuildByStationId(currentStationId);
  const guildRep = guild ? getGuildReputation(profile.guildReputations, guild.id) : null;
  const guildLevelConfig = guildRep ? getGuildLevelConfig(guildRep.level) : null;
  const preview = currentOrder ? calculatePreviewRewardPenalty(currentOrder, profile.guildReputations) : null;
  const availableStations = STATIONS.filter(
    s => s.reputationRequired <= profile.reputation
  );

  return (
    <div
      className="rounded-2xl p-4 shadow-lg border-2"
      style={{
        background: `linear-gradient(135deg, ${station?.themeColor}15, ${station?.themeColor}05)`,
        borderColor: station?.themeColor + '40',
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-5 h-5" style={{ color: station?.themeColor }} />
        <h3 className="text-lg font-bold text-gray-800">{station?.name}</h3>
        {currentOrder.isExclusive && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold rounded-full">
            <Crown className="w-3 h-3" />
            专属
          </span>
        )}
        {currentOrder.isUrgent && (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
            <Flame className="w-3 h-3" />
            急单
          </span>
        )}
      </div>

      {guild && guildRep && guildLevelConfig && (
        <div className="mb-4 p-3 bg-white/60 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" style={{ color: guild.themeColor }} />
              <span className="text-sm font-semibold text-gray-700">{guild.name}</span>
            </div>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: guild.themeColor + '20', color: guild.themeColor }}
            >
              {guildLevelConfig.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((guildRep.reputation / 700) * 100, 100)}%`,
                  backgroundColor: guild.themeColor,
                }}
              />
            </div>
            <span className="text-xs text-gray-500 w-12 text-right">
              {guildRep.reputation}/700
            </span>
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              奖励 x{guildLevelConfig.rewardMultiplier.toFixed(1)}
            </span>
            <span className={`flex items-center gap-1 ${preview?.lowRep ? 'text-red-600 font-semibold' : ''}`}>
              <TrendingDown className="w-3 h-3" />
              罚金 x{preview?.penaltyMultiplier.toFixed(2)}
              {preview?.lowRep && <span className="text-red-500">(含低好感)</span>}
            </span>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">订单需求</h4>
        <div className="space-y-2">
          {currentOrder.items.map((item, index) => {
            const config = CANDY_CONFIG[item.candyType];
            const loaded = getCandyLoad(train, item.candyType);
            const progress = Math.min((loaded / item.quantity) * 100, 100);
            const isComplete = loaded >= item.quantity;

            return (
              <div key={index} className="flex items-center gap-3">
                <span className="text-xl">{config.emoji}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{config.name}</span>
                    <span className={isComplete ? 'text-green-600 font-bold' : 'text-gray-500'}>
                      {loaded}/{item.quantity}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: isComplete ? '#6BCB77' : config.color,
                      }}
                    />
                  </div>
                </div>
                {isComplete && <span className="text-green-500">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-yellow-600">
            <Coins className="w-4 h-4" />
            <span className="font-bold">
              +{preview?.previewReward ?? currentOrder.reward}
            </span>
          </div>
          <div className={`flex items-center gap-1 ${preview?.lowRep ? 'text-red-600' : 'text-red-500'}`}>
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold">罚金 -{preview?.previewPenalty ?? currentOrder.penalty}</span>
          </div>
        </div>

        {(preview && (preview.rewardMultiplier !== 1 || preview.penaltyMultiplier !== 1)) && (
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              基础 {currentOrder.reward}
              {preview.rewardMultiplier !== 1 && ` × ${preview.rewardMultiplier.toFixed(1)}`}
              {currentOrder.isUrgent && ` (+${currentOrder.urgentBonus}加急)`}
              {currentOrder.isExclusive && ` (+${currentOrder.exclusiveBonus}专属)`}
            </span>
            <span>
              基础 {currentOrder.penalty}
              {preview.penaltyMultiplier !== 1 && ` × ${preview.penaltyMultiplier.toFixed(2)}`}
            </span>
          </div>
        )}

        {preview?.lowRep && (
          <div className="p-2 bg-red-50 rounded-lg flex items-center gap-1 text-xs text-red-600">
            <AlertTriangle className="w-3 h-3" />
            <span>商会好感度过低，罚金已翻倍！</span>
          </div>
        )}
      </div>

      {availableStations.length > 1 && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">切换车站</h4>
          <div className="flex gap-2 flex-wrap">
            {availableStations.map(s => {
              const sGuild = GUILDS.find(g => g.id === s.guildId);
              return (
                <button
                  key={s.id}
                  onClick={() => changeStation(s.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1
                    ${s.id === currentStationId
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  style={
                    s.id === currentStationId
                      ? { backgroundColor: s.themeColor }
                      : {}
                  }
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: sGuild?.themeColor || s.themeColor }}
                  />
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
