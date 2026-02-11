import { ArrowLeft, House } from "lucide-react";
import { apps } from "@/components/os/data";
import { renderAppBody } from "@/components/os/AppBody";
import type { AppId } from "@/components/os/types";

export function PhoneShell({
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
  const activePhoneApp = activeAppId ? apps.find((app) => app.id === activeAppId) : null;

  return (
    <main className="os-shell mode-phone">
      <div className="os-wallpaper" aria-hidden="true" />

      <header className="phone-status-bar">
        <span>{dateText}</span>
        <span>{clockText}</span>
      </header>

      {!activePhoneApp && (
        <section className="phone-home-grid" aria-label="Phone home apps">
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button key={`phone-home-${app.id}`} type="button" className="phone-app-icon" onClick={() => onOpenApp(app.id)}>
                <span className="phone-app-icon-badge">
                  <Icon className="h-5 w-5" />
                </span>
                <span>{app.title}</span>
              </button>
            );
          })}
        </section>
      )}

      {activePhoneApp && (
        <section className="phone-app-stage" aria-label={`${activePhoneApp.title} app`}>
          <article className="phone-app-window">
            <header className="phone-app-header">
              <button type="button" className="phone-header-btn" onClick={onGoHome} aria-label="Back to Home">
                <ArrowLeft className="h-4 w-4" />
              </button>
              <div className="phone-app-title">
                <activePhoneApp.icon className="h-4 w-4" />
                <span>{activePhoneApp.title}</span>
              </div>
              <button type="button" className="phone-header-btn" onClick={onGoHome} aria-label="Go Home">
                <House className="h-4 w-4" />
              </button>
            </header>
            <div className="phone-app-body">{renderAppBody(activePhoneApp.id, onOpenApp)}</div>
          </article>
        </section>
      )}

      <nav className="phone-dock" aria-label="Phone dock">
        {apps.slice(0, 5).map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={`phone-dock-${app.id}`}
              type="button"
              className={`phone-dock-btn ${activeAppId === app.id ? "active" : ""}`}
              onClick={() => onOpenApp(app.id)}
              aria-label={`Open ${app.title}`}
            >
              <Icon className="h-4 w-4" />
            </button>
          );
        })}
      </nav>

      <button type="button" className="phone-home-pill" onClick={onGoHome} aria-label="Return to Home" />
    </main>
  );
}
