"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import useAuthStore from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  if (isAuthenticated) {
    return null; // Will redirect
  }

  return <AuthForm />;
}
