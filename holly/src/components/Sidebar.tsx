// Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { IconContext } from 'react-icons';
import { MdMenu, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { sidebarItems } from "./sidebarLinkData";
import { SidebarProps } from "../types";

interface ExtendedSidebarProps extends SidebarProps {
  isMobile: boolean;
}

export const Sidebar: React.FC<ExtendedSidebarProps> = ({ isCollapsed, onToggle, isMobile }) => {
  // Mobile forces 0px hidden menu or a minimal absolute action bar
  const sidebarWidth = isMobile
    ? (isCollapsed ? '20px' : '240px')
    : (isCollapsed ? '80px' : '250px');

  return (
    <>
      {/* Mobile Floating Toggle Menu Overlay Button */}
      {isMobile && isCollapsed && (
        <button
          onClick={onToggle}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 1000,
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
          }}
        >
          <MdMenu size="1.5rem" />
        </button>
      )}

      {/* Global styling wrapper for uniform side bar icon tokens */}
      <IconContext.Provider value={{ color: '#94a3b8', size: '1.4rem' }}> {/* */}

      <nav
        style={{
          width: sidebarWidth,
          height: "100vh",
          background: "#1e293b",
          color: "#fff",
          padding: "2rem",
          transition: 'width 0.2s ease-in-out',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          zIndex: 999,
          overflowX: 'hidden'
        }}
        role="navigation"
      >
        <div>
          <h2 style={{
            marginBottom: "2rem",
            fontSize: '1.25rem',
            textAlign: isCollapsed ? 'center' : 'left',
            display: isMobile && isCollapsed ? 'none' : 'block'
          }}>
            {isCollapsed ? 'Holly' : 'www.starbug.com'}
          </h2>

          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {sidebarItems.map((item) => (
              <li key={item.path} style={{ margin: "10px 0" }}>
                <NavLink
                  to={item.path}
                  onClick={isMobile ? onToggle : undefined} // Close nav tray on choice for mobile
                    style={({ isActive }) => ({
                      color: '#fff',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px',
                      borderRadius: '4px',
                      background: isActive ? '#3b82f6' : 'transparent',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                  })}
                >
                  <span style={{ fontSize: '1.25rem' }}>{item.icon || '▪'}</span>
                  {!isCollapsed && <span style={{ marginLeft: '12px' }}>{item.title}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Controller Container */}
        <button
          onClick={onToggle}
          style={{
            background: '#334155',
            color: '#fff',
            border: 'none',
            padding: '10px',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
            display: isMobile && isCollapsed ? 'none' : 'block'
          }}
        >
          {isCollapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </button>
      </nav>
      </IconContext.Provider>

        {/* Backdrop shadow mask overlay active during mobile drawer display */}
        {isMobile && !isCollapsed && (
          <div
            onClick={onToggle}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
              zIndex: 998
            }}
          />
        )}
    </>
  );
};
