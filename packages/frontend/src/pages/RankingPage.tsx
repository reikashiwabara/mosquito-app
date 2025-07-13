import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRanking } from '../hooks';
import { Layout } from '../components';
import type { UserRanking, WeaponRanking } from '../types';
import './RankingPage.css';

type RankingTab = 'killRate' | 'kills' | 'deaths' | 'weapons';

export const RankingPage: React.FC = () => {
  const { rankingData, loading, error } = useRanking();
  const [activeTab, setActiveTab] = useState<RankingTab>('killRate');

  if (loading) return (
    <Layout>
      <div>読み込み中...</div>
    </Layout>
  );
  
  if (error) return (
    <Layout>
      <div>エラー: {error}</div>
    </Layout>
  );

  if (!rankingData) return (
    <Layout>
      <div>データがありません</div>
    </Layout>
  );

  const renderUserTable = (users: UserRanking[]) => (
    <table className="ranking-table">
      <thead>
        <tr>
          <th>順位</th>
          <th>ユーザー名</th>
          <th>称号</th>
          <th>キル数</th>
          <th>デス数</th>
          <th>キルレート</th>
          <th>使用武器</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <tr key={user.id} className={idx < 3 ? `rank-${idx + 1}` : ''}>
            <td className="rank-cell">{idx + 1}</td>
            <td className="name-cell">
              <Link to={`/user/${user.id}`} className="user-link">
                {user.name}
              </Link>
            </td>
            <td className="title-cell">{user.title || '-'}</td>
            <td className="kills-cell">{user.kills}</td>
            <td className="deaths-cell">{user.deaths}</td>
            <td className="killrate-cell">{user.killRate.toFixed(2)}</td>
            <td className="weapon-cell">{user.selectedWeapon || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderWeaponTable = (weapons: WeaponRanking[]) => (
    <div className="weapon-ranking">
      {weapons.map((weaponData, idx) => (
        <div key={weaponData.weapon} className="weapon-section">
          <h3>
            {idx + 1}位: {weaponData.weapon} 
            <span className="user-count">（使用者: {weaponData.userCount}人）</span>
          </h3>
          <table className="ranking-table small">
            <thead>
              <tr>
                <th>順位</th>
                <th>ユーザー名</th>
                <th>称号</th>
                <th>キルレート</th>
              </tr>
            </thead>
            <tbody>
              {weaponData.topUsers.map((user, userIdx) => (
                <tr key={user.id}>
                  <td>{userIdx + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.title || '-'}</td>
                  <td>{user.killRate.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="ranking-container">
        <h2>ランキング</h2>
        
        <div className="ranking-tabs">
          <button 
            className={`tab-button ${activeTab === 'killRate' ? 'active' : ''}`}
            onClick={() => setActiveTab('killRate')}
          >
            キルレート
          </button>
          <button 
            className={`tab-button ${activeTab === 'kills' ? 'active' : ''}`}
            onClick={() => setActiveTab('kills')}
          >
            キル数
          </button>
          <button 
            className={`tab-button ${activeTab === 'deaths' ? 'active' : ''}`}
            onClick={() => setActiveTab('deaths')}
          >
            デス数（少ない順）
          </button>
          <button 
            className={`tab-button ${activeTab === 'weapons' ? 'active' : ''}`}
            onClick={() => setActiveTab('weapons')}
          >
            使用武器
          </button>
        </div>

        <div className="ranking-content">
          {activeTab === 'killRate' && (
            <div>
              <h3>キルレートランキング</h3>
              {renderUserTable(rankingData.killRate)}
            </div>
          )}
          
          {activeTab === 'kills' && (
            <div>
              <h3>キル数ランキング</h3>
              {renderUserTable(rankingData.kills)}
            </div>
          )}
          
          {activeTab === 'deaths' && (
            <div>
              <h3>デス数ランキング（少ない順）</h3>
              {renderUserTable(rankingData.deaths)}
            </div>
          )}
          
          {activeTab === 'weapons' && (
            <div>
              <h3>武器別ランキング</h3>
              {renderWeaponTable(rankingData.weapons)}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};