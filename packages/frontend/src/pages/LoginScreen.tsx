import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { FC } from 'react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void; // 使用しないが互換性のため残す
  isLoading: boolean;
  error: string | null;
}

export const LoginScreen: FC<LoginScreenProps> = ({ 
  onLogin, 
  onSwitchToRegister, 
  isLoading, 
  error 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLoginClick = () => {
    if (email.trim() && password.trim()) {
      onLogin(email.trim(), password.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLoginClick();
    }
  };

  return (
    <div className="login-container">
      <h1>Mosquito App</h1>
      <h2>ログイン</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label>メールアドレス</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="メールアドレスを入力"
          autoFocus
          disabled={isLoading}
        />
      </div>

      <div className="form-group">
        <label>パスワード</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="パスワードを入力"
          disabled={isLoading}
        />
      </div>

      <button onClick={handleLoginClick} disabled={isLoading}>
        {isLoading ? 'ログイン中...' : 'ログイン'}
      </button>

      <p>
        アカウントをお持ちでない方は{' '}
        <Link to="/register" className="link-button">
          こちらから登録
        </Link>
      </p>
    </div>
  );
};
