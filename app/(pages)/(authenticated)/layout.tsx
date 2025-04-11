"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const auth = getAuth();
  const router = useRouter();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      console.log(uid);
    } else {
      // User is signed out
      console.log("user is signed out");
      router.push("/login");
    }
  });
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="w-full flex flex-col">
        <div className="flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
}
