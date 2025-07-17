import type { FC } from 'react';
import { useState, useRef } from 'react';
import type { User } from '../types';
import { calculateKDRatio, API_BASE_URL } from '../utils';
import { StatsChart, Layout, WeaponSelector } from '../components';

interface MyPageProps {
  user: User;
  onUserUpdate?: (updatedUser: User) => void;
}

export const MyPage: FC<MyPageProps> = ({ user, onUserUpdate }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // プロフィール写真をクリックした時の処理
  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  // ファイル選択時の処理
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（5MB制限）
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ファイルサイズは5MB以下にしてください');
      return;
    }

    // ファイル形式チェック
    if (!file.type.startsWith('image/')) {
      setUploadError('画像ファイルを選択してください');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // ファイルをBase64に変換
      const base64 = await convertToBase64(file);
      
      // APIでプロフィール画像を更新
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          profileImage: base64
        })
      });

      if (!response.ok) {
        throw new Error('プロフィール画像の更新に失敗しました');
      }

      const data = await response.json();
      
      // ユーザー情報を更新
      if (onUserUpdate) {
        onUserUpdate(data.user);
      }
    } catch (error) {
      console.error('Profile image upload error:', error);
      setUploadError('画像のアップロードに失敗しました');
    } finally {
      setIsUploading(false);
    }
  };

  // ファイルをBase64に変換する関数
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // 称号生成の処理
  const handleGenerateTitle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/generate-title`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('称号の生成に失敗しました');
      }

      const data = await response.json();
      
      // ユーザー情報を更新
      if (onUserUpdate) {
        onUserUpdate(data.user);
      }
      
      alert(`新しい称号「${data.title}」が生成されました！`);
    } catch (error) {
      console.error('Title generation error:', error);
      alert('称号の生成に失敗しました');
    }
  };

  return (
    <Layout>
      <div className="mypage-container">
        <header className="mypage-header">
          <h2>マイページ</h2>
        </header>

        <div className="mypage-content">
          {/* プロフィールセクション */}
          <div className="profile-section">
            {/* 隠れたファイル入力 */}
            <input
              ref={fileInputRef}
              type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          <div 
            className={`profile-picture ${isUploading ? 'uploading' : ''}`}
            onClick={handleProfilePictureClick}
            title="クリックしてプロフィール写真を変更"
          >
            {isUploading ? (
              <div className="upload-spinner">アップロード中...</div>
            ) : user.profileImage ? (
              <img src={user.profileImage} alt="プロフィール写真" />
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <span className="upload-text">写真を追加</span>
              </div>
            )}
          </div>
          
          {uploadError && (
            <div className="upload-error">
              {uploadError}
            </div>
          )}
          
          <div className="user-name-card">
            <h3>{user.name}</h3>
            {user.title && (
              <div className="user-title">
                <span className="title-label">称号:</span>
                <span className="title-value">{user.title}</span>
              </div>
            )}
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
              <button className="bedlock-button" onClick={handleGenerateTitle}>
                称号を生成
              </button>
            </div>

            <StatsChart userId={user.id} />
          </div>
        </div>
      </div>
    </Layout>
  );
};
