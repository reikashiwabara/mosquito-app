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
    console.log('useAuth: useEffect実行 - トークン確認開始');
    const savedToken = tokenStorage.get();
    console.log('useAuth: 保存されたトークン:', savedToken);
    if (savedToken) {
      console.log('useAuth: トークンが見つかりました、ユーザーデータを取得します');
      setToken(savedToken);
      fetchUserData(savedToken);
    } else {
      console.log('useAuth: トークンが見つかりませんでした');
    }
  }, []);

  // ユーザー情報を取得
  const fetchUserData = async (authToken: string) => {
    console.log('fetchUserData: ユーザーデータ取得開始', authToken);
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      console.log('fetchUserData: ユーザーデータ取得成功', response.data);
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('fetchUserData: ユーザーデータ取得失敗:', error);
      console.log('fetchUserData: トークンを削除します');
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
    console.log('ログアウト処理開始');
    console.log('現在のユーザー:', user);
    console.log('現在のトークン:', token);
    console.log('ローカルストレージのトークン（削除前）:', tokenStorage.get());
    
    setUser(null);
    setToken(null);
    tokenStorage.remove();
    
    console.log('ローカルストレージのトークン（削除後）:', tokenStorage.get());
    console.log('React状態のトークン（setToken後、まだ更新されていない可能性）:', token);
    
    console.log('ログアウト処理完了 - ユーザーとトークンをクリア');
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
