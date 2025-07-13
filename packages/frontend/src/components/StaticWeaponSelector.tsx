import type { FC } from 'react';
import './StaticWeaponSelector.css';

interface StaticWeaponSelectorProps {
  onWeaponSelect: (weaponType: string) => void;
  selectedWeapon: string;
}

export const StaticWeaponSelector: FC<StaticWeaponSelectorProps> = ({ 
  onWeaponSelect, 
  selectedWeapon 
}) => {
  // 静的な武器データ
  const weapons = [
    {
      type: 'hand',
      name: '素手',
      damage: 1,
      image: '/hand.svg'
    },
    {
      type: 'weapon',
      name: 'ハエたたき',
      damage: 2,
      image: '/weapon.svg'
    },
    {
      type: 'spray',
      name: '殺虫スプレー',
      damage: 3,
      image: '/spray.svg'
    },
    {
      type: 'electric_grid',
      name: '電撃殺虫器',
      damage: 5,
      image: '/electric_grid.svg'
    }
  ];

  return (
    <div className="static-weapon-selector">
      <h3>武器選択</h3>
      <div className="weapons-list">
        {weapons.map((weapon) => {
          const isSelected = weapon.type === selectedWeapon;
          
          return (
            <button
              key={weapon.type}
              className={`weapon-button ${isSelected ? 'selected' : ''}`}
              onClick={() => onWeaponSelect(weapon.type)}
            >
              <div className="weapon-image-container">
                <img 
                  src={weapon.image} 
                  alt={weapon.name}
                  className="weapon-image"
                />
                {isSelected && (
                  <div className="selected-overlay">
                    <span className="selected-text">選択中</span>
                  </div>
                )}
              </div>
              <div className="weapon-details">
                <span className="weapon-name">{weapon.name}</span>
                <span className="weapon-damage">ダメージ: {weapon.damage}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
