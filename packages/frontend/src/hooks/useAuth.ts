import { useState, useEffect } from 'react';
import axios from 'axios';
import type { User, LoginResponse, RegisterResponse } from '../types';
import { API_BASE_URL, tokenStorage } from '../utils';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ページ読み込み時にトークンを確認
  useEffect(() => {
    const savedToken = tokenStorage.get();
    if (savedToken) {
      setToken(savedToken);
      fetchUserData(savedToken);
    }
  }, []);

  // ユーザー情報を取得
  const fetchUserData = async (authToken: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      tokenStorage.remove();
      setToken(null);
      return false;
    }
  };

  // ログイン処理
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<LoginResponse>(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      tokenStorage.set(newToken);
      return true;
    } catch (error: any) {
      setError(error.response?.data?.error || 'ログインに失敗しました');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 登録処理
  const register = async (email: string, name: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.post<RegisterResponse>(`${API_BASE_URL}/auth/register`, {
        email,
        name,
        password
      });

      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      tokenStorage.set(newToken);
      return true;
    } catch (error: any) {
      setError(error.response?.data?.error || '登録に失敗しました');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ログアウト処理
  const logout = () => {
    setUser(null);
    setToken(null);
    tokenStorage.remove();
  };

  // スコア更新API
  const updateScore = async (newKills: number, newDeaths: number) => {
    if (!token) return;
    
    try {
      await axios.put(`${API_BASE_URL}/auth/score`, {
        kills: newKills,
        deaths: newDeaths
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Failed to update score:', error);
    }
  };

  // ユーザー情報更新
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  // エラーをクリア
  const clearError = () => {
    setError(null);
  };

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateScore,
    updateUser,
    clearError,
    fetchUserData
  };
};
