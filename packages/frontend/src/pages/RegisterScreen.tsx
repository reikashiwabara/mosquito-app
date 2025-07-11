import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { FC } from 'react';

interface RegisterScreenProps {
  onRegister: (email: string, name: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const RegisterScreen: FC<RegisterScreenProps> = ({ 
  onRegister, 
  isLoading, 
  error 
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegisterClick = () => {
    if (email.trim() && name.trim() && password.trim() && confirmPassword.trim()) {
      if (password !== confirmPassword) {
        alert('パスワードが一致しません');
        return;
      }
      onRegister(email.trim(), name.trim(), password.trim());
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleRegisterClick();
    }
  };

  return (
    <div className="login-container">
      <h1>Mosquito App</h1>
      <h2>アカウント登録</h2>
      
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
        <label>名前</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="名前を入力"
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

      <div className="form-group">
        <label>パスワード確認</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="パスワードを再入力"
          disabled={isLoading}
        />
      </div>

      <button onClick={handleRegisterClick} disabled={isLoading}>
        {isLoading ? '登録中...' : '登録'}
      </button>

      <p>
        すでにアカウントをお持ちの方は{' '}
        <Link to="/login" className="link-button">
          ログインはこちら
        </Link>
      </p>
    </div>
  );
};
