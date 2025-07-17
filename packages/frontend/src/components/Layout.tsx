import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import '../styles/sidebar.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="layout-with-sidebar">
      <button 
        className="mobile-sidebar-toggle" 
        onClick={toggleSidebar}
        aria-label="メニューを開く"
      >
        ☰
      </button>
      
      <div className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`}>
        <Sidebar />
      </div>
      
      <main className="main-content">
        {children}
      </main>
      
      {/* モバイル用オーバーレイ */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
        />
      )}
    </div>
  );
};
