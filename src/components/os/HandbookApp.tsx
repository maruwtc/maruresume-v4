"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Section = {
  id: string;
  title: string;
  body: string;
  tools?: string[];
};

const sections: Section[] = [
  {
    id: "recon",
    title: "1. Recon Checklist",
    body: "Inventory surface: hosts, ports, subdomains, exposed files, outdated services, auth flows.",
    tools: ["nmap", "subfinder", "amass", "whatweb", "shodan"],
  },
  {
    id: "webapp",
    title: "2. Web App Testing",
    body: "Check input validation, authz/authn flaws, IDOR, insecure file upload, SSRF, XSS, SQLi patterns.",
    tools: ["burpsuite", "sqlmap", "ffuf", "nikto", "dalfox"],
  },
  {
    id: "creds",
    title: "3. Credential & Session Risks",
    body: "Review password policy, reset flow abuse, token lifetime, cookie flags, session fixation paths.",
    tools: ["hydra", "hashcat", "jwt_tool", "cookie-editor"],
  },
  {
    id: "misconfig",
    title: "4. Misconfiguration",
    body: "Look for debug endpoints, verbose errors, default credentials, weak CORS, open buckets, leaked env files.",
    tools: ["nuclei", "trufflehog", "gitleaks", "cloudsploit"],
  },
  {
    id: "reporting",
    title: "5. Evidence & Reporting",
    body: "Capture reproducible PoC steps, impact, affected scope, and mitigation with priority and owner.",
    tools: ["obsidian", "ghostwriter", "dradis"],
  },
];

export function HandbookApp() {
  const [openId, setOpenId] = useState<string | null>("recon");

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <div className="stack handbook">
      <div>
        <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>Attack Handbook</h3>
        <p className="muted" style={{ marginTop: "0.25rem" }}>
          Defensive and legal practice only — CTF, labs, and authorized testing.
        </p>
      </div>

      <div className="hb-accordion-list">
        {sections.map((section) => {
          const isOpen = openId === section.id;
          return (
            <div key={section.id} className={`hb-accordion ${isOpen ? "open" : ""}`}>
              <button
                type="button"
                className="hb-accordion-head"
                onClick={() => toggle(section.id)}
                aria-expanded={isOpen}
              >
                <span>{section.title}</span>
                <ChevronDown
                  className="h-4 w-4"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 200ms ease",
                    flexShrink: 0,
                  }}
                />
              </button>
              {isOpen && (
                <div className="hb-accordion-body">
                  <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.6 }}>{section.body}</p>
                  {section.tools && section.tools.length > 0 && (
                    <div className="chip-row" style={{ marginTop: "0.6rem" }}>
                      {section.tools.map((tool) => (
                        <span key={tool} className="chip chip-sm chip-mono">
                          {tool}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
