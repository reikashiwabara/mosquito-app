import type { FC } from 'react';
import type { LogEntry } from '../types';
import { ScoreBoard, ActionButtons, LogArea, Layout } from '../components';

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
  return (
    <Layout>
      <div className="main-container">
        <header className="main-header">
          <h2>{userName}'s Battle</h2>
        </header>

        <ScoreBoard kills={kills} deaths={deaths} />
        <ActionButtons onKill={onKill} onDeath={onDeath} />
        <LogArea logs={logs} />
      </div>
    </Layout>
  );
};