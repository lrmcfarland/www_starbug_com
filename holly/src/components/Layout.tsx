// Layout.tsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleSidebarToggle = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Persistent Sidebar Configuration Grid */}
      <Sidebar isCollapsed={isCollapsed} onToggle={handleSidebarToggle} />

      <main style={{
        flex: 1,
        padding: '2rem',
        background: '#071625',
        transition: 'margin-left 0.2s ease-in-out'
      }}>
        <Outlet />
      </main>
    </div>
  );
};
