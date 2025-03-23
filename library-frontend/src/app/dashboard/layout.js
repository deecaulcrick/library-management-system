"use client";
import { useState } from "react";
import SideBar from "@/components/SideBar";
import DashboardHeader from "@/components/DashboardHeader";

const layout = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen ">
      <SideBar onToggle={handleSidebarToggle} />
      <div
        className={`
          flex-1 overflow-auto transition-all duration-300
          ${sidebarCollapsed ? "md:ml-20" : "md:ml-64"}
        `}
      >
        <DashboardHeader fName="Dee" lName="Caulcrick" />

        <main className="flex-1 overflow-auto p-8">{children}</main>
      </div>
    </div>
  );
};

export default layout;
