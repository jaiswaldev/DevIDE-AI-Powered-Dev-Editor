"use client";

import { usePathname } from "next/navigation";
import Footer from "./footer";

export function FooterWrapper() {
  const pathname = usePathname();
  const isAuthPage = pathname.includes("/auth/login") || pathname.includes("/auth/signup");

  if (isAuthPage) {
    return null;
  }

  return <Footer />;
}
