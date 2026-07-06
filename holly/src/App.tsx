import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import Observatories from "./components/Observatories";
import Home from "./components/Home";
import Resume from "./components/Resume";

const Kayaking = () => <h1>Kayaking Content</h1>;
const Navigation = () => <h1>Navigation Content</h1>;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "resume", element: <Resume /> },
      { path: "observatories", element: <Observatories /> },
      { path: "kayaking", element: <Kayaking /> },
      { path: "navigation", element: <Navigation /> },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
