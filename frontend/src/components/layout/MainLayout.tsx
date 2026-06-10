import React from "react";
import Sidebar from "./Sidebar";
import TopNavBar from "./TopNavBar";
import MobileBottomNav from "./MobileBottomNav";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <>
      <Sidebar />
      <main className="md:ml-64 min-h-screen pb-xl md:pb-0">
        <TopNavBar title={title} />
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
