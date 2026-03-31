import { TerminalApp } from "@/components/os/TerminalApp";
import { ProjectsApp } from "@/components/os/ProjectsApp";
import { AboutApp } from "@/components/os/AboutApp";
import { SkillsApp } from "@/components/os/SkillsApp";
import { ExperienceApp } from "@/components/os/ExperienceApp";
import { ContactApp } from "@/components/os/ContactApp";
import { HandbookApp } from "@/components/os/HandbookApp";
import type { AppId, ThemeMode } from "@/components/os/types";

export function renderAppBody(
  appId: AppId,
  onOpenApp: (id: AppId) => void,
  options?: {
    themeMode?: ThemeMode;
    resolvedThemeMode?: "light" | "dark";
    onSetThemeMode?: (mode: ThemeMode) => void;
  }
) {
  if (appId === "about") {
    return <AboutApp />;
  }

  if (appId === "experience") {
    return <ExperienceApp />;
  }

  if (appId === "skills") {
    return <SkillsApp />;
  }

  if (appId === "contact") {
    return <ContactApp />;
  }

  if (appId === "projects") {
    return <ProjectsApp />;
  }

  if (appId === "handbook") {
    return <HandbookApp />;
  }

  if (appId === "settings") {
    const themeMode = options?.themeMode ?? "system";
    const resolvedTheme = options?.themeMode === "system" ? (options?.resolvedThemeMode ?? "light") : themeMode;

    return (
      <div className="stack">
        <div>
          <p className="md3-section-label">Theme</p>
          <p className="muted" style={{ marginBottom: "0.6rem" }}>Controls dark mode and wallpaper. System follows device setting.</p>
          <div className="md3-seg-group">
            <button
              type="button"
              className={`md3-seg-btn ${themeMode === "system" ? "active" : ""}`}
              aria-pressed={themeMode === "system"}
              onClick={() => options?.onSetThemeMode?.("system")}
            >
              System
            </button>
            <button
              type="button"
              className={`md3-seg-btn ${themeMode === "light" ? "active" : ""}`}
              aria-pressed={themeMode === "light"}
              onClick={() => options?.onSetThemeMode?.("light")}
            >
              Light
            </button>
            <button
              type="button"
              className={`md3-seg-btn ${themeMode === "dark" ? "active" : ""}`}
              aria-pressed={themeMode === "dark"}
              onClick={() => options?.onSetThemeMode?.("dark")}
            >
              Dark
            </button>
          </div>
        </div>

        <p className="muted">
          Active: {themeMode === "system" ? `System (${resolvedTheme === "dark" ? "Dark" : "Light"})` : themeMode === "light" ? "Light" : "Dark"}
        </p>

        <div>
          <p className="md3-section-label">Version</p>
          <p className="muted">ChrisOS v2.0 · Next.js 15 · Tailwind CSS v4</p>
        </div>
      </div>
    );
  }

  return <TerminalApp onOpenApp={onOpenApp} />;
}
