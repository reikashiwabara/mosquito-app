// API設定とユーティリティ関数

// API ベースURL - 環境に応じて動的に設定
export const API_BASE_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_BASE_URL || 'https://your-api-domain.com/api'
  : 'http://localhost:3001/api';

// ローカルストレージ関連のユーティリティ
export const tokenStorage = {
  get: (): string | null => {
    const token = localStorage.getItem('token');
    console.log('tokenStorage.get() called, result:', token);
    return token;
  },
  set: (token: string): void => {
    console.log('tokenStorage.set() called with:', token);
    localStorage.setItem('token', token);
  },
  remove: (): void => {
    console.log('tokenStorage.remove() called');
    localStorage.removeItem('token');
    console.log('tokenStorage.remove() completed, checking result:', localStorage.getItem('token'));
  },
};

// K/D比計算
export const calculateKDRatio = (kills: number, deaths: number): string => {
  return deaths === 0 ? kills.toFixed(2) : (kills / deaths).toFixed(2);
};

// ログメッセージ生成
export const createLogMessage = {
  kill: (userName: string): string => `${userName} killed a mosquito.`,
  death: (userName: string): string => `${userName} was killed by a mosquito.`,
};
