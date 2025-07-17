import { useState, useEffect, useCallback } from 'react';

interface KillStreakData {
  count: number;
  isActive: boolean;
  lastKillTime: number;
  totalKills: number;
}

interface DeathStreakData {
  count: number;
  isActive: boolean;
  lastDeathTime: number;
  totalDeaths: number;
}

interface UseKillStreakReturn {
  streakCount: number;
  isStreakActive: boolean;
  showEffect: boolean;
  totalKills: number;
  deathStreakCount: number;
  isDeathStreakActive: boolean;
  showDeathEffect: boolean;
  totalDeaths: number;
  registerKill: () => void;
  registerDeath: () => void;
  resetStreak: () => void;
  resetDeathStreak: () => void;
  hideEffect: () => void;
  hideDeathEffect: () => void;
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
  
  const [deathStreakData, setDeathStreakData] = useState<DeathStreakData>({
    count: 0,
    isActive: false,
    lastDeathTime: 0,
    totalDeaths: 0
  });
  
  const [showEffect, setShowEffect] = useState(false);
  const [showDeathEffect, setShowDeathEffect] = useState(false);

  // キルを登録する関数
  const registerKill = useCallback(() => {
    const currentTime = Date.now();
    
    // デスストリークをリセット
    setDeathStreakData(prev => ({
      ...prev,
      count: 0,
      isActive: false,
      lastDeathTime: 0
    }));
    setShowDeathEffect(false);
    
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

  // デスを登録する関数
  const registerDeath = useCallback(() => {
    const currentTime = Date.now();
    
    // キルストリークをリセット
    setStreakData(prev => ({
      ...prev,
      count: 0,
      isActive: false,
      lastKillTime: 0
    }));
    setShowEffect(false);
    
    // デスストリークを更新
    setDeathStreakData(prev => {
      const newCount = prev.count + 1;
      const newTotalDeaths = prev.totalDeaths + 1;
      
      // エフェクトを表示（2デス以上の場合）
      if (newCount >= 2) {
        setShowDeathEffect(true);
      }
      
      return {
        count: newCount,
        isActive: true,
        lastDeathTime: currentTime,
        totalDeaths: newTotalDeaths
      };
    });
    
    // デス音を再生（オプション）
    playDeathSound();
  }, []);

  // キルストリークを手動でリセット
  const resetStreak = useCallback(() => {
    setStreakData(prev => ({
      ...prev,
      count: 0,
      isActive: false,
      lastKillTime: 0
    }));
    
    setShowEffect(false);
  }, []);

  // デスストリークを手動でリセット
  const resetDeathStreak = useCallback(() => {
    setDeathStreakData(prev => ({
      ...prev,
      count: 0,
      isActive: false,
      lastDeathTime: 0
    }));
    
    setShowDeathEffect(false);
  }, []);

  // エフェクトを非表示にする
  const hideEffect = useCallback(() => {
    setShowEffect(false);
  }, []);

  // デスエフェクトを非表示にする
  const hideDeathEffect = useCallback(() => {
    setShowDeathEffect(false);
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

  // デスストリークのタイムアウトチェック
  useEffect(() => {
    if (!deathStreakData.isActive) return;

    const timeoutId = setTimeout(() => {
      const timeSinceLastDeath = Date.now() - deathStreakData.lastDeathTime;
      
      if (timeSinceLastDeath >= STREAK_TIMEOUT) {
        setDeathStreakData(prev => ({
          ...prev,
          count: 0,
          isActive: false,
          lastDeathTime: 0
        }));
      }
    }, STREAK_TIMEOUT);

    return () => clearTimeout(timeoutId);
  }, [deathStreakData.lastDeathTime, deathStreakData.isActive]);

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
    deathStreakCount: deathStreakData.count,
    isDeathStreakActive: deathStreakData.isActive,
    showDeathEffect,
    totalDeaths: deathStreakData.totalDeaths,
    registerKill,
    registerDeath,
    resetStreak,
    resetDeathStreak,
    hideEffect,
    hideDeathEffect
  };
};
