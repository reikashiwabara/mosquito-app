import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen, RegisterScreen, MainScreen, MyPage, RankingPage, StatsPage, SettingsPage } from '../pages';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthContext } from './AuthProvider';

export const AppRoutes = () => {
  const { user, isLoading, error, login, register, logout, handleKill, handleDeath, logs, updateUserProfile } = useAuthContext();

  console.log('AppRoutes: 現在のユーザー状態:', user);
  console.log('AppRoutes: 現在のパス:', window.location.pathname);

  // ログイン処理
  const handleLogin = async (email: string, password: string) => {
    const success = await login(email, password);
    // React Router では自動的にリダイレクトされるため、手動での画面遷移は不要
    return success;
  };

  // 登録処理
  const handleRegister = async (email: string, name: string, password: string) => {
    const success = await register(email, name, password);
    // React Router では自動的にリダイレクトされるため、手動での画面遷移は不要
    return success;
  };

  return (
    <Routes>
      {/* ルートパス */}
      <Route 
        path="/" 
        element={<Navigate to={user ? "/main" : "/login"} replace />} 
      />

      {/* ログイン画面 */}
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to="/main" replace />
          ) : (
            <LoginScreen 
              onLogin={handleLogin}
              isLoading={isLoading}
              error={error}
            />
          )
        } 
      />

      {/* 登録画面 */}
      <Route 
        path="/register" 
        element={
          user ? (
            <Navigate to="/main" replace />
          ) : (
            <RegisterScreen
              onRegister={handleRegister}
              isLoading={isLoading}
              error={error}
            />
          )
        } 
      />

      {/* メイン画面（保護されたルート） */}
      <Route 
        path="/main" 
        element={
          <ProtectedRoute user={user}>
            <MainScreen
              user={user!}
              logs={logs}
              onKill={handleKill}
              onDeath={handleDeath}
              onLogout={logout}
              onUserUpdate={updateUserProfile}
            />
          </ProtectedRoute>
        } 
      />

      {/* ルートパスは /main にリダイレクト */}
      <Route 
        path="/" 
        element={<Navigate to="/main" replace />}
      />

      {/* マイページ（保護されたルート） */}
      <Route 
        path="/mypage" 
        element={
          <ProtectedRoute user={user}>
            <MyPage
              user={user!}
              onUserUpdate={updateUserProfile}
            />
          </ProtectedRoute>
        } 
      />

      {/* ランキングページ（保護されたルート） */}
      <Route 
        path="/ranking"
        element={
          <ProtectedRoute user={user}>
            <RankingPage />
          </ProtectedRoute>
        }
      />

      {/* 統計ページ（保護されたルート） */}
      <Route 
        path="/stats"
        element={
          <ProtectedRoute user={user}>
            <StatsPage />
          </ProtectedRoute>
        }
      />

      {/* 設定ページ（保護されたルート） */}
      <Route 
        path="/settings"
        element={
          <ProtectedRoute user={user}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* デフォルトルート */}
      <Route path="*" element={
        (() => {
          const destination = user ? "/main" : "/login";
          console.log('AppRoutes: デフォルトルート - リダイレクト先:', destination);
          return <Navigate to={destination} replace />;
        })()
      } />
    </Routes>
  );
};