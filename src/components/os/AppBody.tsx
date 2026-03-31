import { Briefcase, Github, Linkedin } from "lucide-react";
import { TerminalApp } from "@/components/os/TerminalApp";
import { ProjectsApp } from "@/components/os/ProjectsApp";
import { experience, skillTags } from "@/components/os/data";
import type { AppId, LiquidGlassMode, ThemeMode } from "@/components/os/types";
import { hasGitHub, hasLinkedIn, site } from "@/lib/site";

export function renderAppBody(
  appId: AppId,
  onOpenApp: (id: AppId) => void,
  options?: {
    liquidGlassMode?: LiquidGlassMode;
    onSetLiquidGlassMode?: (mode: LiquidGlassMode) => void;
    themeMode?: ThemeMode;
    resolvedThemeMode?: "light" | "dark";
    onSetThemeMode?: (mode: ThemeMode) => void;
  }
) {
  if (appId === "about") {
    return (
      <div className="stack">
        <p style={{ fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>
          Innovative IT professional with 6+ years of hands-on experience in the dynamic technology
          landscape, specializing in information security, networking, infrastructure, and application
          development.
        </p>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>
          I stay current on emerging trends to proactively tackle challenges and implement
          cutting-edge solutions. Committed to technological excellence, I consistently deliver
          valuable contributions to every team and project.
        </p>
        <div>
          <p className="md3-section-label">Specialisations</p>
          <div className="chip-row">
            <span className="chip">Information Security</span>
            <span className="chip">Penetration Testing</span>
            <span className="chip">Blue / Red Team Ops</span>
            <span className="chip">Networking</span>
            <span className="chip">Cloud Security</span>
            <span className="chip">Application Development</span>
          </div>
        </div>
      </div>
    );
  }

  if (appId === "experience") {
    return (
      <div className="exp-timeline">
        {experience.map((item, idx) => (
          <div key={`${item.company}-${item.role}`} className="exp-entry">
            {/* Vertical line + dot */}
            <div className="exp-spine" aria-hidden="true">
              <div className="exp-dot">
                <Briefcase className="h-3 w-3" />
              </div>
              {idx < experience.length - 1 && <div className="exp-line" />}
            </div>

            {/* Content */}
            <div className="exp-body">
              <span className="exp-period">{item.period}</span>
              <h3 className="exp-role">{item.role}</h3>
              <span className="exp-company">{item.company}</span>
              <p className="exp-summary">{item.summary}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (appId === "skills") {
    return (
      <div className="stack">
        <div>
          <p className="md3-section-label">Technical Skills</p>
          <div className="chip-row">
            {skillTags.map((skill) => (
              <span className="chip" key={skill}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (appId === "contact") {
    return (
      <div className="stack">
        <p style={{ fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>
          Open a channel and let&apos;s build something secure, useful, and production-ready.
        </p>
        <div>
          <p className="md3-section-label">Connect</p>
          <div className="cta-row">
            {hasLinkedIn && (
              <a className="md3-btn-filled" href={site.linkedinUrl} target="_blank" rel="noreferrer">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            )}
            {hasGitHub && (
              <a className="md3-btn-tonal" href={site.githubUrl} target="_blank" rel="noreferrer">
                <Github className="h-4 w-4" />
                GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (appId === "projects") {
    return <ProjectsApp />;
  }

  if (appId === "handbook") {
    return (
      <div className="stack handbook">
        <div>
          <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>Attack Handbook</h3>
          <p className="muted" style={{ marginTop: "0.25rem" }}>Defensive and legal practice only — CTF, labs, and authorized testing.</p>
        </div>
        <div className="timeline-item">
          <div className="timeline-item-inner" style={{ padding: "0.7rem 0.85rem" }}>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: "0.84rem", fontWeight: 600 }}>1. Recon Checklist</h4>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", lineHeight: 1.55 }}>
                Inventory surface: hosts, ports, subdomains, exposed files, outdated services, auth flows.
              </p>
            </div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-item-inner" style={{ padding: "0.7rem 0.85rem" }}>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: "0.84rem", fontWeight: 600 }}>2. Web App Testing</h4>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", lineHeight: 1.55 }}>
                Check input validation, authz/authn flaws, IDOR, insecure file upload, SSRF, XSS, SQLi patterns.
              </p>
            </div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-item-inner" style={{ padding: "0.7rem 0.85rem" }}>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: "0.84rem", fontWeight: 600 }}>3. Credential &amp; Session Risks</h4>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", lineHeight: 1.55 }}>
                Review password policy, reset flow abuse, token lifetime, cookie flags, session fixation paths.
              </p>
            </div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-item-inner" style={{ padding: "0.7rem 0.85rem" }}>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: "0.84rem", fontWeight: 600 }}>4. Misconfiguration</h4>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", lineHeight: 1.55 }}>
                Look for debug endpoints, verbose errors, default credentials, weak CORS, open buckets, leaked env files.
              </p>
            </div>
          </div>
        </div>
        <div className="timeline-item">
          <div className="timeline-item-inner" style={{ padding: "0.7rem 0.85rem" }}>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ margin: 0, fontSize: "0.84rem", fontWeight: 600 }}>5. Evidence &amp; Reporting</h4>
              <p style={{ margin: "0.2rem 0 0", fontSize: "0.82rem", lineHeight: 1.55 }}>
                Capture reproducible PoC steps, impact, affected scope, and mitigation with priority and owner.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (appId === "settings") {
    const liquidGlassMode = options?.liquidGlassMode ?? "tinted";
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

        <div>
          <p className="md3-section-label">Glass Mode</p>
          <p className="muted" style={{ marginBottom: "0.6rem" }}>Controls transparency of mobile glass surfaces.</p>
          <div className="md3-seg-group">
            <button
              type="button"
              className={`md3-seg-btn ${liquidGlassMode === "clear" ? "active" : ""}`}
              aria-pressed={liquidGlassMode === "clear"}
              onClick={() => options?.onSetLiquidGlassMode?.("clear")}
            >
              Clear
            </button>
            <button
              type="button"
              className={`md3-seg-btn ${liquidGlassMode === "tinted" ? "active" : ""}`}
              aria-pressed={liquidGlassMode === "tinted"}
              onClick={() => options?.onSetLiquidGlassMode?.("tinted")}
            >
              Tinted
            </button>
          </div>
        </div>

        <p className="muted">
          Active: {themeMode === "system" ? `System (${resolvedTheme === "dark" ? "Dark" : "Light"})` : themeMode === "light" ? "Light" : "Dark"}
          {" · "}
          Glass: {liquidGlassMode === "clear" ? "Clear" : "Tinted"}
        </p>
      </div>
    );
  }

  return <TerminalApp onOpenApp={onOpenApp} />;
}
