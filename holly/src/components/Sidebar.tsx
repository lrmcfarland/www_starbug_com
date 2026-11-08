import React from "react";
import { NavLink } from "react-router-dom";
import { IconContext } from "react-icons";
import {
  MdMenu,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { sidebarItems } from "./sidebarLinkData";
import { SidebarProps } from "../types";

interface ExtendedSidebarProps extends SidebarProps {
  isMobile: boolean;
}

export const Sidebar: React.FC<ExtendedSidebarProps> = ({
  isCollapsed,
  onToggle,
  isMobile,
}) => {
  const sidebarWidth = isMobile
    ? isCollapsed
      ? "48px"
      : "240px"
    : isCollapsed
      ? "96px"
      : "250px";

  return (
    <>
      {isMobile && isCollapsed && (
        <button
          onClick={onToggle}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            background: "var(--sidebar-active)",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        >
          <MdMenu size="1.5rem" />
        </button>
      )}

      <IconContext.Provider value={{ color: "var(--sidebar-icon)", size: "1.4rem" }}>
        <nav
          style={{
            width: sidebarWidth,
            height: "100vh",
            background: "var(--sidebar-bg)",
            color: "var(--sidebar-text)",
            padding: "0.5rem",
            transition: "width 0.2s ease-in-out",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: isMobile ? "fixed" : "sticky",
            top: 0,
            left: 0,
            zIndex: 999,
            overflowX: "hidden",
          }}
          role="navigation"
        >
          <div>
            <h2
              style={{
                marginBottom: "2rem",
                fontSize: "1.25rem",
                textAlign: isCollapsed ? "center" : "left",
                display:
                  isMobile && isCollapsed ? "none" : "block",
              }}
            >
              {isCollapsed ? "Holly" : "www.starbug.com"}
            </h2>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {sidebarItems.map((item) => (
                <li key={item.path} style={{ margin: "10px 0" }}>
                  <NavLink
                    to={item.path}
                    onClick={isMobile ? onToggle : undefined}
                    style={({ isActive }) => ({
                      color: isActive
                        ? "var(--sidebar-active-text)"
                        : "var(--sidebar-text)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      borderRadius: "4px",
                      background: isActive
                        ? "var(--sidebar-active)"
                        : "transparent",
                      justifyContent: isCollapsed
                        ? "center"
                        : "flex-start",
                    })}
                  >
                    <span style={{ fontSize: "1.25rem" }}>
                      {item.icon || "▪"}
                    </span>
                    {!isCollapsed && (
                      <span style={{ marginLeft: "12px" }}>
                        {item.title}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onToggle}
            style={{
              background: "var(--sidebar-button)",
              color: "var(--sidebar-text)",
              border: "none",
              padding: "10px",
              borderRadius: "4px",
              cursor: "pointer",
              width: "100%",
              display:
                isMobile && isCollapsed ? "none" : "block",
            }}
          >
            {isCollapsed ? (
              <MdChevronRight />
            ) : (
              <MdChevronLeft />
            )}
          </button>
        </nav>
      </IconContext.Provider>

      {isMobile && !isCollapsed && (
        <div
          onClick={onToggle}
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--overlay)",
            zIndex: 998,
          }}
        />
      )}
    </>
  );
};
