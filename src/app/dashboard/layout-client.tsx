"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signup");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center">Loading...</div>
    );
  }

  return <>{children}</>;
};

export default DashboardLayoutClient;
