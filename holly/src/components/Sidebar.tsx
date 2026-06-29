// Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { sidebarItems } from './sidebarLinkData';

export const Sidebar: React.FC = () => {
  return (
    <nav 
      style={{ width: '250px', height: '100vh', background: '#1e293b', color: '#fff', padding: '1rem' }} 
      role="navigation"
    >
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>www.starbug.com</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sidebarItems.map((item) => (
          <li key={item.path} style={{ margin: '10px 0' }}>
            <NavLink
              to={item.path}
              style={({ isActive }: { isActive: boolean }) => ({
                color: '#fff',
                textDecoration: 'none',
                display: 'block',
                padding: '10px',
                borderRadius: '4px',
                background: isActive ? '#3b82f6' : 'transparent',
              })}
            >
              {item.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};
