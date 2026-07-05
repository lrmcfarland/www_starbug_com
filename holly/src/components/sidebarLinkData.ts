import React from "react";
import { SidebarItem } from "../types";
import { BsPersonWorkspace } from "react-icons/bs";
import { FcHome } from "react-icons/fc";
import { GiObservatory, GiSextant } from "react-icons/gi";
import { MdKayaking } from "react-icons/md";

export const sidebarItems: SidebarItem[] = [
  {
    title: "Home",
    path: "/",
    icon: React.createElement(FcHome),
  },
  {
    title: "Resume",
    path: "/resume",
    icon: React.createElement(BsPersonWorkspace),
  },
  {
    title: "Observatories",
    path: "/observatories",
    icon: React.createElement(GiObservatory),
  },
  {
    title: "Navigation",
    path: "/navigation",
    icon: React.createElement(GiSextant),
  },
  {
    title: "Kayaking",
    path: "/kayaking",
    icon: React.createElement(MdKayaking),
  },
];
