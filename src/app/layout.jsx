"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { usePathname } from "next/navigation";
import Head from "next/head";

// Components
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import TopBar from "@/components/TopBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // Check if current route is admin or dashboard
  const isAdminRoute = pathname?.startsWith('/admin');
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const hidePublicLayout = isAdminRoute || isDashboardRoute;

  return (
    <html lang="en" className={`${inter.variable} overflow-x-hidden`} suppressHydrationWarning>
      <Head>
        <title>Care Foundation - India's Trusted Crowdfunding Platform</title>
        <meta name="description" content="Raise funds for medical emergencies, education, disaster relief & more. Start your fundraiser on India's most trusted crowdfunding platform." />
        <meta name="keywords" content="crowdfunding India, fundraising, medical fundraising, education funding, disaster relief" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-x-hidden`} suppressHydrationWarning>
        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        {/* Main Content */}
        <div className="min-h-screen flex flex-col">
          {/* Show public layout only for non-admin/dashboard routes */}
          {!hidePublicLayout && (
            <>
              <TopBar />
              <NavBar />
            </>
          )}

          <main className={hidePublicLayout ? "" : "flex-grow overflow-x-hidden w-full max-w-full"}>{children}</main>

          {/* Show footer only for non-admin/dashboard routes */}
          {!hidePublicLayout && <Footer />}
        </div>
      </body>
    </html>
  );
}
