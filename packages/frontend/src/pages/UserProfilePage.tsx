import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components';
import { calculateKDRatio, API_BASE_URL } from '../utils';
import './UserProfilePage.css';

interface UserProfile {
  id: number;
  name: string;
  kills: number;
  deaths: number;
  killRate: number;
  title?: string;
  profileImage?: string;
  selectedWeapon: string;
  joinedAt: string;
}

export const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setError('ユーザーIDが指定されていません');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('ユーザーが見つかりません');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError(err instanceof Error ? err.message : 'ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return (
      <Layout>
        <div className="user-profile-container">
          <div className="loading-message">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="user-profile-container">
          <div className="error-message">
            <h3>エラー</h3>
            <p>{error}</p>
            <button onClick={() => navigate('/ranking')} className="back-button">
              ランキングに戻る
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!userProfile) {
    return (
      <Layout>
        <div className="user-profile-container">
          <div className="error-message">ユーザー情報が見つかりません</div>
        </div>
      </Layout>
    );
  }

  const kdRatio = calculateKDRatio(userProfile.kills, userProfile.deaths);
  const joinedDate = new Date(userProfile.joinedAt).toLocaleDateString('ja-JP');

  return (
    <Layout>
      <div className="user-profile-container">
        <div className="profile-header">
          <button onClick={() => navigate(-1)} className="back-button">
            ← 戻る
          </button>
          <h2>ユーザープロフィール</h2>
        </div>

        <div className="profile-card">
          <div className="profile-info">
            <div className="profile-avatar">
              {userProfile.profileImage ? (
                <img src={userProfile.profileImage} alt={userProfile.name} />
              ) : (
                <div className="default-avatar">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="profile-details">
              <h1 className="username">{userProfile.name}</h1>
              {userProfile.title && (
                <div className="user-title">{userProfile.title}</div>
              )}
              <div className="join-date">参加日: {joinedDate}</div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card kills">
              <div className="stat-icon">🔪</div>
              <div className="stat-info">
                <div className="stat-value">{userProfile.kills}</div>
                <div className="stat-label">キル数</div>
              </div>
            </div>

            <div className="stat-card deaths">
              <div className="stat-icon">💀</div>
              <div className="stat-info">
                <div className="stat-value">{userProfile.deaths}</div>
                <div className="stat-label">デス数</div>
              </div>
            </div>

            <div className="stat-card kd-ratio">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-value">{kdRatio}</div>
                <div className="stat-label">K/D比</div>
              </div>
            </div>

            <div className="stat-card weapon">
              <div className="stat-icon">⚔️</div>
              <div className="stat-info">
                <div className="stat-value">{userProfile.selectedWeapon}</div>
                <div className="stat-label">使用武器</div>
              </div>
            </div>
          </div>

          <div className="achievement-section">
            <h3>実績</h3>
            <div className="achievements">
              {userProfile.kills >= 100 && (
                <div className="achievement">
                  <span className="achievement-icon">🏆</span>
                  <span className="achievement-name">ベテランハンター</span>
                  <span className="achievement-desc">100キル達成</span>
                </div>
              )}
              {userProfile.killRate >= 2 && (
                <div className="achievement">
                  <span className="achievement-icon">⭐</span>
                  <span className="achievement-name">エキスパート</span>
                  <span className="achievement-desc">K/D比2.0以上</span>
                </div>
              )}
              {userProfile.deaths <= 10 && userProfile.kills >= 20 && (
                <div className="achievement">
                  <span className="achievement-icon">🛡️</span>
                  <span className="achievement-name">サバイバー</span>
                  <span className="achievement-desc">低デス率の達人</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
