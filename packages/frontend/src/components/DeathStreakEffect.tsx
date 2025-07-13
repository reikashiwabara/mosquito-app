import type { FC } from 'react';
import { useState, useEffect } from 'react';
import '../styles/deathstreak.css';

interface DeathStreakEffectProps {
  streakCount: number;
  isVisible: boolean;
  onAnimationEnd: () => void;
}

// デスストリークのメッセージとエフェクトの設定
const getDeathStreakData = (count: number) => {
  if (count >= 15) return { message: "絶望的...", color: "#11111b", size: "huge", mood: "despair" };
  if (count >= 10) return { message: "もうだめだ...", color: "#1e1e2e", size: "large", mood: "hopeless" };
  if (count >= 7) return { message: "辛すぎる...", color: "#313244", size: "large", mood: "painful" };
  if (count >= 5) return { message: "何もできない...", color: "#45475a", size: "medium", mood: "helpless" };
  if (count >= 3) return { message: "やられすぎ...", color: "#585b70", size: "medium", mood: "frustrated" };
  if (count >= 2) return { message: "連続死...", color: "#6c7086", size: "small", mood: "sad" };
  return { message: "失敗...", color: "#7f849c", size: "small", mood: "disappointed" };
};

export const DeathStreakEffect: FC<DeathStreakEffectProps> = ({
  streakCount,
  isVisible,
  onAnimationEnd
}) => {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter');
  const streakData = getDeathStreakData(streakCount);

  useEffect(() => {
    if (!isVisible) return;

    // アニメーションのフェーズ管理
    const timer1 = setTimeout(() => setAnimationPhase('display'), 800);
    const timer2 = setTimeout(() => setAnimationPhase('exit'), 2500);
    const timer3 = setTimeout(() => {
      onAnimationEnd();
      setAnimationPhase('enter');
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onAnimationEnd]);

  if (!isVisible) return null;

  return (
    <div className={`deathstreak-overlay ${animationPhase} ${streakData.mood}`}>
      {/* 悲しい背景エフェクト */}
      <div className="deathstreak-background">
        <div className="rain-effect">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                '--delay': `${i * 0.2}s`,
                '--position': `${Math.random() * 100}%`,
                '--duration': `${2 + Math.random() * 3}s`
              } as React.CSSProperties}
            />
          ))}
        </div>
        
        <div className="dark-clouds">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="cloud"
              style={{
                '--cloud-delay': `${i * 0.5}s`,
                '--cloud-size': `${0.8 + Math.random() * 0.4}`,
                '--cloud-x': `${i * 25}%`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* メインテキスト */}
      <div 
        className={`deathstreak-text ${streakData.size}`}
        style={{ '--streak-color': streakData.color } as React.CSSProperties}
      >
        <div className="streak-count">{streakCount}</div>
        <div className="streak-message">{streakData.message}</div>
        <div className="streak-subtitle">連続デス</div>
      </div>

      {/* 悲しい追加エフェクト */}
      {streakCount >= 5 && (
        <div className="sadness-effects">
          <div className="tears-effect">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="tear"
                style={{ 
                  '--tear-delay': `${i * 0.3}s`,
                  '--tear-x': `${45 + i * 2}%`
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}

      {/* 絶望エフェクト（超高デスストリーク時） */}
      {streakCount >= 10 && (
        <div className="despair-effects">
          <div className="screen-fade">
            <div className="fade-overlay" />
          </div>
          <div className="despair-particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="despair-particle"
                style={{
                  '--particle-delay': `${i * 0.1}s`,
                  '--particle-x': `${Math.random() * 100}%`,
                  '--particle-y': `${Math.random() * 100}%`
                } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}

      {/* 悲しい音符エフェクト */}
      <div className="musical-notes">
        {['♪', '♫', '♭', '♯'].map((note, i) => (
          <div
            key={i}
            className="sad-note"
            style={{
              '--note-delay': `${i * 0.5}s`,
              '--note-x': `${20 + i * 20}%`
            } as React.CSSProperties}
          >
            {note}
          </div>
        ))}
      </div>
    </div>
  );
};
