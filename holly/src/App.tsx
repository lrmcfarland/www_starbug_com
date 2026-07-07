import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import Astronomy from "./components/Astronomy";
import Home from "./components/Home";
import Kayaking from "./components/Kayaking";
import Observatories from "./components/Observatories";
import Resume from "./components/Resume";

const Navigation = () => <h1>Navigation Content</h1>;

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
      { path: "navigation", element: <Navigation /> },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
