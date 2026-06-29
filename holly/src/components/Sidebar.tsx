// Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import { sidebarItems } from "./sidebarLinkData";
import { SidebarProps } from "../types";

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const sidebarWidth = isCollapsed ? "80px" : "250px";

  return (
    <nav
      style={{
        width: sidebarWidth,
        height: "100vh",
        background: "#1e293b",
        color: "#fff",
        padding: "1rem",
        transition: 'width 0.2s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      role="navigation"
    >
      <div>
        <h2 style={{
          marginBottom: "2rem",
          fontSize: '1.25rem',
          textAlign: isCollapsed ? 'center' : 'left',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}>
          {isCollapsed ? 'Holly' : 'www.starbug.com'}
        </h2>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {sidebarItems.map((item) => (
            <li key={item.path} style={{ margin: "10px 0" }}>
              <NavLink
                to={item.path}
                style={({ isActive }: { isActive: boolean }) => ({
                  color: "#fff",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px",
                  borderRadius: "4px",
                  background: isActive ? "#3b82f6" : "transparent",
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                })}
              >
                {/* Visual Icon Anchor Slot */}
                <span style={{ fontSize: '1.25rem' }}>{item.icon || '▪'}</span>

                {/* Dynamically strip or render layout names */}
                {!isCollapsed && (
                  <span style={{ marginLeft: '12px', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </span>
                )}
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
          textAlign: 'center',
          fontSize: '0.85rem'
        }}
      >
        {isCollapsed ? '▶' : '◀ Collapse'}
      </button>

    </nav>
  );
};
