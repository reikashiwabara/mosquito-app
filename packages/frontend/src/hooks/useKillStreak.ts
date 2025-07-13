import { useState, useEffect, useCallback } from 'react';

interface KillStreakData {
  count: number;
  isActive: boolean;
  lastKillTime: number;
  totalKills: number;
}

interface UseKillStreakReturn {
  streakCount: number;
  isStreakActive: boolean;
  showEffect: boolean;
  totalKills: number;
  registerKill: () => void;
  registerDeath: () => void;
  resetStreak: () => void;
  hideEffect: () => void;
}

// キルストリークのタイムアウト時間（ミリ秒）
const STREAK_TIMEOUT = 30000; // 30秒

export const useKillStreak = (): UseKillStreakReturn => {
  const [streakData, setStreakData] = useState<KillStreakData>({
    count: 0,
    isActive: false,
    lastKillTime: 0,
    totalKills: 0
  });
  
  const [showEffect, setShowEffect] = useState(false);

  // キルを登録する関数
  const registerKill = useCallback(() => {
    const currentTime = Date.now();
    
    setStreakData(prev => {
      const newCount = prev.count + 1;
      const newTotalKills = prev.totalKills + 1;
      
      // エフェクトを表示（2キル以上の場合）
      if (newCount >= 2) {
        setShowEffect(true);
      }
      
      return {
        count: newCount,
        isActive: true,
        lastKillTime: currentTime,
        totalKills: newTotalKills
      };
    });
    
    // 効果音を再生（オプション）
    playKillSound();
  }, []);

  // デスを登録する関数（ストリークをリセット）
  const registerDeath = useCallback(() => {
    setStreakData(prev => ({
      ...prev,
      count: 0,
      isActive: false,
      lastKillTime: 0
    }));
    
    setShowEffect(false);
    
    // デス音を再生（オプション）
    playDeathSound();
  }, []);

  // ストリークを手動でリセット
  const resetStreak = useCallback(() => {
    setStreakData(prev => ({
      ...prev,
      count: 0,
      isActive: false,
      lastKillTime: 0
    }));
    
    setShowEffect(false);
  }, []);

  // エフェクトを非表示にする
  const hideEffect = useCallback(() => {
    setShowEffect(false);
  }, []);

  // ストリークのタイムアウトチェック
  useEffect(() => {
    if (!streakData.isActive) return;

    const timeoutId = setTimeout(() => {
      const timeSinceLastKill = Date.now() - streakData.lastKillTime;
      
      if (timeSinceLastKill >= STREAK_TIMEOUT) {
        setStreakData(prev => ({
          ...prev,
          count: 0,
          isActive: false,
          lastKillTime: 0
        }));
      }
    }, STREAK_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [streakData.lastKillTime, streakData.isActive]);

  // 効果音再生関数（オプション）
  const playKillSound = () => {
    try {
      const audio = new Audio('/sounds/kill.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // 音声ファイルがない場合は無視
      });
    } catch (error) {
      // 音声再生エラーは無視
    }
  };

  const playDeathSound = () => {
    try {
      const audio = new Audio('/sounds/death.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // 音声ファイルがない場合は無視
      });
    } catch (error) {
      // 音声再生エラーは無視
    }
  };

  return {
    streakCount: streakData.count,
    isStreakActive: streakData.isActive,
    showEffect,
    totalKills: streakData.totalKills,
    registerKill,
    registerDeath,
    resetStreak,
    hideEffect
  };
};
