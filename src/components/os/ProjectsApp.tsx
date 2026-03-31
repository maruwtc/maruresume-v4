"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Github, Loader2, Star } from "lucide-react";
import { site } from "@/lib/site";

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  fork: boolean;
}

const langColors: Record<string, string> = {
  TypeScript:  "bg-blue-100   text-blue-800",
  JavaScript:  "bg-yellow-100 text-yellow-800",
  Python:      "bg-green-100  text-green-800",
  Go:          "bg-cyan-100   text-cyan-800",
  Golang:      "bg-cyan-100   text-cyan-800",
  HTML:        "bg-orange-100 text-orange-800",
  CSS:         "bg-purple-100 text-purple-800",
  Java:        "bg-red-100    text-red-800",
  "C#":        "bg-indigo-100 text-indigo-800",
  PHP:         "bg-pink-100   text-pink-800",
  Ruby:        "bg-rose-100   text-rose-800",
  Shell:       "bg-slate-100  text-slate-700",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1)  return "today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

type SortMode = "recent" | "stars";

export function ProjectsApp() {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [langFilter, setLangFilter] = useState<string>("All");
  const [sortMode, setSortMode] = useState<SortMode>("recent");

  useEffect(() => {
    if (!site.githubUsername) {
      setError("GitHub username not configured.");
      setLoading(false);
      return;
    }

    fetch(`https://api.github.com/users/${site.githubUsername}/repos?per_page=100&sort=updated`)
      .then((r) => {
        if (!r.ok) throw new Error(`GitHub API ${r.status}`);
        return r.json() as Promise<GitHubRepo[]>;
      })
      .then((data) => {
        setRepos(data.filter((r) => !r.fork).slice(0, 40));
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load repos. Check your connection.");
        setLoading(false);
      });
  }, []);

  const languages = useMemo(() => {
    const langs = new Set<string>();
    repos.forEach((r) => { if (r.language) langs.add(r.language); });
    return ["All", ...Array.from(langs).sort()];
  }, [repos]);

  const filtered = useMemo(() => {
    let list = langFilter === "All" ? repos : repos.filter((r) => r.language === langFilter);
    if (sortMode === "stars") {
      list = [...list].sort((a, b) => b.stargazers_count - a.stargazers_count);
    }
    return list.slice(0, 20);
  }, [repos, langFilter, sortMode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12" style={{ minHeight: 200 }}>
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "var(--muted-foreground)" }} />
        <p className="muted">Loading from GitHub…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-12" style={{ minHeight: 200 }}>
        <p className="muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="stack">
      {/* Controls */}
      <div className="projects-controls">
        {/* Sort toggle */}
        <div className="md3-seg-group" style={{ width: "fit-content" }}>
          <button
            type="button"
            className={`md3-seg-btn ${sortMode === "recent" ? "active" : ""}`}
            onClick={() => setSortMode("recent")}
          >
            Recent
          </button>
          <button
            type="button"
            className={`md3-seg-btn ${sortMode === "stars" ? "active" : ""}`}
            onClick={() => setSortMode("stars")}
          >
            Stars
          </button>
        </div>

        {/* Language filter */}
        {languages.length > 2 && (
          <div className="lang-filter-row">
            {languages.map((lang) => (
              <button
                key={lang}
                type="button"
                className={`chip lang-filter-chip ${langFilter === lang ? "active" : ""}`}
                onClick={() => setLangFilter(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Repo list */}
      <div className="timeline">
        {filtered.map((repo) => {
          const langClass = repo.language ? (langColors[repo.language] ?? "bg-slate-100 text-slate-700") : null;

          return (
            <div key={repo.id} className="timeline-item">
              <div className="timeline-item-inner">
                <div style={{ minWidth: 0, flex: 1 }}>
                  {/* Title row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <h3 style={{ margin: 0 }}>{repo.name}</h3>
                    {repo.stargazers_count > 0 && (
                      <span className="muted" style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem", fontSize: "0.74rem" }}>
                        <Star style={{ width: 11, height: 11 }} />
                        {repo.stargazers_count}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {repo.description && (
                    <p style={{ marginTop: "0.3rem", fontSize: "0.82rem", lineHeight: 1.5 }}>
                      {repo.description}
                    </p>
                  )}

                  {/* Meta row */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginTop: "0.55rem", flexWrap: "wrap" }}>
                    {langClass && (
                      <span className={`chip ${langClass}`} style={{ border: "none", borderRadius: 6 }}>
                        {repo.language}
                      </span>
                    )}
                    <span className="muted">{timeAgo(repo.updated_at)}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="cta-row" style={{ marginTop: "0.65rem" }}>
                    <a
                      className="md3-btn-tonal"
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "0.76rem", padding: "0.35rem 0.7rem" }}
                    >
                      <Github className="h-3.5 w-3.5" />
                      Code
                    </a>
                    {repo.homepage && (
                      <a
                        className="md3-btn-filled"
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: "0.76rem", padding: "0.35rem 0.7rem" }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
