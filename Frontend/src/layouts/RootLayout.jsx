// src/layouts/RootLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}