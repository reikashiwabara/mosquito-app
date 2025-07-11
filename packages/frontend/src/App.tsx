// App.tsx - React Router ベースのメインアプリケーション
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider, AppRoutes } from './components';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-wrapper">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;