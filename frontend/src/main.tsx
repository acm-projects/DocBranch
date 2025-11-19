import { Profiler, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import HomePage from './HomePage';
import ComparePage from './ComparePage'
import BranchPage from './BranchPage';
import LandingPage from './LandingPage';
import HomePageMain from './HomePageMain';
import {CreatePage} from './CreatePage';
import TemplatePage from './TemplatePage';
import Profile from './Profile';
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
    path: '/LandingPage', // new route 
    element: <LandingPage />,
  },
  {
    path: '/HomePageMain', // new route
    element: <HomePageMain />,
  },
  {
    path: '/CreatePage', // new route
    element: <CreatePage />,
  },
  {
    path: '/TemplatePage', // new route
    element: <TemplatePage />,
  },
  {
    path: '/Profile', // new route
    element: <Profile />,
  }

  



]);

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);