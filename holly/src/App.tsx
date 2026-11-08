import React, { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./components/Home";

const Astronomy = lazy(() => import("./components/Astronomy"));
const Kayaking = lazy(() => import("./components/Kayaking"));
const Observatories = lazy(() => import("./components/Observatories"));
const Resume = lazy(() => import("./components/Resume"));
const Navigator = lazy(() => import("./components/Navigator"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "resume", element: <Resume /> },
      { path: "observatories", element: <Observatories /> },
      { path: "astronomy", element: <Astronomy /> },
      { path: "kayaking", element: <Kayaking /> },
      { path: "navigation", element: <Navigator /> },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
