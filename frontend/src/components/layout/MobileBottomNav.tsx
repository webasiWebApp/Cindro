import Link from "next/link";

export default function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 w-full z-50 bg-surface dark:bg-surface-dark border-t border-border-hairline flex justify-around items-center h-16 pb-safe">
      <Link className="flex flex-col items-center justify-center text-on-tertiary-container font-bold scale-95 transition-transform active:bg-surface-container px-4" href="/dashboard">
        <span className="material-symbols-outlined" data-icon="home">home</span>
        <span className="font-label-sm">Home</span>
      </Link>
      <Link className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim scale-95 transition-transform active:bg-surface-container px-4" href="/deals">
        <span className="material-symbols-outlined" data-icon="handshake">handshake</span>
        <span className="font-label-sm">Deals</span>
      </Link>
      <Link className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim scale-95 transition-transform active:bg-surface-container px-4" href="/reports">
        <span className="material-symbols-outlined" data-icon="insights">insights</span>
        <span className="font-label-sm">Reports</span>
      </Link>
      <Link className="flex flex-col items-center justify-center text-secondary dark:text-secondary-fixed-dim scale-95 transition-transform active:bg-surface-container px-4" href="/settings">
        <span className="material-symbols-outlined" data-icon="settings">settings</span>
        <span className="font-label-sm">Settings</span>
      </Link>
    </nav>
  );
}
