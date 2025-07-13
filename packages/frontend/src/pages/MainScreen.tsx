import type { FC } from 'react';
import type { LogEntry } from '../types';
import { ScoreBoard, ActionButtons, LogArea, Layout, KillStreakEffect, DeathStreakEffect } from '../components';
import { useKillStreak } from '../hooks';

interface MainScreenProps {
  userName: string;
  kills: number;
  deaths: number;
  logs: LogEntry[];
  onKill: () => void;
  onDeath: () => void;
  onLogout: () => void;
}

export const MainScreen: FC<MainScreenProps> = ({
  userName,
  kills,
  deaths,
  logs,
  onKill,
  onDeath,
  onLogout
}) => {
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

  // キルアクションをキルストリークと連携
  const handleKill = () => {
    onKill();
    registerKill();
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
          <h2>{userName}'s Battle</h2>
        </header>

        <ScoreBoard 
          kills={kills} 
          deaths={deaths} 
          currentStreak={streakCount}
          currentDeathStreak={deathStreakCount}
        />
        <ActionButtons onKill={handleKill} onDeath={handleDeath} />
        <LogArea logs={logs} />
        
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