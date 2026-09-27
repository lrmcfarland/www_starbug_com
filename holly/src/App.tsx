import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout } from "./components/Layout";
import Astronomy from "./components/Astronomy";
import Home from "./components/Home";
import Kayaking from "./components/Kayaking";
import Observatories from "./components/Observatories";
import Resume from "./components/Resume";
import Navigator from "./components/Navigator";

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
