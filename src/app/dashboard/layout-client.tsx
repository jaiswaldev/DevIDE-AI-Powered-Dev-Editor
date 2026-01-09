"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DashboardLayoutClient: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { status } = useSession();
  const router = useRouter();
  
  // Initialize all refs at the top (before any early returns)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  
  const [sidebarWidth, setSidebarWidth] = useState<number>(280);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth/signup");
    }
  }, [status, router]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const delta = e.clientX - startXRef.current;
      const newWidth = Math.max(160, Math.min(720, startWidthRef.current + delta));
      setSidebarWidth(newWidth);
    };

    const onMouseUp = () => {
      if (isResizingRef.current) {
        isResizingRef.current = false;
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  if (status === "loading") {
    return <div className="flex items-center justify-center">Loading...</div>;
  }

  // Expecting two children: sidebar and main content
  const childArray = React.Children.toArray(children);
  const sidebar = childArray[0] ?? null;
  const main = childArray[1] ?? childArray.slice(1);

  const onMouseDown = (e: React.MouseEvent) => {
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startWidthRef.current = sidebarWidth;
    document.body.style.userSelect = "none";
  };

  return (
    <div ref={containerRef} className="flex w-full">
      <div style={{ width: sidebarWidth }} className="h-full overflow-hidden">
        {sidebar}
      </div>

      <div
        onMouseDown={onMouseDown}
        className="h-full cursor-col-resize"
        style={{ width: 6, flex: "0 0 6px" }}
        aria-hidden
      >
        <div className="h-full w-full bg-transparent hover:bg-slate-200/60" />
      </div>

      <div className="flex-1 h-full overflow-auto">
        {main}
      </div>
    </div>
  );
};

export default DashboardLayoutClient;
