import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';
import { useAuth, useLogs } from '../hooks';
import { createLogMessage, API_BASE_URL } from '../utils';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  logs: any[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, name: string, password: string) => Promise<boolean>;
  logout: () => void;
  handleKill: () => void;
  handleDeath: () => void;
  updateUserProfile: (updatedUser: User) => void;
  clearError: () => void;
  addLog: (message: string) => void;
  clearLogs: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateScore,
    updateUser,
    clearError
  } = useAuth();

  const { logs, addLog, clearLogs } = useLogs();

  // Killボタンの処理
  const handleKill = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/game/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'kill' })
      });

      if (response.ok) {
        const newKills = user.kills + 1;
        const updatedUser: User = { ...user, kills: newKills };
        updateUser(updatedUser);
        addLog(createLogMessage.kill(user.name));
        updateScore(newKills, user.deaths);
      } else {
        console.error('Kill記録に失敗しました');
      }
    } catch (error) {
      console.error('Kill記録エラー:', error);
    }
  };

  // Deathボタンの処理
  const handleDeath = async () => {
    if (!user) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/game/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'death' })
      });

      if (response.ok) {
        const newDeaths = user.deaths + 1;
        const updatedUser: User = { ...user, deaths: newDeaths };
        updateUser(updatedUser);
        addLog(createLogMessage.death(user.name));
        updateScore(user.kills, newDeaths);
      } else {
        console.error('Death記録に失敗しました');
      }
    } catch (error) {
      console.error('Death記録エラー:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    logs,
    login,
    register,
    logout: () => {
      console.log('AuthProvider: ログアウト処理開始');
      logout();
      clearLogs();
      console.log('AuthProvider: ログアウト処理完了、ナビゲート実行');
      
      // React Routerのナビゲートを使用
      setTimeout(() => {
        console.log('AuthProvider: navigate(/login)実行');
        navigate('/login', { replace: true });
      }, 100);
      
      // バックアップとしてwindow.location.replaceも実行
      setTimeout(() => {
        console.log('AuthProvider: window.location.replace実行 (バックアップ)');
        window.location.replace('/login');
      }, 200);
    },
    handleKill,
    handleDeath,
    updateUserProfile: updateUser,
    clearError,
    addLog,
    clearLogs
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
