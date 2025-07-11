import React from 'react';
import { useRanking } from '../hooks';

export const RankingPage: React.FC = () => {
  const { ranking, loading, error } = useRanking();

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラー: {error}</div>;

  return (
    <div>
      <h2>キルレートランキング</h2>
      <table>
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
  );
};