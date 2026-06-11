"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    authService.getMe()
      .then(setUser)
      .catch(() => {
        // Ignore error, might not be logged in or bypass is active
      });
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface dark:bg-surface-dark border-r border-border-hairline flex-col py-lg px-md z-50 hidden md:flex">
      <div className="mb-xl">
        <h1 className="font-headline-md text-primary dark:text-primary-fixed tracking-tight">Cindro</h1>
        <p className="font-label-md text-secondary opacity-70">Deal Tracker</p>
      </div>
      
      <nav className="flex-1 space-y-2">
        <Link
          className="flex items-center gap-md py-sm px-md text-primary dark:text-primary-fixed font-bold border-r-2 border-on-tertiary-container hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors active:scale-95 duration-150"
          href="/dashboard"
        >
          <span className="material-symbols-outlined" data-icon="dashboard">dashboard</span>
          <span className="font-label-md">Dashboard</span>
        </Link>
        <Link
          className="flex items-center gap-md py-sm px-md text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors active:scale-95 duration-150"
          href="/deals/new"
        >
          <span className="material-symbols-outlined" data-icon="add_box">add_box</span>
          <span className="font-label-md">New Deal</span>
        </Link>
        <Link
          className="flex items-center gap-md py-sm px-md text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors active:scale-95 duration-150"
          href="/deals"
        >
          <span className="material-symbols-outlined" data-icon="history">history</span>
          <span className="font-label-md">History</span>
        </Link>
        <Link
          className="flex items-center gap-md py-sm px-md text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors active:scale-95 duration-150"
          href="/reports"
        >
          <span className="material-symbols-outlined" data-icon="assessment">assessment</span>
          <span className="font-label-md">Reports</span>
        </Link>
        <Link
          className="flex items-center gap-md py-sm px-md text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors active:scale-95 duration-150"
          href="/investors"
        >
          <span className="material-symbols-outlined" data-icon="group">group</span>
          <span className="font-label-md">Investors</span>
        </Link>
        <Link
          className="flex items-center gap-md py-sm px-md text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors active:scale-95 duration-150"
          href="/settings"
        >
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
          <span className="font-label-md">Settings</span>
        </Link>
      </nav>

      <div className="mt-auto flex flex-col gap-sm p-md border-t border-border-hairline">
        <Link href="/profile" className="flex items-center gap-md hover:bg-surface-container-low dark:hover:bg-surface-container-highest transition-colors p-2 rounded-md group">
          <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden shrink-0">
              <div className="w-full h-full bg-secondary-container text-primary flex items-center justify-center font-bold">
                {initials}
              </div>
          </div>
          <div className="overflow-hidden">
            <p className="font-label-md truncate group-hover:text-primary transition-colors">{user?.name || 'Loading...'}</p>
            <p className="text-xs text-secondary truncate">{user?.role || ''}</p>
          </div>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 py-2 px-4 w-full text-error hover:bg-error-container hover:text-on-error-container transition-colors rounded-md text-sm font-bold"
        >
          <span className="material-symbols-outlined text-[18px]" data-icon="logout">logout</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
