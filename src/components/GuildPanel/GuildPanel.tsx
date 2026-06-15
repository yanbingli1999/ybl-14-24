import useGameStore from '@/store/useGameStore';
import { GUILDS } from '@/data/config';
import { getGuildLevelConfig, getRivalGuilds, getGuildStations, getEffectivePenaltyMultiplier, isLowReputation } from '@/engine/guildSystem';
import { Building2, Swords, AlertTriangle } from 'lucide-react';

export default function GuildPanel() {
  const { profile } = useGameStore();

  return (
    <div className="rounded-2xl p-4 shadow-lg border-2 bg-white/80 border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-gray-800">商会关系</h3>
      </div>

      <div className="space-y-4">
        {GUILDS.map(guild => {
          const rep = profile.guildReputations.find(gr => gr.guildId === guild.id);
          if (!rep) return null;

          const levelConfig = getGuildLevelConfig(rep.level);
          const rivals = getRivalGuilds(guild.id);
          const stations = getGuildStations(guild.id);
          const effectivePenaltyMult = getEffectivePenaltyMultiplier(profile.guildReputations, guild.id);
          const lowRep = isLowReputation(profile.guildReputations, guild.id);

          return (
            <div
              key={guild.id}
              className="p-3 rounded-xl"
              style={{ backgroundColor: guild.themeColor + '10' }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: guild.themeColor }}
                  />
                  <span className="font-semibold text-gray-800">{guild.name}</span>
                </div>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: guild.themeColor + '25', color: guild.themeColor }}
                >
                  {levelConfig.name}
                </span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((rep.reputation / 700) * 100, 100)}%`,
                      backgroundColor: guild.themeColor,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">
                  {rep.reputation}/700
                </span>
              </div>

              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>奖励 x{levelConfig.rewardMultiplier.toFixed(1)}</span>
                <span className={lowRep ? 'text-red-600 font-semibold' : ''}>
                  罚金 x{effectivePenaltyMult.toFixed(2)}
                  {lowRep && <span className="text-red-500 ml-1">(含低好感)</span>}
                </span>
                <span>专属订单 {Math.round(levelConfig.exclusiveChance * 100)}%</span>
              </div>

              {lowRep && (
                <div className="flex items-center gap-1 text-xs text-red-600 mb-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>好感过低，罚金已翻倍！</span>
                </div>
              )}

              {stations.length > 0 && (
                <div className="text-xs text-gray-500 mb-1">
                  <span className="text-gray-600">旗下车站: </span>
                  {stations.map(s => s.name).join('、')}
                </div>
              )}

              {rivals.length > 0 && (
                <div className="flex items-center gap-1 text-xs text-orange-600">
                  <Swords className="w-3 h-3" />
                  <span>竞争: {rivals.map(r => r.name).join('、')}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
        <div className="font-semibold text-gray-700 mb-1">💡 关系说明</div>
        <ul className="space-y-1">
          <li>• 完成订单提升所属商会好感</li>
          <li>• 高好感解锁专属订单、提高奖励</li>
          <li>• 好感低于30时罚金翻倍</li>
          <li>• 成功完成订单会降低竞争商会好感</li>
        </ul>
      </div>
    </div>
  );
}
