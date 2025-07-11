import type { FC } from 'react';
import killImage from '../assets/kill.png';
import deathImage from '../assets/death.png';

interface ActionButtonsProps {
  onKill: () => void;
  onDeath: () => void;
}

export const ActionButtons: FC<ActionButtonsProps> = ({ onKill, onDeath }) => {
  return (
    <div className="actions-container">
      <button className="action-button" onClick={onKill}>
        <img src={killImage} alt="Kill" className="character-img" />
        <span>Kill</span>
      </button>
      <button className="action-button" onClick={onDeath}>
        <img src={deathImage} alt="Death" className="character-img" />
        <span>Death</span>
      </button>
    </div>
  );
};
