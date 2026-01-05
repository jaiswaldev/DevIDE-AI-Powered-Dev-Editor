import React from "react";
import { Metadata } from "next";
import DashboardLayoutClient from "./layout-client";

export const metadata: Metadata = {
  title: {
    template: " %s - VibeCode",
    default: "VibeCode | Dashboard",
  },
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  );
};

export default DashboardLayout;
