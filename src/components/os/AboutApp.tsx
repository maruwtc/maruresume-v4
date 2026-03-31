"use client";

import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { certifications } from "@/components/os/data";
import { hasEmail, hasResume, site } from "@/lib/site";

export function AboutApp() {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    if (!site.email) return;
    navigator.clipboard.writeText(site.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="stack">
      {/* Avatar + identity */}
      <div className="about-hero">
        <div className="about-avatar">CW</div>
        <div className="about-identity">
          <h2 className="about-name">Chris Wong</h2>
          <p className="about-title">IT Security Professional</p>
          <span className="availability-badge">
            <span className="availability-dot" />
            Available for opportunities
          </span>
        </div>
      </div>

      {/* Bio */}
      <div>
        <p className="md3-section-label">About</p>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.65, margin: "0 0 0.55rem" }}>
          Innovative IT professional with 6+ years of hands-on experience specializing in
          information security, networking, infrastructure, and application development.
        </p>
        <p style={{ fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>
          I stay current on emerging threats to proactively tackle challenges and implement
          cutting-edge solutions — consistently delivering valuable contributions to every team.
        </p>
      </div>

      {/* Specialisations */}
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

      {/* Education & Certs */}
      <div>
        <p className="md3-section-label">Education</p>
        <div className="cert-list">
          {certifications.map((cert) => (
            <div key={cert.name} className="cert-item">
              <span className="cert-name">{cert.name}</span>
              <span className="cert-meta">
                {cert.issuer} · {cert.year}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="cta-row">
        {hasResume && (
          <a
            className="md3-btn-filled"
            href={site.resumeUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Download className="h-4 w-4" />
            Resume
          </a>
        )}
        {hasEmail && (
          <button type="button" className="md3-btn-tonal copy-email-btn" onClick={copyEmail}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy Email"}
          </button>
        )}
      </div>
    </div>
  );
}
