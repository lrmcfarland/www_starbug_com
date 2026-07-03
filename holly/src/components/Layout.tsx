import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useLocalStorage } from "./useLocalStorage";
import { useWindowSize } from "./useWindowSize";

export const Layout: React.FC = () => {
  const { isMobile } = useWindowSize(768);
  const [isCollapsed, setIsCollapsed] = useLocalStorage<boolean>(
    "app_sidebar_collapsed",
    false
  );

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [isMobile, setIsCollapsed]);

  const handleSidebarToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={handleSidebarToggle}
        isMobile={isMobile}
      />

      <main
        style={{
          flex: 1,
          padding: isMobile ? "1rem" : "2rem",
          background: "#071625",
          width: "100%",
          transition: "padding 0.2s ease-in-out",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};
