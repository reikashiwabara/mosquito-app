// 基本的な型定義

// 画面の状態（React Router導入により廃止予定）
export type Screen = 'login' | 'register' | 'main' | 'mypage';

// ユーザー情報
export interface User {
  id: number;
  email: string;
  name: string;
  kills: number;
  deaths: number;
}

// ランキング用ユーザー情報
export interface UserRanking {
  id: number;
  name: string;
  kills: number;
  deaths: number;
  killRate: number;
}

// ログエントリ
export interface LogEntry {
  id: number;
  text: string;
}

// API レスポンス型
export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
  message: string;
}

// API エラーレスポンス型
export interface ApiError {
  error: string;
}
