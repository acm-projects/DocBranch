import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import HomePage from './HomePage'; // Fixed import name
import ComparePage from './ComparePage'
import BranchPage from './BranchPage';

// Create the router
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/ComparePage',
    element: <ComparePage />,
  },

  {
    path: '/BranchPage',
    element: <BranchPage />,
  }
]);

// Use createRoot from react-dom/client instead of ReactDOM.createRoot
const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);