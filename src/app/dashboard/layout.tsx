import React from "react";
import { Metadata } from "next";
import DashboardLayoutClient from "./layout-client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GetAllPlaygroundForUser } from "@/modules/dashboard/actions/index"
import {DashboardSidebar} from "@/modules/dashboard/components/dashboard-sidebar"
import type { FormattedPlayground, PlaygroundWithUser } from "@/modules/dashboard/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    template: " %s - VibeCode",
    default: "VibeCode | Dashboard",
  },
};

export default async function ({
  children,
}:{
  children:React.ReactNode;
}) {

  let playgroundData: PlaygroundWithUser[] = [];
  try {
    playgroundData = await GetAllPlaygroundForUser();
  } catch (error) {
    console.error("Failed to load playgrounds in dashboard layout:", error);
  }

  const technologyIconMap: Record<string,string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",

  }

  const formattedPlaygroundData: FormattedPlayground[] = (playgroundData || []).map((item)=>({
    id:item.id,
    name:item.title,
    starred:item.StarMark?.[0]?.isMarked || false,
    icon: technologyIconMap[item.template] || "code2"
  }))


  return (
    
    <SidebarProvider>
      <div className="z-20 w-full">

       <DashboardLayoutClient>

         <DashboardSidebar initialPlaygroundData = {formattedPlaygroundData}/>
         {children}

       </DashboardLayoutClient>
      </div>
    </SidebarProvider>
  );
};
