import React, { useEffect, useState } from 'react';

type UserRanking = {
  id: number;
  name: string;
  kills: number;
  deaths: number;
  killRate: number;
};

export const RankingPage: React.FC = () => {
  const [ranking, setRanking] = useState<UserRanking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/ranking')
      .then(res => res.json())
      .then(data => {
        setRanking(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>読み込み中...</div>;

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