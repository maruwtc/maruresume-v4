import { ArrowLeft, House } from "lucide-react";
import { apps } from "@/components/os/data";
import { renderAppBody } from "@/components/os/AppBody";
import type { AppId } from "@/components/os/types";

export function TabletShell({
  activeAppId,
  onOpenApp,
  onGoHome,
  dateText,
  clockText,
}: {
  activeAppId: AppId | null;
  onOpenApp: (id: AppId) => void;
  onGoHome: () => void;
  dateText: string;
  clockText: string;
}) {
  const activeTabletApp = activeAppId ? apps.find((app) => app.id === activeAppId) : null;

  return (
    <main className="os-shell mode-tablet">
      <div className="os-wallpaper" aria-hidden="true" />

      <header className="tablet-status-bar">
        <span>{dateText}</span>
        <span>{clockText}</span>
      </header>

      {!activeTabletApp && (
        <section className="tablet-home-grid" aria-label="Tablet home apps">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button key={`tablet-home-${app.id}`} type="button" className="tablet-app-icon" onClick={() => onOpenApp(app.id)}>
                <span className="tablet-app-icon-badge">
                  <Icon className="h-6 w-6" />
                </span>
                <span>{app.title}</span>
              </button>
            );
          })}
        </section>
      )}

      {activeTabletApp && (
        <section className="tablet-app-stage" aria-label={`${activeTabletApp.title} app`}>
          <article className="tablet-app-window">
            <header className="tablet-app-header">
              <button type="button" className="tablet-header-btn" onClick={onGoHome} aria-label="Back to Home">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="tablet-app-title">
                <activeTabletApp.icon className="h-4 w-4" />
                <span>{activeTabletApp.title}</span>
              </div>
              <button type="button" className="tablet-header-btn" onClick={onGoHome} aria-label="Go Home">
                <House className="h-4 w-4" />
              </button>
            </header>
            <div className="tablet-app-body">{renderAppBody(activeTabletApp.id, onOpenApp)}</div>
          </article>
        </section>
      )}

      <nav className="tablet-dock" aria-label="Tablet dock">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={`tablet-dock-${app.id}`}
              type="button"
              className={`tablet-dock-btn ${activeAppId === app.id ? "active" : ""}`}
              onClick={() => onOpenApp(app.id)}
              aria-label={`Open ${app.title}`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </nav>
    </main>
  );
}
