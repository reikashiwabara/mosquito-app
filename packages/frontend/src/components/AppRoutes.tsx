import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen, RegisterScreen, MainScreen, MyPage, RankingPage } from '../pages';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthContext } from './AuthProvider';

export const AppRoutes = () => {
  const { user, isLoading, error, login, register, logout, handleKill, handleDeath, logs } = useAuthContext();

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
      {/* ログイン画面 */}
      <Route 
        path="/login" 
        element={
          user ? (
            <Navigate to="/" replace />
          ) : (
            <LoginScreen 
              onLogin={handleLogin}
              onSwitchToRegister={() => {}} // React Router では Link を使用
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
            <Navigate to="/" replace />
          ) : (
            <RegisterScreen
              onRegister={handleRegister}
              onSwitchToLogin={() => {}} // React Router では Link を使用
              isLoading={isLoading}
              error={error}
            />
          )
        } 
      />

      {/* メイン画面（保護されたルート） */}
      <Route 
        path="/" 
        element={
          <ProtectedRoute user={user}>
            <MainScreen
              userName={user?.name || ''}
              kills={user?.kills || 0}
              deaths={user?.deaths || 0}
              logs={logs}
              onKill={handleKill}
              onDeath={handleDeath}
              onLogout={logout}
            />
          </ProtectedRoute>
        } 
      />

      {/* マイページ（保護されたルート） */}
      <Route 
        path="/mypage" 
        element={
          <ProtectedRoute user={user}>
            <MyPage
              user={user!}
              onLogout={logout}
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

      {/* デフォルトルート */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} />
    </Routes>
  );
};