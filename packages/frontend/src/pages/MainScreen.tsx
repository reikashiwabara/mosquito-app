import type { FC } from 'react';
import type { LogEntry } from '../types';
import { ScoreBoard, ActionButtons, LogArea, Layout, KillStreakEffect } from '../components';
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
    registerKill,
    registerDeath,
    hideEffect
  } = useKillStreak();

  // キルアクションをキルストリークと連携
  const handleKill = () => {
    onKill();
    registerKill();
  };

  // デスアクションをキルストリークと連携
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

        <ScoreBoard kills={kills} deaths={deaths} currentStreak={streakCount} />
        <ActionButtons onKill={handleKill} onDeath={handleDeath} />
        <LogArea logs={logs} />
        
        {/* キルストリークエフェクト */}
        <KillStreakEffect
          streakCount={streakCount}
          isVisible={showEffect}
          onAnimationEnd={hideEffect}
        />
      </div>
    </Layout>
  );
};