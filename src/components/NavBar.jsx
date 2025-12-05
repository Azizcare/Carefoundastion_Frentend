"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import AuthForm from "@/components/AuthForm";
import useAuthStore from "@/store/authStore";

export default function NavBar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Start a fundraiser", href: "/startfundraiser" },
    { label: "Fundraised", href: "/fundraisers" },
    { label: "Food Partners", href: "/partners/food" },
    { label: "Health Partners", href: "/partners/health" },
    { label: "Become A Partner", href: "/partner" },
    { label: "Become A Volunteer", href: "/volunteer" },
  ];

  const handleClick = (path, modalSetter) => {
    if (path) router.push(path);
    if (modalSetter) modalSetter(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect after logout completes (or fails gracefully)
      router.push("/");
    } catch (error) {
      // Even if logout fails, redirect user
      console.warn("Logout error (redirecting anyway):", error);
      router.push("/");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-2xl transition-all duration-300 relative">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-pink-500"></div>
        <div className="max-w-full mx-auto flex items-center justify-between px-2 py-3">
          
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.webp"
              alt="Care Foundation Logo"
              width={200}
              height={85}
              className="rounded-md hover:scale-105 transition-transform duration-300"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.slice(0, 1).map((link) => (
              <button
                key={link.label}
                onClick={() => handleClick(link.href)}
                className="text-gray-800 font-semibold text-lg hover:text-green-600 transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}

            <div className="flex items-center gap-4">
              
              <div className="relative group">
                <button className="font-semibold text-gray-800 hover:text-green-600 transition-colors duration-300 text-lg relative">
                  Crowd Funding
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => handleClick("/startfundraiser")}
                    className="block text-gray-800 hover:text-green-600 px-5 py-3 hover:bg-green-50 w-full text-left transition-all duration-200 border-b border-gray-100 last:border-b-0"
                  >
                    Start a Fundraiser
                  </button>
                  <button
                    onClick={() => handleClick("/fundraised")}
                    className="block text-gray-800 hover:text-green-600 px-5 py-3 hover:bg-green-50 w-full text-left transition-all duration-200 border-b border-gray-100 last:border-b-0"
                  >
                    Fundraised
                  </button>
                  <button
                    onClick={() => handleClick("/fundraisers")}
                    className="block text-gray-800 hover:text-green-600 px-5 py-3 hover:bg-green-50 w-full text-left transition-all duration-200"
                  >
                    Fundraiser
                  </button>
                </div>
              </div>

              <div className="relative group">
                <button className="font-semibold text-gray-800 hover:text-green-600 transition-colors duration-300 text-lg relative">
                  Partners
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => handleClick("/partners/food")}
                    className="block px-5 py-3 text-gray-800 hover:text-green-600 hover:bg-green-50 w-full text-left transition-all duration-200 border-b border-gray-100 last:border-b-0"
                  >
                    Food Partners
                  </button>
                  <button
                    onClick={() => handleClick("/partners/health")}
                    className="block px-5 py-3 text-gray-800 hover:text-green-600 hover:bg-green-50 w-full text-left transition-all duration-200"
                  >
                    Health Partners
                  </button>
                </div>
              </div>

              <div className="relative group">
                <button className="font-semibold text-gray-800 hover:text-green-600 transition-colors duration-300 text-lg relative">
                  Join Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => handleClick("/partner")}
                    className="block px-5 py-3 text-gray-800 hover:text-green-600 hover:bg-green-50 w-full text-left transition-all duration-200 border-b border-gray-100"
                  >
                    Become A Partner
                  </button>
                  <button
                    onClick={() => handleClick("/volunteer")}
                    className="block px-5 py-3 text-gray-800 hover:text-green-600 hover:bg-green-50 w-full text-left transition-all duration-200 border-b border-gray-100"
                  >
                    Become A Volunteer
                  </button>
                  <button
                    onClick={() => handleClick("/volunteers")}
                    className="block px-5 py-3 text-gray-800 hover:text-green-600 hover:bg-green-50 w-full text-left transition-all duration-200"
                  >
                    Volunteer Directory
                  </button>
                </div>
              </div>

              <div className="relative group">
                <button className="font-semibold text-gray-800 hover:text-green-600 transition-colors duration-300 text-lg relative">
                  More
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => handleClick("/events")}
                    className="block px-5 py-3 text-gray-800 hover:text-green-600 hover:bg-green-50 w-full text-left transition-all duration-200 border-b border-gray-100"
                  >
                    Events
                  </button>
                  <button
                    onClick={() => handleClick("/transparency")}
                    className="block px-5 py-3 text-gray-800 hover:text-green-600 hover:bg-green-50 w-full text-left transition-all duration-200 border-b border-gray-100"
                  >
                    Transparency
                  </button>
                  <button
                    onClick={() => handleClick("/founder")}
                    className="block px-5 py-3 text-gray-800 hover:text-green-600 hover:bg-green-50 w-full text-left transition-all duration-200"
                  >
                    Founder
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {isAuthenticated ? (
                  <>
                    {/* TEMPORARILY HIDDEN - User Dashboard (Will be enabled later) */}
                    {/* <button
                      onClick={() => handleClick('/dashboard')}
                      className="border-2 border-blue-500 text-blue-600 px-6 py-2 rounded-md font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
                    >
                      Dashboard
                    </button> */}
                    <button
                      onClick={handleLogout}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleClick(undefined, setShowLogin)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </nav>

          <button
            className="md:hidden text-gray-700 text-3xl focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white shadow-xl border-t border-gray-200 px-6 py-5 space-y-3 animate-fadeIn">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  handleClick(link.href);
                  setMenuOpen(false);
                }}
                className="block w-full text-left text-gray-800 font-semibold text-lg hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-all duration-200"
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  {/* TEMPORARILY HIDDEN - User Dashboard (Will be enabled later) */}
                  {/* <button
                    onClick={() => {
                      handleClick('/dashboard');
                      setMenuOpen(false);
                    }}
                    className="border-2 border-blue-500 text-blue-600 px-5 py-2 rounded-md font-semibold hover:bg-blue-500 hover:text-white transition text-center"
                  >
                    Dashboard
                  </button> */}
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 shadow-md transition-all text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setMenuOpen(false);
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 shadow-md transition-all text-center"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Form Modal (Login & Register) */}
      {showLogin && (
        <div className="fixed inset-0 z-[999] bg-white overflow-auto">
          <button
            onClick={() => setShowLogin(false)}
            className="absolute top-3 right-3 text-gray-700 text-xl hover:text-red-500 z-50"
          >
            ✕
          </button>
          <AuthForm />
        </div>
      )}
    </>
  );
}


