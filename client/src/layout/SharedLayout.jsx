import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/navbar/Sidebar";
import Header from "../components/navbar/Header";

const SharedLayout = () => {
  return (
    <div className="app-layout">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Scrollable Content */}
      <main className="app-content bg-light min-vh-100">
        <Header />
        <div className="p-3">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SharedLayout;