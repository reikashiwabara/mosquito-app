// 基本的な型定義

// 画面の状態（React Router導入により廃止予定）
export type Screen = 'login' | 'register' | 'main' | 'mypage';

// 武器情報
export interface Weapon {
  id: number;
  type: string;
  name: string;
  emoji: string;
  icon?: string; // 武器画像のパス
  damage: number;
}

// ユーザー情報
export interface User {
  id: number;
  email: string;
  name: string;
  kills: number;
  deaths: number;
  profileImage?: string; // プロフィール画像のURL（オプショナル）
  title?: string;        // 称号（オプショナル）
  selectedWeaponId?: number; // 選択中の武器ID（オプショナル）
}

// ランキング用ユーザー情報
export interface UserRanking {
  id: number;
  name: string;
  kills: number;
  deaths: number;
  killRate: number;
  title?: string;        // 称号
  selectedWeaponId?: number; // 選択中の武器ID
  selectedWeapon?: string;   // 選択中の武器名
}

// 武器ランキング情報
export interface WeaponRanking {
  weapon: string;
  userCount: number;
  topUsers: UserRanking[];
}

// 全ランキングデータ
export interface RankingData {
  killRate: UserRanking[];
  kills: UserRanking[];
  deaths: UserRanking[];
  weapons: WeaponRanking[];
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
