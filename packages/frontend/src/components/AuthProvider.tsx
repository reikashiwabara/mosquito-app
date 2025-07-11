import React, { createContext, useContext } from 'react';
import type { User } from '../types';
import { useAuth, useLogs } from '../hooks';
import { createLogMessage } from '../utils';

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
  const handleKill = () => {
    if (!user) return;
    
    const newKills = user.kills + 1;
    const updatedUser: User = { ...user, kills: newKills };
    updateUser(updatedUser);
    addLog(createLogMessage.kill(user.name));
    updateScore(newKills, user.deaths);
  };

  // Deathボタンの処理
  const handleDeath = () => {
    if (!user) return;
    
    const newDeaths = user.deaths + 1;
    const updatedUser: User = { ...user, deaths: newDeaths };
    updateUser(updatedUser);
    addLog(createLogMessage.death(user.name));
    updateScore(user.kills, newDeaths);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    error,
    logs,
    login,
    register,
    logout: () => {
      logout();
      clearLogs();
    },
    handleKill,
    handleDeath,
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
