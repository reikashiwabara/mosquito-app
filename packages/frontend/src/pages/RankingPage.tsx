import React from 'react';
import { useRanking } from '../hooks';
import { Layout } from '../components';

export const RankingPage: React.FC = () => {
  const { ranking, loading, error } = useRanking();

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

  return (
    <Layout>
      <div className="ranking-container">
        <h2>キルレートランキング</h2>
        <table className="ranking-table">
          <thead>
            <tr>
              <th>順位</th>
              <th>ユーザー名</th>
              <th>キル数</th>
              <th>デス数</th>
              <th>キルレート</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((user, idx) => (
              <tr key={user.id}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.kills}</td>
                <td>{user.deaths}</td>
                <td>{user.killRate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};