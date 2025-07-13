import type { FC } from 'react';
import { useState } from 'react';
import type { LogEntry, User } from '../types';
import { ScoreBoard, ActionButtons, LogArea, Layout, KillStreakEffect, DeathStreakEffect, StaticWeaponSelector } from '../components';
import { useKillStreak } from '../hooks';
import { API_BASE_URL } from '../utils';
import './MainScreen.css';

interface MainScreenProps {
  user: User;
  logs: LogEntry[];
  onKill: () => void;
  onDeath: () => void;
}

export const MainScreen: FC<MainScreenProps> = ({
  user,
  logs,
  onKill,
  onDeath
}) => {
  // 武器選択状態
  const [selectedWeapon, setSelectedWeapon] = useState<string>('hand');

  const {
    streakCount,
    showEffect,
    deathStreakCount,
    showDeathEffect,
    registerKill,
    registerDeath,
    hideEffect,
    hideDeathEffect
  } = useKillStreak();

  // 武器選択ハンドラー
  const handleWeaponSelect = (weaponType: string) => {
    setSelectedWeapon(weaponType);
  };

  // キルアクションをキルストリークと連携（武器情報も含める）
  const handleKill = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/game/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          action: 'kill',
          weapon: selectedWeapon 
        })
      });

      if (response.ok) {
        // 既存のキル処理も呼び出す
        onKill();
        registerKill();
      } else {
        console.error('Kill recording failed');
      }
    } catch (error) {
      console.error('Kill recording error:', error);
      // エラーが発生してもゲームは続行
      onKill();
      registerKill();
    }
  };

  // デスアクションをデスストリークと連携
  const handleDeath = () => {
    onDeath();
    registerDeath();
  };

  return (
    <Layout>
      <div className="main-container">
        <header className="main-header">
          <h2>{user.name}'s Battle</h2>
        </header>

        <div className="main-content-layout">
          {/* ゲーム操作エリア */}
          <div className="game-area">
            <ScoreBoard 
              kills={user.kills} 
              deaths={user.deaths} 
              currentStreak={streakCount}
              currentDeathStreak={deathStreakCount}
            />
            <ActionButtons onKill={handleKill} onDeath={handleDeath} />
            <LogArea logs={logs} />
          </div>

          {/* 武器選択サイドバー */}
          <StaticWeaponSelector 
            onWeaponSelect={handleWeaponSelect}
            selectedWeapon={selectedWeapon}
          />
        </div>
        
        {/* キルストリークエフェクト */}
        <KillStreakEffect
          streakCount={streakCount}
          isVisible={showEffect}
          onAnimationEnd={hideEffect}
        />
        
        {/* デスストリークエフェクト */}
        <DeathStreakEffect
          streakCount={deathStreakCount}
          isVisible={showDeathEffect}
          onAnimationEnd={hideDeathEffect}
        />
      </div>
    </Layout>
  );
};