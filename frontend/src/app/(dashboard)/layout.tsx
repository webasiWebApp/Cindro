import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import TopNavBar from "@/components/layout/TopNavBar";
import MobileBottomNav from "@/components/layout/MobileBottomNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="md:ml-64 min-h-screen pb-xl md:pb-0 relative">
        {/* We can pass title dynamically or rely on the page components, but for now we let the page components render their own title or just have a generic TopNavBar */}
        <TopNavBar title="Cindro" />
        <div className="px-margin-mobile md:px-margin-desktop py-xl max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
      <MobileBottomNav />
      <button className="fixed bottom-20 right-6 md:bottom-10 md:right-10 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-black/90 transition-transform active:scale-95 z-40">
        <span className="material-symbols-outlined" data-icon="add">add</span>
      </button>
    </>
  );
}
