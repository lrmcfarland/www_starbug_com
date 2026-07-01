// Layout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useLocalStorage } from './useLocalStorage';

export const Layout: React.FC = () => {
  // Define a unique lookup key to lock configuration rules to the device
  const [isCollapsed, setIsCollapsed] = useLocalStorage<boolean>('app_sidebar_collapsed', false);

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
