"use client";
import React, { useState, createContext, useContext } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

// Create context for sidebar state
const SidebarContext = createContext();

export const useSidebar = () => useContext(SidebarContext);

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
        <AdminSidebar />
        <div 
          className={`flex-1 overflow-x-auto min-w-0 transition-all duration-300 ease-in-out ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <AdminHeader />
          <main className="pt-24 px-8 pb-6 min-h-screen min-w-full">{children}</main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

export default AdminLayout;


