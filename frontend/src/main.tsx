import { Profiler, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./HomePage";
import ComparePage from "./ComparePage";
import BranchPage from "./BranchPage";
import LandingPage from "./LandingPage";
import { CreatePage } from "./CreatePage";
import TemplatePage from "./TemplatePage";
import Profile from "./Profile";
// Use HashRouter for Electron compatibility
const router = createHashRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/ComparePage",
    element: <ComparePage />,
  },
  {
    path: "/BranchPage",
    element: <BranchPage />,
  },
  {
    path: "/branch/:branchId",    
    element: <ComparePage />,      
  },
  {
    path: "/LandingPage", // new route
    element: <LandingPage />,
  },
  {
    path: "/CreatePage", // new route
    element: <CreatePage />,
  },
  {
    path: "/TemplatePage", // new route
    element: <TemplatePage />,
  },
  {
    path: "/Profile", // new route
    element: <Profile />,
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// If the auth server redirected back after logout with ?logged_out=1,
// ensure the app navigates to the home route and clear any tokens.
if (typeof window !== "undefined") {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get("logged_out")) {
      try {
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
      } catch (e) {}
      // Replace the URL to remove the query and set hash to home
      const base = window.location.origin + window.location.pathname;
      window.history.replaceState({}, "", base + "#/");
    }
  } catch (e) {
    console.warn("Failed to handle logged_out redirect", e);
  }
}

// Electron: listen for OAuth callback forwarded from main process (loopback or protocol)
if (
  typeof window !== "undefined" &&
  (window as any).electronAPI &&
  (window as any).electronAPI.onOAuthCallback
) {
  (window as any).electronAPI.onOAuthCallback((url: string) => {
    try {
      const parsed = new URL(url);
      const accessToken = parsed.searchParams.get("access_token");
      const idToken = parsed.searchParams.get("id_token");
      if (accessToken) localStorage.setItem("access_token", accessToken);
      if (idToken) localStorage.setItem("id_token", idToken);
      // Navigate to LandingPage (using hash router)
      if (location.hash.indexOf("#/LandingPage") === -1) {
        location.hash = "#/LandingPage";
      }
    } catch (e) {
      console.error("Failed to handle oauth-callback URL", e, url);
    }
  });
}
