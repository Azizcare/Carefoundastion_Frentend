"use client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const { canRender, isLoading } = useAdminAuth();

  if (isLoading || !canRender) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}







