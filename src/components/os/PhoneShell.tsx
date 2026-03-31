"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft } from "lucide-react";
import { apps } from "@/components/os/data";
import { renderAppBody } from "@/components/os/AppBody";
import { CalendarWidget } from "@/components/os/CalendarWidget";
import type { AppId, LiquidGlassMode, ThemeMode } from "@/components/os/types";

/** Per-app flat colours */
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

export function PhoneShell({
  activeAppId,
  onOpenApp,
  onGoHome,
  liquidGlassMode,
  onSetLiquidGlassMode,
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
  liquidGlassMode: LiquidGlassMode;
  onSetLiquidGlassMode: (mode: LiquidGlassMode) => void;
  themeMode: ThemeMode;
  resolvedThemeMode: "light" | "dark";
  onSetThemeMode: (mode: ThemeMode) => void;
  wallpaperUrl: string;
}) {
  const activePhoneApp = activeAppId ? apps.find((app) => app.id === activeAppId) : null;
  const dockAppIds: AppId[] = ["about", "experience", "skills", "contact", "settings"];
  const dockApps = dockAppIds.map((id) => apps.find((app) => app.id === id)).filter((app) => app !== undefined);
  const clearGlass = liquidGlassMode === "clear";
  const dark = resolvedThemeMode === "dark";

  const homeScrollRef = useRef<HTMLDivElement>(null);
  const [homePage, setHomePage] = useState(1);

  // Auto-scroll to app grid (page 1) when returning home
  useEffect(() => {
    if (!activePhoneApp && homeScrollRef.current) {
      homeScrollRef.current.scrollTo({ left: homeScrollRef.current.offsetWidth, behavior: "instant" });
      setHomePage(1);
    }
  }, [activePhoneApp]);

  const handleHomeScroll = () => {
    const el = homeScrollRef.current;
    if (!el) return;
    const page = Math.round(el.scrollLeft / el.offsetWidth);
    setHomePage(page);
  };

  // Keyboard: Escape = go home
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeAppId) onGoHome();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeAppId, onGoHome]);

  // CSS glass class tokens — all theming is in globals.css via body.theme-dark
  const glassCard = clearGlass ? "ios-glass-clear" : "ios-glass";
  const glassBar  = clearGlass ? "ios-glass-bar-clear" : "ios-glass-bar";
  const glassDock = clearGlass ? "ios-glass-dock-clear" : "ios-glass-dock";

  return (
    <main className="os-shell fixed inset-0 h-[100dvh] w-full overflow-hidden [overscroll-behavior-y:none]">
      <div className="os-wallpaper" style={{ backgroundImage: `url(${wallpaperUrl})` }} aria-hidden="true" />

      {/* Top bar — floating pill, mirrors dock */}
      {!activePhoneApp && (
        <header className={`fixed top-2.5 left-1/2 -translate-x-1/2 z-40 flex items-center justify-center w-[calc(100vw-1.5rem)] max-w-[380px] h-10 rounded-[20px] ${glassDock}`}>
          <span className={`text-[0.78rem] font-semibold tracking-[0.06em] uppercase ${dark ? "text-white/80" : "text-slate-700"}`}>
            Chris OS
          </span>
        </header>
      )}

      {/* Home — horizontal scroll: [calendar | app grid] */}
      {!activePhoneApp && (
        <div
          ref={homeScrollRef}
          className="fixed left-0 right-0 flex overflow-x-scroll overflow-y-hidden [scroll-snap-type:x_mandatory] [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ top: 54, bottom: "calc(112px + env(safe-area-inset-bottom))" }}
          onScroll={handleHomeScroll}
        >
          {/* Page 0: Calendar */}
          <div className="min-w-full h-full [scroll-snap-align:start] flex flex-col px-4 py-6">
            <CalendarWidget dark={dark} glassCard={glassCard} />
          </div>

          {/* Page 1: App grid */}
          <div className="min-w-full h-full [scroll-snap-align:start] overflow-y-auto [overscroll-behavior:contain]">
            <section
              className="grid [grid-template-columns:repeat(4,minmax(0,1fr))] gap-x-2 gap-y-5 px-4 pt-4 pb-4"
              aria-label="Phone home apps"
            >
              {apps.map((app) => {
                const Icon = app.icon;
                const color = appColors[app.id] ?? "bg-slate-400";
                return (
                  <button
                    key={`phone-home-${app.id}`}
                    type="button"
                    className={`grid justify-items-center gap-1.5 rounded-xl border border-transparent bg-transparent p-1 text-center text-[0.68rem] font-medium transition-transform duration-150 active:scale-90 ${
                      dark
                        ? "text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]"
                        : "text-slate-900 [text-shadow:0_1px_1.5px_rgba(255,255,255,0.65)]"
                    }`}
                    onClick={() => onOpenApp(app.id)}
                  >
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-[13px] ${color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </span>
                    <span className="leading-tight">{app.title}</span>
                  </button>
                );
              })}
            </section>
          </div>
        </div>
      )}

      {/* Page dots */}
      {!activePhoneApp && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5"
          style={{ bottom: "calc(88px + env(safe-area-inset-bottom))" }}
        >
          {[0, 1].map((i) => (
            <span
              key={i}
              className={`block rounded-full transition-all duration-200 ${
                homePage === i
                  ? `w-4 h-1.5 ${dark ? "bg-white/90" : "bg-slate-800/70"}`
                  : `w-1.5 h-1.5 ${dark ? "bg-white/35" : "bg-slate-800/30"}`
              }`}
            />
          ))}
        </div>
      )}

      {/* Active app view */}
      {activePhoneApp && (
        <section
          className="phone-app-in fixed inset-0"
          aria-label={`${activePhoneApp.title} app`}
        >
          <article
            className={`grid h-full grid-rows-[auto_1fr] overflow-hidden ${glassCard}`}
          >
            {/* App header bar — separate glass layer that blurs content scrolling under it */}
            <header className={`flex items-center gap-2.5 px-3 py-2.5 ${glassBar}`}>
              <button
                type="button"
                className={`inline-flex items-center gap-0.5 text-[0.82rem] font-semibold transition-opacity active:opacity-55 ${
                  dark ? "text-sky-400" : "text-blue-600"
                }`}
                onClick={onGoHome}
                aria-label="Back to Home"
              >
                <ChevronLeft className="h-4 w-4 -ml-1" strokeWidth={2.5} />
                <span>Home</span>
              </button>
              <div className={`flex-1 inline-flex items-center justify-center gap-1.5 text-[0.9rem] font-semibold ${dark ? "text-white" : "text-slate-900"}`}>
                <activePhoneApp.icon className="h-4 w-4" />
                <span>{activePhoneApp.title}</span>
              </div>
              {/* Symmetry spacer */}
              <div style={{ width: 56 }} />
            </header>

            <div className="overflow-auto p-3.5 [overscroll-behavior:contain] [-webkit-overflow-scrolling:touch]">
              {renderAppBody(activePhoneApp.id, onOpenApp, {
                liquidGlassMode,
                onSetLiquidGlassMode,
                themeMode,
                resolvedThemeMode,
                onSetThemeMode,
              })}
            </div>
          </article>
        </section>
      )}

      {/* iOS Dock — hidden when an app is open */}
      {!activePhoneApp && <nav
        className={`fixed left-1/2 z-45 -translate-x-1/2 grid w-[calc(100vw-1.5rem)] max-w-[380px] [grid-template-columns:repeat(5,minmax(0,1fr))] items-center gap-1 rounded-[28px] px-2.5 py-2 [bottom:calc(0.65rem+env(safe-area-inset-bottom))] ${glassDock}`}
        aria-label="Phone dock"
      >
        {dockApps.map((app) => {
          const Icon = app.icon;
          const isActive = activeAppId === app.id;
          const color = appColors[app.id] ?? "bg-slate-400";

          return (
            <button
              key={`phone-dock-${app.id}`}
              type="button"
              className={`relative grid justify-items-center gap-1 py-1 rounded-2xl transition-transform duration-100 active:scale-90 ${
                isActive ? "-translate-y-1 scale-[1.06]" : ""
              }`}
              onClick={() => (isActive ? onGoHome() : onOpenApp(app.id))}
              aria-label={`Open ${app.title}`}
            >
              <span className={`inline-flex h-9 w-9 items-center justify-center rounded-[11px] ${color}`}>
                <Icon className="h-4.5 w-4.5 text-white" />
              </span>
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
