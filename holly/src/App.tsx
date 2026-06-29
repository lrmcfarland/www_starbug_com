// App.tsx
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';

// Mock Page Components
const Home = () => <h1>Home Content</h1>;
const Astronomy = () => <h1>Astronomy Content</h1>;
const Resume = () => <h1>Resume Content</h1>;

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'astronomy', element: <Astronomy /> },
      { path: 'resume', element: <Resume /> },
    ],
  },
]);

export const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
