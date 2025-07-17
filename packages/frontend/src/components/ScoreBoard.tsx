import type { FC } from 'react';
import { calculateKDRatio } from '../utils';

interface ScoreBoardProps {
  kills: number;
  deaths: number;
  currentStreak?: number;
  currentDeathStreak?: number;
}

export const ScoreBoard: FC<ScoreBoardProps> = ({ 
  kills, 
  deaths, 
  currentStreak = 0,
  currentDeathStreak = 0 
}) => {
  const kdRatio = calculateKDRatio(kills, deaths);

  return (
    <div className="score-board">
      <div className="kd-ratio">
        <span>{kdRatio}</span> K/D
      </div>
      <div className="total-scores">
        <span>{kills} Kill</span>
        <span>{deaths} Death</span>
      </div>
      {currentStreak > 0 && (
        <div className="current-streak">
          <span className="streak-count">{currentStreak}</span>
          <span className="streak-label">キルストリーク</span>
        </div>
      )}
      {currentDeathStreak > 0 && (
        <div className="current-death-streak">
          <span className="death-streak-count">{currentDeathStreak}</span>
          <span className="death-streak-label">連続デス</span>
        </div>
      )}
    </div>
  );
};
