import { Github, Linkedin } from "lucide-react";
import { TerminalApp } from "@/components/os/TerminalApp";
import { experience, skillTags } from "@/components/os/data";
import type { AppId } from "@/components/os/types";
import { hasGitHub, hasLinkedIn, site } from "@/lib/site";

export function renderAppBody(appId: AppId, onOpenApp: (id: AppId) => void) {
  if (appId === "about") {
    return (
      <div className="stack">
        <p>
          I am an IT professional with 4+ years of hands-on experience across information security,
          networking, infrastructure, and application development.
        </p>
        <p>
          Focused on practical security, modern web engineering, and continuous improvement through
          automation and resilient architecture.
        </p>
        <div className="chip-row">
          <span className="chip">Application Development</span>
          <span className="chip">Penetration Testing</span>
          <span className="chip">IT Security</span>
          <span className="chip">Networking</span>
          <span className="chip">Cloud Networking</span>
          <span className="chip">Database Management</span>
        </div>
      </div>
    );
  }

  if (appId === "experience") {
    return (
      <div className="timeline">
        {experience.map((item) => (
          <div key={`${item.company}-${item.role}`} className="timeline-item">
            <div>
              <h3>{item.role}</h3>
              <p className="muted">
                {item.company} | {item.period}
              </p>
              <p>{item.summary}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (appId === "skills") {
    return (
      <div className="chip-row">
        {skillTags.map((skill) => (
          <span className="chip" key={skill}>
            {skill}
          </span>
        ))}
      </div>
    );
  }

  if (appId === "contact") {
    return (
      <div className="stack">
        <p>Open a channel and let&apos;s build something secure, useful, and production-ready.</p>
        <div className="cta-row">
          {hasLinkedIn && (
            <a className="os-link-btn" href={site.linkedinUrl} target="_blank" rel="noreferrer">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
          {hasGitHub && (
            <a className="os-link-btn" href={site.githubUrl} target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
        </div>
      </div>
    );
  }

  if (appId === "projects") {
    return <iframe title="Projects App" src="/projects" className="os-app-frame" />;
  }

  if (appId === "handbook") {
    return (
      <div className="stack handbook">
        <h3>Attack Handbook (Practice Notes)</h3>
        <p className="muted">Defensive and legal practice only. Use these notes for CTF, labs, and authorized testing.</p>
        <h4>1. Recon Checklist</h4>
        <p>Inventory surface: hosts, ports, subdomains, exposed files, outdated services, auth flows.</p>
        <h4>2. Web App Testing</h4>
        <p>Check input validation, authz/authn flaws, IDOR, insecure file upload, SSRF, XSS, SQLi patterns.</p>
        <h4>3. Credential & Session Risks</h4>
        <p>Review password policy, reset flow abuse, token lifetime, cookie flags, session fixation paths.</p>
        <h4>4. Misconfiguration</h4>
        <p>Look for debug endpoints, verbose errors, default credentials, weak CORS, open buckets, leaked env files.</p>
        <h4>5. Evidence & Reporting</h4>
        <p>Capture reproducible PoC steps, impact, affected scope, and mitigation with priority and owner.</p>
      </div>
    );
  }

  return <TerminalApp onOpenApp={onOpenApp} />;
}
