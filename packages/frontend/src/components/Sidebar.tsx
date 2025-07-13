import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from './AuthProvider';
import '../styles/sidebar.css';

export const Sidebar: FC = () => {
  const location = useLocation();
  const { logout } = useAuthContext();

  const handleLogout = () => {
    console.log('ログアウトボタンが押されました');
    try {
      logout();
      console.log('ログアウト処理完了');
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'sidebar-item active' : 'sidebar-item';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h3>蚊叩きアプリ</h3>
      </div>
      
      <nav className="sidebar-nav">
        <Link to="/main" className={isActive('/main')}>
          <span className="sidebar-icon">🏠</span>
          メイン
        </Link>
        
        <Link to="/mypage" className={isActive('/mypage')}>
          <span className="sidebar-icon">👤</span>
          マイページ
        </Link>
        
        <Link to="/ranking" className={isActive('/ranking')}>
          <span className="sidebar-icon">🏆</span>
          ランキング
        </Link>

        {/* 将来のページ用 */}
        <Link to="/stats" className={isActive('/stats')}>
          <span className="sidebar-icon">📊</span>
          統計
        </Link>
        
        <Link to="/settings" className={isActive('/settings')}>
          <span className="sidebar-icon">⚙️</span>
          設定
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span className="sidebar-icon">🚪</span>
          ログアウト
        </button>
      </div>
    </div>
  );
};
