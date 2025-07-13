import type { FC } from 'react';
import { useState, useEffect } from 'react';
import '../styles/killstreak.css';

interface KillStreakEffectProps {
  streakCount: number;
  isVisible: boolean;
  onAnimationEnd: () => void;
}

// キルストリークのメッセージとエフェクトの設定
const getStreakData = (count: number) => {
  if (count >= 25) return { message: "LEGENDARY!", color: "#ff6b6b", size: "huge" };
  if (count >= 20) return { message: "GODLIKE!", color: "#ff9f43", size: "huge" };
  if (count >= 15) return { message: "RAMPAGE!", color: "#feca57", size: "large" };
  if (count >= 10) return { message: "DOMINATING!", color: "#48dbfb", size: "large" };
  if (count >= 7) return { message: "UNSTOPPABLE!", color: "#0abde3", size: "medium" };
  if (count >= 5) return { message: "KILLING SPREE!", color: "#00d2d3", size: "medium" };
  if (count >= 3) return { message: "DOUBLE KILL!", color: "#5f27cd", size: "small" };
  if (count >= 2) return { message: "MULTI KILL!", color: "#a55eea", size: "small" };
  return { message: "FIRST BLOOD!", color: "#26de81", size: "small" };
};

export const KillStreakEffect: FC<KillStreakEffectProps> = ({
  streakCount,
  isVisible,
  onAnimationEnd
}) => {
  const [animationPhase, setAnimationPhase] = useState<'enter' | 'display' | 'exit'>('enter');
  const streakData = getStreakData(streakCount);

  useEffect(() => {
    if (!isVisible) return;

    // アニメーションのフェーズ管理
    const timer1 = setTimeout(() => setAnimationPhase('display'), 500);
    const timer2 = setTimeout(() => setAnimationPhase('exit'), 2000);
    const timer3 = setTimeout(() => {
      onAnimationEnd();
      setAnimationPhase('enter');
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isVisible, onAnimationEnd]);

  if (!isVisible) return null;

  return (
    <div className={`killstreak-overlay ${animationPhase}`}>
      {/* 背景エフェクト */}
      <div className="killstreak-background">
        <div className="streak-particles">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                '--delay': `${i * 0.1}s`,
                '--angle': `${i * 30}deg`
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* メインテキスト */}
      <div 
        className={`killstreak-text ${streakData.size}`}
        style={{ '--streak-color': streakData.color } as React.CSSProperties}
      >
        <div className="streak-count">{streakCount}</div>
        <div className="streak-message">{streakData.message}</div>
        <div className="streak-subtitle">キルストリーク</div>
      </div>

      {/* 追加エフェクト（高ストリーク時） */}
      {streakCount >= 10 && (
        <div className="epic-effects">
          <div className="lightning-effect">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="lightning-bolt"
                style={{ '--bolt-delay': `${i * 0.2}s` } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      )}

      {/* 画面揺れエフェクト（超高ストリーク時） */}
      {streakCount >= 20 && (
        <div className="screen-shake">
          <div className="shake-overlay" />
        </div>
      )}
    </div>
  );
};
