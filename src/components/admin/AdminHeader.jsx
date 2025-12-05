"use client";
import React, { useState, useEffect } from "react";
import { BiUser, BiArrowToRight, BiChevronDown } from "react-icons/bi";
import Link from "next/link";
import api from "@/utils/api";
import { useSidebar } from "./AdminLayout";

export default function AdminHeader() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isSidebarOpen, toggleSidebar } = useSidebar();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data || response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleToggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Get user initials
  const getInitials = (name) => {
    if (!name) return "A";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = user?.name || "Admin";
  const displayEmail = user?.email || "admin@carefoundation.com";
  const initials = getInitials(displayName);

  return (
    <header className={`fixed top-0 right-0 flex items-center justify-between bg-gradient-to-r from-white via-blue-50 to-green-50 shadow-lg z-40 px-8 py-4 border-b-2 border-gray-200 min-w-full transition-all duration-300 ease-in-out ${
      isSidebarOpen ? 'left-64' : 'left-0'
    }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-white transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200 flex items-center justify-center"
          title={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 w-full bg-gray-700 rounded transition-all duration-300 ${
              isSidebarOpen ? 'rotate-45 translate-y-2' : ''
            }`}></span>
            <span className={`block h-0.5 w-full bg-gray-700 rounded transition-all duration-300 ${
              isSidebarOpen ? 'opacity-0' : 'opacity-100'
            }`}></span>
            <span className={`block h-0.5 w-full bg-gray-700 rounded transition-all duration-300 ${
              isSidebarOpen ? '-rotate-45 -translate-y-2' : ''
            }`}></span>
          </div>
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
      </div>
      <div className="relative">
        <button
          onClick={handleToggleDropdown}
          className="flex items-center gap-3 focus:outline-none hover:bg-white rounded-xl px-4 py-2 transition-all duration-200 shadow-md hover:shadow-lg border border-gray-200"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">{loading ? "..." : initials}</span>
          </div>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-gray-900 font-semibold text-sm">
              {loading ? "Loading..." : displayName}
            </span>
            <span className="text-gray-500 text-xs">{user?.role || "Admin"}</span>
          </div>
          <BiChevronDown className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <ul className="absolute right-0 mt-2 w-64 bg-white border-2 border-gray-200 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-sm">
            <li className="px-5 py-3 border-b-2 border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
              <h6 className="font-semibold text-gray-900">
                {loading ? "Loading..." : displayName}
              </h6>
              <span className="text-gray-500 text-xs block mt-1">
                {loading ? "..." : displayEmail}
              </span>
            </li>

            <li>
              <Link
                href="/admin/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
              >
                <BiUser className="text-gray-600 text-lg" />
                <span className="text-gray-700 font-medium text-sm">
                  My Profile
                </span>
              </Link>
            </li>

            <li>
              <Link
                href="/logout"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200 text-red-600 border-l-2 border-transparent hover:border-red-500"
              >
                <BiArrowToRight className="text-lg" />
                <span className="font-medium text-sm">
                  Sign Out
                </span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
}


