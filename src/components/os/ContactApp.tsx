"use client";

import { useState } from "react";
import { Check, Copy, Github, Linkedin, MapPin } from "lucide-react";
import { hasEmail, hasGitHub, hasLinkedIn, site } from "@/lib/site";

export function ContactApp() {
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
      <p style={{ fontSize: "0.88rem", lineHeight: 1.65, margin: 0 }}>
        Open a channel and let&apos;s build something secure, useful, and production-ready.
      </p>

      {/* Location / timezone meta */}
      <div className="contact-meta-row">
        <span className="contact-meta-item">
          <MapPin className="h-3.5 w-3.5" />
          Hong Kong
        </span>
        <span className="contact-meta-sep">·</span>
        <span className="contact-meta-item">GMT+8</span>
        <span className="contact-meta-sep">·</span>
        <span className="contact-meta-item">Usually responds within 1–2 days</span>
      </div>

      {/* Email */}
      {hasEmail && (
        <div>
          <p className="md3-section-label">Email</p>
          <div className="contact-email-row">
            <span className="contact-email-addr">{site.email}</span>
            <button
              type="button"
              className={`md3-btn-tonal copy-email-btn ${copied ? "copied" : ""}`}
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Social links */}
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
