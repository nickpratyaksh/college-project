"use client";

import axios from "axios";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  axios.defaults.baseURL = "http://localhost:11434";
  axios.defaults.headers["Content-Type"] = "application/json";

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
}
