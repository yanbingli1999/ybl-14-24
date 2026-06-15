import { useState } from 'react';
import StatusBar from '@/components/StatusBar/StatusBar';
import GameBoard from '@/components/Board/GameBoard';
import TrainPanel from '@/components/Train/TrainPanel';
import StationOrderPanel from '@/components/Station/StationOrderPanel';
import GuildPanel from '@/components/GuildPanel/GuildPanel';
import StatsPanel from '@/components/StatsPanel/StatsPanel';
import DispatchResultModal from '@/components/DispatchResultModal/DispatchResultModal';
import GameOverModal from '@/components/GameOverModal/GameOverModal';
import { getStationProgress } from '@/engine/contractSystem';
import useGameStore from '@/store/useGameStore';
import { Train, Candy, Building2, MapPin } from 'lucide-react';

export default function Home() {
  const { profile } = useGameStore();
  const { current, next, progress } = getStationProgress(profile.reputation);
  const [rightPanelTab, setRightPanelTab] = useState<'order' | 'guild'>('order');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-200/30 to-transparent pointer-events-none" />

      <div className="relative max-w-6xl mx-auto p-4 sm:p-6">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-2">
            🍬 糖果列车 🚂
          </h1>
          <p className="text-gray-500 text-sm">交换糖果，装满列车，送往各地！</p>
        </header>

        {next && (
          <div className="mb-4 p-3 bg-white/60 backdrop-blur rounded-xl shadow-sm">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">
                下一车站: <b className="text-purple-600">{next.name}</b>
              </span>
              <span className="text-gray-500">
                {profile.reputation} / {next.reputationRequired} 信誉
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <StatusBar />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex justify-center">
            <div>
              <div className="mb-3 flex items-center gap-2 text-gray-600">
                <Candy className="w-5 h-5" />
                <span className="font-medium">消除棋盘</span>
                <span className="text-xs text-gray-400 ml-auto">点击相邻糖果交换</span>
              </div>
              <GameBoard />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="mb-3 flex items-center gap-2 text-gray-600">
                <Train className="w-5 h-5" />
                <span className="font-medium">列车装载</span>
              </div>
              <TrainPanel />
            </div>

            <div className="flex rounded-xl bg-white/60 p-1 mb-3">
              <button
                onClick={() => setRightPanelTab('order')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
                  ${rightPanelTab === 'order' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MapPin className="w-4 h-4" />
                订单
              </button>
              <button
                onClick={() => setRightPanelTab('guild')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all
                  ${rightPanelTab === 'guild' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Building2 className="w-4 h-4" />
                商会
              </button>
            </div>

            {rightPanelTab === 'order' && <StationOrderPanel />}
            {rightPanelTab === 'guild' && <GuildPanel />}
          </div>
        </div>

        <div className="mt-8 p-4 bg-white/40 backdrop-blur rounded-xl">
          <h3 className="font-bold text-gray-700 mb-2">🎮 游戏说明</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 点击两个相邻的糖果进行交换，三个或更多相同糖果连成一线即可消除</li>
            <li>• 消除的糖果会自动装入对应的列车车厢</li>
            <li>• 观察车站订单需求，决定何时发车</li>
            <li>• 匹配度高获得奖励，错装会被扣除罚金</li>
            <li>• 完成订单获得信誉，解锁更多车站</li>
            <li>• 4连消生成炸弹糖（范围消除），5连消生成彩虹糖（消除同色）</li>
            <li>• <b className="text-indigo-600">商会系统：</b>每个车站属于一个商会，完成订单提升好感度</li>
            <li>• <b className="text-indigo-600">竞争关系：</b>成功完成订单会降低竞争商会的好感度</li>
            <li>• <b className="text-indigo-600">专属订单：</b>高好感度解锁专属订单，获得额外奖励</li>
            <li>• <b className="text-indigo-600">奖惩系数：</b>高好感提升奖励、降低罚金，低好感会加倍罚金</li>
          </ul>
        </div>

        <footer className="mt-6 text-center text-xs text-gray-400">
          糖果列车 © 2024 | 数据存储在本地浏览器中
        </footer>
      </div>

      <StatsPanel />
      <DispatchResultModal />
      <GameOverModal />
    </div>
  );
}
