export default function TopNavBar({ title }: { title: string }) {
  return (
    <header className="flex justify-between items-center h-16 px-gutter w-full bg-surface dark:bg-surface-dark border-b border-border-hairline sticky top-0 z-40">
      <div className="flex items-center gap-md">
        <span className="md:hidden font-headline-md font-bold text-primary">Cindro</span>
        <h2 className="hidden md:block font-headline-md text-primary">{title}</h2>
      </div>

      <div className="flex items-center gap-lg">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm" data-icon="search">search</span>
          <input 
            className="pl-10 pr-4 py-1.5 bg-surface-container-low border border-border-hairline rounded text-sm focus:outline-none focus:border-primary w-64" 
            placeholder="Search deals..." 
            type="text" 
          />
        </div>

        <div className="flex items-center gap-md">
          <button className="material-symbols-outlined text-secondary cursor-pointer hover:text-on-tertiary-container transition-colors" data-icon="notifications">notifications</button>
          <button className="material-symbols-outlined text-secondary cursor-pointer hover:text-on-tertiary-container transition-colors" data-icon="help_outline">help_outline</button>
        </div>
      </div>
    </header>
  );
}
