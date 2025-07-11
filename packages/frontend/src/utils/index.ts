// API設定とユーティリティ関数

// API ベースURL - Docker環境を考慮
export const API_BASE_URL = 'http://localhost:3001/api';

// ローカルストレージ関連のユーティリティ
export const tokenStorage = {
  get: (): string | null => localStorage.getItem('token'),
  set: (token: string): void => localStorage.setItem('token', token),
  remove: (): void => localStorage.removeItem('token'),
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
