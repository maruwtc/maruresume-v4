import { ChevronLeft } from "lucide-react";
import { apps } from "@/components/os/data";
import { renderAppBody } from "@/components/os/AppBody";
import type { AppId, ThemeMode } from "@/components/os/types";

const appColors: Record<AppId, string> = {
  about:      "bg-blue-500",
  experience: "bg-orange-400",
  skills:     "bg-emerald-500",
  contact:    "bg-violet-500",
  projects:   "bg-sky-500",
  terminal:   "bg-slate-700",
  handbook:   "bg-rose-500",
  settings:   "bg-slate-400",
};

export function TabletShell({
  activeAppId,
  onOpenApp,
  onGoHome,
  dateText,
  clockText,
  themeMode,
  resolvedThemeMode,
  onSetThemeMode,
  wallpaperUrl,
}: {
  activeAppId: AppId | null;
  onOpenApp: (id: AppId) => void;
  onGoHome: () => void;
  dateText: string;
  clockText: string;
  themeMode: ThemeMode;
  resolvedThemeMode: "light" | "dark";
  onSetThemeMode: (mode: ThemeMode) => void;
  wallpaperUrl: string;
}) {
  const activeTabletApp = activeAppId ? apps.find((app) => app.id === activeAppId) : null;
  const dockAppIds: AppId[] = ["about", "experience", "skills", "contact", "projects", "settings"];
  const dockApps = dockAppIds.map((id) => apps.find((app) => app.id === id)).filter((app) => app !== undefined);
  const dark = resolvedThemeMode === "dark";

  const glassCard = "ios-glass";
  const glassBar  = "ios-glass-bar";
  const glassDock = "ios-glass-dock";

  return (
    <main className="os-shell fixed inset-0 h-[100dvh] w-full overflow-hidden [overscroll-behavior-y:none]">
      <div className="os-wallpaper" style={{ backgroundImage: `url(${wallpaperUrl})` }} aria-hidden="true" />

      {/* Top status bar — glass pill */}
      <header
        className={`fixed top-3 left-4 right-4 z-40 flex items-center rounded-xl px-3 py-1.5 ${glassCard}`}
      >
        {/* Left: date */}
        <span className={`text-[0.78rem] font-medium ${dark ? "text-white/60" : "text-slate-500"}`}>
          {dateText}
        </span>
        {/* Centre: active app name or brand */}
        <span className={`flex-1 text-center text-[0.82rem] font-semibold ${dark ? "text-white/85" : "text-slate-800"}`}>
          {activeTabletApp ? activeTabletApp.title : "Chris OS"}
        </span>
        {/* Right: time */}
        <span className={`text-[0.8rem] font-semibold tabular-nums ${dark ? "text-white/85" : "text-slate-800"}`}>
          {clockText.slice(0, 5)}
        </span>
      </header>

      {/* Home greeting */}
      {!activeTabletApp && (
        <div className="fixed left-0 right-0 z-20 flex flex-col items-center pointer-events-none" style={{ top: 68 }}>
          <span
            className="text-[2.4rem] font-thin tabular-nums leading-none"
            style={{ color: dark ? "rgba(255,255,255,0.82)" : "rgba(15,23,42,0.72)" }}
          >
            {clockText.slice(0, 5)}
          </span>
          <span
            className="text-[0.78rem] mt-1"
            style={{ color: dark ? "rgba(255,255,255,0.42)" : "rgba(15,23,42,0.42)" }}
          >
            {dateText}
          </span>
        </div>
      )}

      {/* Home app grid */}
      {!activeTabletApp && (
        <section
          className="grid [grid-template-columns:repeat(4,minmax(0,1fr))] gap-x-3.5 gap-y-4.5 px-5 pt-44 pb-31 [overscroll-behavior:contain]"
          aria-label="Tablet home apps"
        >
          {apps.map((app) => {
            const Icon = app.icon;
            const color = appColors[app.id] ?? "bg-slate-400";
            return (
              <button
                key={`tablet-home-${app.id}`}
                type="button"
                className={`grid justify-items-center gap-2 rounded-2xl border border-transparent bg-transparent p-2 text-center text-[0.85rem] font-medium transition-transform duration-150 active:scale-90 ${
                  dark
                    ? "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
                    : "text-slate-900 [text-shadow:0_1px_1.5px_rgba(255,255,255,0.65)]"
                }`}
                onClick={() => onOpenApp(app.id)}
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-[13px] ${color}`}>
                  <Icon className="h-5 w-5 text-white" />
                </span>
                <span>{app.title}</span>
              </button>
            );
          })}
        </section>
      )}

      {/* Active app view */}
      {activeTabletApp && (
        <section className="fixed inset-0" aria-label={`${activeTabletApp.title} app`}>
          <article
            key={`tablet-app-${activeTabletApp.id}`}
            className={`grid h-full grid-rows-[auto_1fr] overflow-hidden ${glassCard}`}
          >
            <header className={`flex items-center gap-2.5 px-3 py-2.5 ${glassBar}`}>
              <button
                type="button"
                className={`inline-flex items-center gap-0.5 text-[0.85rem] font-semibold transition-opacity active:opacity-55 ${
                  dark ? "text-sky-400" : "text-blue-600"
                }`}
                onClick={onGoHome}
                aria-label="Back to Home"
              >
                <ChevronLeft className="h-4 w-4 -ml-1" strokeWidth={2.5} />
                <span>Home</span>
              </button>
              <div className={`flex-1 inline-flex items-center justify-center gap-2 text-[0.92rem] font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                <activeTabletApp.icon className="h-4 w-4" />
                <span>{activeTabletApp.title}</span>
              </div>
              <div style={{ width: 64 }} />
            </header>

            <div className="overflow-auto p-4 [overscroll-behavior:contain] [-webkit-overflow-scrolling:touch]">
              {renderAppBody(activeTabletApp.id, onOpenApp, {
                themeMode,
                resolvedThemeMode,
                onSetThemeMode,
              })}
            </div>
          </article>
        </section>
      )}

      {/* Tablet Dock — hidden when an app is open */}
      {!activeTabletApp && <nav
        className={`fixed left-1/2 z-45 grid w-[min(680px,calc(100vw-1.2rem))] -translate-x-1/2 [grid-template-columns:repeat(6,minmax(0,1fr))] gap-2 rounded-[22px] px-2 pt-1.5 pb-1 [bottom:calc(0.5rem+env(safe-area-inset-bottom))] ${glassDock}`}
        aria-label="Tablet dock"
      >
        {dockApps.map((app) => {
          const Icon = app.icon;
          const isActive = activeAppId === app.id;
          const color = appColors[app.id] ?? "bg-slate-400";

          return (
            <button
              key={`tablet-dock-${app.id}`}
              type="button"
              className={`relative grid justify-items-center gap-1 py-1 rounded-2xl transition-transform duration-100 active:scale-90 ${
                isActive ? "-translate-y-1 scale-[1.06]" : ""
              }`}
              onClick={() => (isActive ? onGoHome() : onOpenApp(app.id))}
              aria-label={`Open ${app.title}`}
            >
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-[11px] ${color}`}>
                <Icon className="h-4 w-4 text-white" />
              </span>
              <span className={`text-[0.6rem] leading-none font-medium ${dark ? "text-white/70" : "text-slate-700/80"}`}>{app.title}</span>
              {isActive && (
                <span className={`absolute -bottom-0.5 h-1 w-1 rounded-full ${dark ? "bg-white/80" : "bg-slate-900/55"}`} />
              )}
            </button>
          );
        })}
      </nav>}
    </main>
  );
}
