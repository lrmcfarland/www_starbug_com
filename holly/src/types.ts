import { ReactNode } from "react";

export interface SidebarItem {
  title: string;
  path: string;
  icon?: ReactNode;
}

export interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  isMobile: boolean;
}
