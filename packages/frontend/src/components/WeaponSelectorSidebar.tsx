import type { FC } from 'react';
import { useState, useEffect } from 'react';
import type { Weapon, User } from '../types';
import { API_BASE_URL } from '../utils';
import './WeaponSelectorSidebar.css';

interface WeaponSelectorSidebarProps {
  user: User;
  onUserUpdate?: (updatedUser: User) => void;
}

export const WeaponSelectorSidebar: FC<WeaponSelectorSidebarProps> = ({ user, onUserUpdate }) => {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);

  // 武器画像のマッピング
  const weaponImages: Record<string, string> = {
    'hand': '/hand.svg',
    'weapon': '/weapon.svg',
    'spray': '/spray.svg',
    'electric_grid': '/electric_grid.svg'
  };

  // 武器一覧を取得
  useEffect(() => {
    const fetchWeapons = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/weapons`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('武器データの取得に失敗しました');
        }

        const weaponsData = await response.json();
        setWeapons(weaponsData);
      } catch (error) {
        console.error('Weapons fetch error:', error);
        setError('武器データの読み込みに失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchWeapons();
  }, []);

  // 武器選択処理
  const handleWeaponSelect = async (weaponId: number) => {
    if (selecting || weaponId === user.selectedWeaponId) return;

    setSelecting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/select-weapon`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ weaponId })
      });

      if (!response.ok) {
        throw new Error('武器の選択に失敗しました');
      }

      const data = await response.json();
      
      // ユーザー情報を更新
      if (onUserUpdate) {
        onUserUpdate(data.user);
      }
    } catch (error) {
      console.error('Weapon selection error:', error);
      setError('武器の選択に失敗しました');
    } finally {
      setSelecting(false);
    }
  };

  if (loading) {
    return (
      <div className="weapon-selector-sidebar">
        <h3>武器選択</h3>
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weapon-selector-sidebar">
        <h3>武器選択</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="weapon-selector-sidebar">
      <h3>武器選択</h3>
      <div className="weapons-list">
        {weapons.map((weapon) => {
          const isSelected = weapon.id === user.selectedWeaponId;
          const imageSrc = weapon.icon || weaponImages[weapon.type] || '/hand.svg';
          
          return (
            <button
              key={weapon.id}
              className={`weapon-button ${isSelected ? 'selected' : ''} ${selecting ? 'disabled' : ''}`}
              onClick={() => handleWeaponSelect(weapon.id)}
              disabled={selecting}
            >
              <div className="weapon-image-container">
                <img 
                  src={imageSrc} 
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
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
