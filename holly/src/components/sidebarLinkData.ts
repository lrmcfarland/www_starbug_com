import React from "react";
import { SidebarItem } from "../types";
import { BsPersonWorkspace } from "react-icons/bs";
import { FcHome } from "react-icons/fc";
import { IoTelescopeOutline } from "react-icons/io5";

export const sidebarItems: SidebarItem[] = [
  {
    title: "Home",
    path: "/",
    icon: React.createElement(FcHome),
  },
  {
    title: "Work",
    path: "/resume",
    icon: React.createElement(BsPersonWorkspace),
  },
  {
    title: "Astronomy",
    path: "/astronomy",
    icon: React.createElement(IoTelescopeOutline),
  },
];
