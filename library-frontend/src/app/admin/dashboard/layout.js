"use client";

import { useState } from "react";
import Sidebar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";

const AdminLayout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Sidebar 
        onToggle={handleSidebarToggle} 
        isAdmin={true} 
      />
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <DashboardHeader />
        <main className="p-4 md:p-8 pt-4">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
