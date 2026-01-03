
"use client";

import React, { useState } from "react";
import { LogoutButtonProps } from "../types";
import { signOut } from "next-auth/react";
import { logger } from "@/lib/logger";

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onLogout = async () => {
    try {
      setIsLoading(true);
      logger.info("Initiating logout");

      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      logger.error(`Logout error: ${errorMsg}`);
      window.location.href = "/";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onLogout}
      disabled={isLoading}
      className="cursor-pointer hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Signing out..." : children}
    </button>
  );
};

export default LogoutButton;
