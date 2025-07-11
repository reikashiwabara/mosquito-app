import type { FC } from 'react';
import { calculateKDRatio } from '../utils';

interface ScoreBoardProps {
  kills: number;
  deaths: number;
}

export const ScoreBoard: FC<ScoreBoardProps> = ({ kills, deaths }) => {
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
    </div>
  );
};
