import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { LogEntry } from '../types';
import { ScoreBoard, ActionButtons, LogArea } from '../components';

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
    <div className="main-container">
      <header className="main-header">
        <h2>{userName}'s Battle</h2>
        <button className="logout-button" onClick={onLogout}>
          ログアウト
        </button>
      </header>

      <ScoreBoard kills={kills} deaths={deaths} />
      <ActionButtons onKill={onKill} onDeath={onDeath} />
      <LogArea logs={logs} />
      <Link to="/mypage">マイページ</Link>
    </div>
  );
};
