import type { FC } from 'react';
import { Link } from 'react-router-dom';
import type { User } from '../types';
import { calculateKDRatio } from '../utils';

interface MyPageProps {
  user: User;
  onLogout: () => void;
}

export const MyPage: FC<MyPageProps> = ({ user, onLogout }) => {
  return (
    <div className="main-container">
      <header className="main-header">
        <h2>マイページ</h2>
        <Link to="/" className="back-button">戻る</Link>
      </header>

      <div className="user-info">
        <h3>{user.name}'s Profile</h3>
        <div className="stats">
          <div className="stat-item">
            <span className="stat-label">メールアドレス:</span>
            <span className="stat-value">{user.email}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">総キル数:</span>
            <span className="stat-value">{user.kills}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">総デス数:</span>
            <span className="stat-value">{user.deaths}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">K/D比:</span>
            <span className="stat-value">{calculateKDRatio(user.kills, user.deaths)}</span>
          </div>
        </div>
      </div>

      <div className="actions">
        <button className="logout-button" onClick={onLogout}>
          ログアウト
        </button>
      </div>
    </div>
  );
};
