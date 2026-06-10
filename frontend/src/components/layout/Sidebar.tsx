import Link from "next/link";

export default function Sidebar() {
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

      <div className="mt-auto flex items-center gap-md p-md border-t border-border-hairline">
        <div className="w-10 h-10 rounded-full bg-surface-container overflow-hidden">
            {/* Placeholder for user avatar */}
            <div className="w-full h-full bg-secondary-container text-primary flex items-center justify-center font-bold">AS</div>
        </div>
        <div className="overflow-hidden">
          <p className="font-label-md truncate">Alex Sterling</p>
          <p className="text-xs text-secondary truncate">Principal Analyst</p>
        </div>
      </div>
    </aside>
  );
}
