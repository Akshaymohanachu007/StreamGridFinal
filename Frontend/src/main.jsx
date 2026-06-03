import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { AuthProvider } from "./contexts/AuthContext";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Watchpage from "./pages/Watchpage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CategoryPage from "./pages/CategoryPage";
import Library from "./pages/Library";
import PlaylistDetailPage from "./pages/PlaylistDetailPage";
import VerifyOTP from "./pages/VerifyOTP";
import SearchResults from "./pages/SearchResults";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "video/:id", element: <Watchpage /> },
      { path: "search", element: <SearchResults /> },
      { path: "category/:slug", element: <CategoryPage /> },
      { path: "library", element: <Library /> },
      { path: "playlists/:id", element: <PlaylistDetailPage /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/verify-otp", element: <VerifyOTP /> },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);