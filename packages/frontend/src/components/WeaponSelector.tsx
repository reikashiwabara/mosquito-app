import type { FC } from 'react';
import { useState, useEffect } from 'react';
import type { Weapon, User } from '../types';
import { API_BASE_URL } from '../utils';
import './WeaponSelector.css';

interface WeaponSelectorProps {
  user: User;
  onUserUpdate?: (updatedUser: User) => void;
}

export const WeaponSelector: FC<WeaponSelectorProps> = ({ user, onUserUpdate }) => {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);

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
      <div className="weapon-selector">
        <h3>武器選択</h3>
        <div className="loading">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="weapon-selector">
        <h3>武器選択</h3>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="weapon-selector">
      <h3>武器選択</h3>
      <div className="weapons-grid">
        {weapons.map((weapon) => {
          const isSelected = weapon.id === user.selectedWeaponId;
          return (
            <div
              key={weapon.id}
              className={`weapon-card ${isSelected ? 'selected' : ''} ${selecting ? 'disabled' : ''}`}
              onClick={() => handleWeaponSelect(weapon.id)}
            >
              <div className="weapon-emoji">{weapon.emoji}</div>
              <div className="weapon-info">
                <div className="weapon-name">{weapon.name}</div>
                <div className="weapon-damage">ダメージ: {weapon.damage}</div>
              </div>
              {isSelected && (
                <div className="selected-indicator">
                  <span>選択中</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};
