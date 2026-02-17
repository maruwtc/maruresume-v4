import { ArrowLeft, House } from "lucide-react";
import { apps } from "@/components/os/data";
import { renderAppBody } from "@/components/os/AppBody";
import type { AppId, LiquidGlassMode, ThemeMode } from "@/components/os/types";

export function PhoneShell({
  activeAppId,
  onOpenApp,
  onGoHome,
  dateText,
  clockText,
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

  return (
    <main className="os-shell fixed inset-0 h-[100dvh] w-full overflow-hidden [overscroll-behavior-y:none]">
      <div className="os-wallpaper" style={{ backgroundImage: `url(${wallpaperUrl})` }} aria-hidden="true" />

      <header
        className={`fixed top-2.5 left-3 right-3 z-40 flex items-center justify-between rounded-xl px-2 py-1 text-[0.72rem] font-semibold backdrop-blur-[18px] ${
          dark ? "text-slate-100" : "text-slate-800"
        } ${
          clearGlass
            ? dark
              ? "border border-slate-300/25 bg-slate-950/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] backdrop-saturate-110"
              : "border border-white/40 bg-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-saturate-110"
            : dark
              ? "border border-slate-200/28 bg-slate-900/42 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-saturate-140"
              : "border border-white/60 bg-slate-50/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-saturate-150"
        }`}
      >
        <span>{dateText}</span>
        <span>{clockText}</span>
      </header>

      {!activePhoneApp && (
        <section
          className="grid [grid-template-columns:repeat(3,minmax(0,1fr))] gap-x-2.5 gap-y-3.5 px-3 pt-13 pb-28 [overscroll-behavior:contain]"
          aria-label="Phone home apps"
        >
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={`phone-home-${app.id}`}
                type="button"
                className={`grid justify-items-center gap-1.5 rounded-xl border border-transparent bg-transparent p-1 text-center text-xs transition-transform duration-200 ease-out active:scale-95 ${
                  dark ? "text-slate-100 active:border-slate-200/20 active:bg-white/15" : "text-slate-900 active:border-slate-900/20 active:bg-white/45"
                }`}
                onClick={() => onOpenApp(app.id)}
              >
                <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${dark ? "border-slate-200/30 bg-slate-950/40" : "border-slate-900/20 bg-slate-50/90"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span>{app.title}</span>
              </button>
            );
          })}
        </section>
      )}

      {activePhoneApp && (
        <section className="px-2.5 pt-12.5 pb-[calc(4.75rem+env(safe-area-inset-bottom))]" aria-label={`${activePhoneApp.title} app`}>
          <article
            key={`phone-app-${activePhoneApp.id}`}
            className={`grid min-h-[calc(100svh-10.5rem)] max-h-[calc(100svh-10.5rem)] grid-rows-[auto_1fr] overflow-hidden rounded-2xl backdrop-blur-[22px] ${
              clearGlass
                ? dark
                  ? "border border-slate-300/25 bg-slate-900/20 backdrop-saturate-110"
                  : "border border-white/45 bg-white/20 backdrop-saturate-110"
                : dark
                  ? "border border-slate-200/28 bg-slate-900/44 backdrop-saturate-140"
                  : "border border-white/65 bg-slate-50/60 backdrop-saturate-150"
            }`}
          >
            <header
              className={`grid grid-cols-[auto_1fr_auto] items-center gap-2 px-2.5 py-2 backdrop-blur-[14px] ${
                clearGlass
                  ? "border-b border-white/35 bg-white/12 backdrop-saturate-105"
                  : "border-b border-white/55 bg-slate-100/50 backdrop-saturate-130"
              }`}
            >
              <button
                type="button"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border ${dark ? "border-slate-200/30 bg-slate-900/55 text-slate-100" : "border-slate-900/20 bg-slate-50/85 text-slate-900"}`}
                onClick={onGoHome}
                aria-label="Back to Home"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className={`inline-flex items-center justify-center gap-1.5 text-[0.95rem] font-bold ${dark ? "text-slate-100" : "text-slate-900"}`}>
                <activePhoneApp.icon className="h-4 w-4" />
                <span>{activePhoneApp.title}</span>
              </div>
              <button
                type="button"
                className={`inline-flex h-8 w-8 items-center justify-center rounded-xl border ${dark ? "border-slate-200/30 bg-slate-900/55 text-slate-100" : "border-slate-900/20 bg-slate-50/85 text-slate-900"}`}
                onClick={onGoHome}
                aria-label="Go Home"
              >
                <House className="h-4 w-4" />
              </button>
            </header>
            <div className="overflow-auto p-3 [overscroll-behavior:contain] [-webkit-overflow-scrolling:touch]">
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

      <nav
        className={`fixed left-1/2 z-45 grid w-[calc(100vw-1rem)] max-w-[420px] -translate-x-1/2 [grid-template-columns:repeat(5,minmax(0,1fr))] gap-1.5 rounded-[22px] px-1.5 pt-1.5 pb-1 backdrop-blur-[24px] [bottom:calc(0.5rem+env(safe-area-inset-bottom))] ${
          clearGlass
            ? dark
              ? "border border-slate-300/25 bg-slate-900/24 backdrop-saturate-110 shadow-[0_12px_26px_rgba(2,8,23,0.24),inset_0_1px_0_rgba(255,255,255,0.2)]"
              : "border border-white/42 bg-white/20 backdrop-saturate-110 shadow-[0_12px_26px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.42)]"
            : dark
              ? "border border-slate-200/30 bg-slate-900/44 backdrop-saturate-[1.45] shadow-[0_16px_34px_rgba(2,8,23,0.3),inset_0_1px_0_rgba(255,255,255,0.22)]"
              : "border border-white/70 bg-slate-50/50 backdrop-saturate-[1.65] shadow-[0_16px_34px_rgba(2,8,23,0.2),inset_0_1px_0_rgba(255,255,255,0.64)]"
        }`}
        aria-label="Phone dock"
      >
        {dockApps.map((app) => {
          const Icon = app.icon;
          const isActive = activeAppId === app.id;

          return (
            <button
              key={`phone-dock-${app.id}`}
              type="button"
              className={`relative grid min-h-13 content-center justify-items-center gap-0.5 rounded-2xl border transition-transform duration-150 ${isActive
                ? dark
                  ? "border-slate-200/40 bg-slate-100/20 text-slate-100 -translate-y-0.5 scale-[1.02]"
                  : "border-white/85 bg-white/45 text-slate-900 -translate-y-0.5 scale-[1.02]"
                : dark
                  ? "border-transparent bg-transparent text-slate-100"
                  : "border-transparent bg-transparent text-slate-900"
                } active:translate-y-0.5 active:scale-95`}
              onClick={() => (isActive ? onGoHome() : onOpenApp(app.id))}
              aria-label={`Open ${app.title}`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-[0.56rem] leading-none opacity-75">{app.title}</span>
              <span className={`h-1 w-1 rounded-full bg-slate-100/95 ${isActive ? "opacity-100" : "opacity-0"}`} />
            </button>
          );
        })}
      </nav>
    </main>
  );
}
