import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import HomePage from './HomePage';
import ComparePage from './ComparePage'
import BranchPage from './BranchPage';
import TemplatesPage from './TemplatesPage';

// Use HashRouter for Electron compatibility
const router = createHashRouter([
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
  }, 
  {
    path: '/TemplatesPage', // Added the new route
    element: <TemplatesPage />,
  }
]);

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);