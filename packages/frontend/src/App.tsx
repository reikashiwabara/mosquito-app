import { useState } from 'react';
import type { FC } from 'react';
import './App.css';

// 画像は指定されたパスにあると仮定します
import killImage from './assets/kill.png';
import deathImage from './assets/death.png';

// 状態管理用の型定義
type Screen = 'login' | 'main';

// ログエントリの型定義
interface LogEntry {
  id: number;
  text: string;
}

// ## ログイン画面コンポーネント
// =============================================
interface LoginScreenProps {
  handleLogin: (name: string) => void;
}

const LoginScreen: FC<LoginScreenProps> = ({ handleLogin }) => {
  const [inputName, setInputName] = useState('');

  const onLoginClick = () => {
    if (inputName.trim()) {
      handleLogin(inputName.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onLoginClick();
    }
  };


  return (
    <div className="login-container">
      <h1>Mosquito App</h1>
      <p>your name</p>
      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter your name"
        autoFocus
      />
      <button onClick={onLoginClick}>Enter</button>
    </div>
  );
};


// ## メイン画面コンポーネント
// =============================================
interface MainScreenProps {
  userName: string;
  kills: number;
  deaths: number;
  logs: LogEntry[];
  handleKill: () => void;
  handleDeath: () => void;
}

const MainScreen: FC<MainScreenProps> = ({ userName, kills, deaths, logs, handleKill, handleDeath }) => {
  // K/D比の計算 (ゼロ除算を防止)
  const kdRatio = deaths === 0 ? kills.toFixed(2) : (kills / deaths).toFixed(2);

  return (
    <div className="main-container">
      <header className="main-header">
        <h2>{userName}'s Battle</h2>
      </header>

      <div className="score-board">
        <div className="kd-ratio">
          <span>{kdRatio}</span> K/D
        </div>
        <div className="total-scores">
          <span>{kills} Kill</span>
          <span>{deaths} Death</span>
        </div>
      </div>

      <div className="actions-container">
        <button className="action-button" onClick={handleKill}>
          <img src={killImage} alt="Kill" className="character-img" />
          <span>Kill</span>
        </button>
        <button className="action-button" onClick={handleDeath}>
          <img src={deathImage} alt="Death" className="character-img" />
          <span>Death</span>
        </button>
      </div>

      <div className="log-area">
        {logs.map((log) => (
          <div key={log.id} className="log-entry">
            {log.text}
          </div>
        ))}
      </div>
    </div>
  );
};


// ## Appメインコンポーネント
// =============================================
function App() {
  // アプリケーション全体の状態管理
  const [screen, setScreen] = useState<Screen>('login');
  const [userName, setUserName] = useState<string>('');
  const [kills, setKills] = useState<number>(0);
  const [deaths, setDeaths] = useState<number>(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // ログイン処理
  const handleLogin = (name: string) => {
    setUserName(name);
    setScreen('main');
  };

  // ログ追加共通関数
  const addLog = (message: string) => {
    const newLog: LogEntry = { id: Date.now(), text: message };
    // 新しいログを配列の先頭に追加
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };


  // Killボタンの処理
  const handleKill = () => {
    setKills(k => k + 1);
    addLog(`${userName} killed a mosquito.`);
  };

  // Deathボタンの処理
  const handleDeath = () => {
    setDeaths(d => d + 1);
    addLog(`${userName} was killed by a mosquito.`);
  };


  // 現在の画面に応じてコンポーネントを切り替え
  return (
    <div className="app-wrapper">
      {screen === 'login' ? (
        <LoginScreen handleLogin={handleLogin} />
      ) : (
        <MainScreen
          userName={userName}
          kills={kills}
          deaths={deaths}
          logs={logs}
          handleKill={handleKill}
          handleDeath={handleDeath}
        />
      )}
    </div>
  );
}

export default App;