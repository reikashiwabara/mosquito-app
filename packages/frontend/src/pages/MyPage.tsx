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
    <div className="mypage-container">
      <header className="mypage-header">
        <h2>マイページ</h2>
        <Link to="/" className="back-button">戻る</Link>
      </header>

      <div className="mypage-content">
        {/* プロフィールセクション */}
        <div className="profile-section">
          <div className="profile-picture">
            プロフィール写真
          </div>
          
          <div className="user-name-card">
            <h3>名前</h3>
          </div>
          
          <div className="user-details-card">
            <div className="stats">
              <div className="stat-item">
                <span className="stat-label">メールアドレス</span>
                <span className="stat-value">{user.email}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">総キル数</span>
                <span className="stat-value">{user.kills}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">総デス数</span>
                <span className="stat-value">{user.deaths}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">K/D比:</span>
                <span className="stat-value">{calculateKDRatio(user.kills, user.deaths)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* グラフセクション */}
        <div className="charts-section">
          <div className="bedlock-generator">
            <h3>bedlockで称号を生成</h3>
            <button className="bedlock-button">
              称号を生成
            </button>
          </div>

          <div className="charts-container">
            <div className="charts-header">
              <h3>グラフ</h3>
            </div>
            <ul className="chart-list">
              <li>直近一時間のデス棒グラフ</li>
              <li>直近1時間のキル棒グラフ</li>
            </ul>
            <div className="chart-placeholder">
              グラフエリア（後で実装予定）
            </div>
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
