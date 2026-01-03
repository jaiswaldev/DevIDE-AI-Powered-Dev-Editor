"use client";

import { useSession } from "next-auth/react";
import { logger } from "@/lib/logger";

export const useCurrentUser = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    logger.warn("Attempted to access user data without session");
    return null;
  }

  if (!session?.user) {
    logger.warn("Session exists but user data is missing");
    return null;
  }

  return session.user;
};