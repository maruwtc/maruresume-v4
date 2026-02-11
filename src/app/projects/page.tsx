"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import {
    ExternalLink,
    Github,
    Linkedin,
    ArrowDown,
    Loader2
} from "lucide-react";
import { HorizontalScroll } from "@/components/animations/HorizontalScroll";
import { useGSAPAnimation } from "@/app/hooks/useGSAPAnimation";
import { hasGitHub, hasLinkedIn, site } from "@/lib/site";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// GitHub repository interface
interface GitHubRepo {
    id: number;
    name: string;
    description: string;
    html_url: string;
    homepage: string;
    stargazers_count: number;
    language: string;
    updated_at: string;
    owner: { login: string };
}

export default function Projects() {
    const projectsRef = useRef<HTMLDivElement>(null);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [readmePreviews, setReadmePreviews] = useState<Record<number, string>>({});
    const [screenshotUrls, setScreenshotUrls] = useState<Record<number, string>>({});
    const [isMobile, setIsMobile] = useState(false);

    const headerRef = useRef<HTMLDivElement>(null!);
    useGSAPAnimation(headerRef, {
        fromVars: { y: -20, opacity: 0 },
        toVars: { y: 0, opacity: 1, duration: 0.6 }
    });

    // Fetch GitHub repos
    useEffect(() => {
        const fetchRepos = async () => {
            try {
                setLoading(true);
                if (!site.githubUsername) {
                    setError("Missing NEXT_PUBLIC_GITHUB_USERNAME.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(`https://api.github.com/users/${site.githubUsername}/repos`);

                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }

                const data: GitHubRepo[] = await response.json();

                // Filter out forked repos, empty descriptions, etc. if needed
                const filteredRepos = data
                    .sort(
                        (a, b) =>
                            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                    );

                setRepos(filteredRepos);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching GitHub repos:", err);
                setError("Failed to load projects from GitHub. Please try again later.");
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const media = window.matchMedia("(max-width: 768px)");
        const update = () => setIsMobile(media.matches);
        update();

        if (media.addEventListener) {
            media.addEventListener("change", update);
            return () => media.removeEventListener("change", update);
        }

        media.addListener(update);
        return () => media.removeListener(update);
    }, []);

    // Fetch README previews (short excerpt) with limited concurrency
    useEffect(() => {
        if (!repos.length) return;

        let cancelled = false;
        const maxConcurrent = 4;
        const queue = [...repos];
        let active = 0;

        const fetchReadmePreview = async (repo: GitHubRepo) => {
            const owner = repo.owner?.login || site.githubUsername || "";
            if (!owner) return null;
            const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo.name}/HEAD/README.md`;
            const response = await fetch(rawUrl);
            if (!response.ok) return null;

            const text = await response.text();
            const compact = text
                .replace(/\r\n/g, "\n")
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .slice(0, 6)
                .join(" ");

            if (!compact) return null;
            return compact.length > 300 ? `${compact.slice(0, 297)}...` : compact;
        };

        const next = () => {
            if (cancelled) return;
            while (active < maxConcurrent && queue.length) {
                const repo = queue.shift();
                if (!repo) return;
                active += 1;

                fetchReadmePreview(repo)
                    .then((preview) => {
                        if (!preview || cancelled) return;
                        setReadmePreviews((prev) =>
                            prev[repo.id] ? prev : { ...prev, [repo.id]: preview }
                        );
                    })
                    .catch(() => {
                        // Ignore README fetch errors to keep UI responsive
                    })
                    .finally(() => {
                        active -= 1;
                        next();
                    });
            }
        };

        next();

        return () => {
            cancelled = true;
        };
    }, [repos]);

    // Fetch screenshot previews from Microlink for repo homepages
    useEffect(() => {
        if (!repos.length) return;

        let cancelled = false;
        const maxConcurrent = 2;
        const queue = repos.filter((repo) => repo.homepage);
        let active = 0;

        const fetchScreenshot = async (repo: GitHubRepo) => {
            const url = repo.homepage;
            const apiUrl = `https://api.microlink.io?url=${encodeURIComponent(
                url
            )}&screenshot=true&meta=false`;
            const headers: Record<string, string> = {};

            if (process.env.NEXT_PUBLIC_MICROLINK_API_KEY) {
                headers["x-api-key"] = process.env.NEXT_PUBLIC_MICROLINK_API_KEY;
            }

            const response = await fetch(apiUrl, { headers });
            if (!response.ok) return null;

            const json = await response.json();
            const screenshot = json?.data?.screenshot;
            if (typeof screenshot === "string") return screenshot;
            if (screenshot?.url) return screenshot.url;
            return null;
        };

        const next = () => {
            if (cancelled) return;
            while (active < maxConcurrent && queue.length) {
                const repo = queue.shift();
                if (!repo) return;
                active += 1;

                fetchScreenshot(repo)
                    .then((url) => {
                        if (!url || cancelled) return;
                        setScreenshotUrls((prev) =>
                            prev[repo.id] ? prev : { ...prev, [repo.id]: url }
                        );
                    })
                    .catch(() => {
                        // Ignore screenshot fetch errors to keep UI responsive
                    })
                    .finally(() => {
                        active -= 1;
                        next();
                    });
            }
        };

        next();

        return () => {
            cancelled = true;
        };
    }, [repos]);

    // Introduction animation
    const introRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!introRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: introRef.current,
                start: "top 70%",
                end: "bottom 70%",
                toggleActions: "play none none reverse",
            }
        });

        tl.fromTo(
            ".intro-content",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 }
        ).fromTo(
            ".intro-cta",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.4"
        );

        return () => {
            tl.kill();
        };
    }, []);

    // Contact section animation
    const ctaSectionRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!ctaSectionRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ctaSectionRef.current,
                start: "top 70%",
                end: "bottom 70%",
                toggleActions: "play none none reverse",
            }
        });

        tl.fromTo(
            ".cta-content",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 }
        ).fromTo(
            ".cta-buttons",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.15 },
            "-=0.4"
        );

        return () => {
            tl.kill();
        };
    }, []);

    // Effect to adjust scroll position for hash links
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                // Add a slight delay to ensure the page has loaded
                setTimeout(() => {
                    const element = document.querySelector(hash);
                    if (element) {
                        // Get the header height
                        const headerHeight = headerRef.current?.offsetHeight || 0;
                        // Scroll to the element with offset for the header
                        window.scrollTo({
                            top: element.getBoundingClientRect().top + window.scrollY - headerHeight - 20,
                            behavior: 'smooth'
                        });
                    }
                }, 100);
            }
        };

        // Check hash on initial load
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    // Helper function to get colors based on index
    const getProjectColor = (index: number) => {
        const colors = ["bg-primary/5", "bg-primary/10", "bg-primary/15", "bg-primary/20"];
        return colors[index % colors.length];
    };

    // Helper to get language badge color
    const getLanguageColor = (language: string) => {
        const colors: Record<string, string> = {
            "JavaScript": "bg-yellow-200 text-yellow-800",
            "TypeScript": "bg-blue-200 text-blue-800",
            "HTML": "bg-orange-200 text-orange-800",
            "CSS": "bg-purple-200 text-purple-800",
            "Python": "bg-green-200 text-green-800",
            "Java": "bg-red-200 text-red-800",
            "Go": "bg-cyan-200 text-cyan-800",
            "C#": "bg-indigo-200 text-indigo-800",
            "PHP": "bg-pink-200 text-pink-800",
            "Ruby": "bg-red-200 text-red-800",
            "React": "bg-blue-200 text-blue-800",
            "Next.js": "bg-gray-200 text-gray-800"
        };

        return colors[language] || "bg-gray-200 text-gray-800";
    };

    return (
        <section id="projects" ref={projectsRef}>
            {/* Introduction Section */}
            <div ref={introRef} className="py-24 bg-background h-screen flex items-center">
                <div className="container mx-auto px-4 max-w-3xl h-full flex flex-col justify-evenly">
                    <div className="">
                        <h2 className="text-4xl font-bold mb-6 intro-content">Featured Projects</h2>
                        <p className="text-md text-muted-foreground mb-8 intro-content">
                            Explore a collection of my recent work from GitHub.
                            Each project represents a unique challenge and solution.
                        </p>
                        {hasGitHub && (
                            <Button
                                variant="outline"
                                className="intro-cta"
                                size="lg"
                                onClick={() => {
                                    window.open(site.githubUrl, '_blank');
                                }}
                            >
                                <Github className="mr-2 h-4 w-4" /> View on GitHub
                            </Button>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        className="intro-cta"
                        size="lg"
                        onClick={() => {
                            const projectsSection = document.querySelector('.horizontal-scroll-container');
                            if (projectsSection) {
                                const headerHeight = headerRef.current?.offsetHeight || 0;
                                window.scrollTo({
                                    top: projectsSection.getBoundingClientRect().top + window.scrollY - headerHeight - 20,
                                    behavior: 'smooth'
                                });
                            }
                        }}
                    >
                        <ArrowDown size={24} />
                    </Button>
                </div>
            </div>

            {/* Horizontal Scroll Projects */}
            <div className="relative">
                {loading ? (
                    <div className="min-h-[500px] flex items-center justify-center">
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                            <p className="text-lg">Loading projects from GitHub...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="min-h-[500px] flex items-center justify-center">
                        <div className="text-center max-w-lg">
                            <p className="text-lg text-red-500 mb-4">{error}</p>
                            <Button onClick={() => window.location.reload()}>
                                Retry
                            </Button>
                        </div>
                    </div>
                ) : isMobile ? (
                    <div className="container mx-auto px-4 sm:px-6 py-12">
                        <div className="space-y-10">
                            {repos.map((repo, index) => (
                                <div key={repo.id} className={`rounded-2xl border bg-background/80 p-6 shadow-sm ${getProjectColor(index)}`}>
                                    <div className="grid gap-6">
                                        <div className="bg-background rounded-lg border overflow-hidden w-full aspect-[4/3] flex items-center justify-center">
                                            {screenshotUrls[repo.id] ? (
                                                <img
                                                    src={screenshotUrls[repo.id]}
                                                    alt={`${repo.name} screenshot`}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="text-center h-full w-full flex flex-col items-center justify-center">
                                                    <Github className="h-10 w-10 mx-auto mb-2 text-primary" />
                                                    <span className="text-lg text-muted-foreground">{repo.name}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold mb-3">{repo.name}</h3>
                                            <p className="text-base text-muted-foreground mb-5">{repo.description}</p>

                                            {readmePreviews[repo.id] && (
                                                <div className="mb-6">
                                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">
                                                        README
                                                    </p>
                                                    <p
                                                        className="text-sm text-muted-foreground leading-relaxed"
                                                        style={{
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 4,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden"
                                                        }}
                                                    >
                                                        {readmePreviews[repo.id]}
                                                    </p>
                                                </div>
                                            )}

                                            {repo.language && (
                                                <div className="mb-6">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs ${getLanguageColor(repo.language)}`}>
                                                        {repo.language}
                                                    </span>
                                                    {repo.stargazers_count > 0 && (
                                                        <span className="ml-3 text-xs text-muted-foreground">
                                                            ★ {repo.stargazers_count}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-3">
                                                {repo.homepage && (
                                                    <Button size="sm" className="w-full" asChild>
                                                        <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button variant="outline" size="sm" className="w-full" asChild>
                                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                                        <Github className="mr-2 h-4 w-4" /> View Code
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <HorizontalScroll className="min-h-[560px] md:min-h-[500px] horizontal-scroll-container" scrub={1} snap={true}>
                        {repos.map((repo, index) => (
                            <div
                                key={repo.id}
                                className={`section min-w-full min-h-[100svh] md:h-screen flex items-start md:items-center py-10 md:py-0 ${getProjectColor(index)}`}
                            >
                                <div className="container mx-auto px-4 sm:px-6">
                                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                                        <div>
                                            <h3 className="text-2xl sm:text-3xl font-bold mb-3">{repo.name}</h3>
                                            <p className="text-base sm:text-lg text-muted-foreground mb-5">
                                                {repo.description}
                                            </p>

                                            {readmePreviews[repo.id] && (
                                                <div className="mb-6">
                                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">
                                                        README
                                                    </p>
                                                    <p
                                                        className="text-sm text-muted-foreground leading-relaxed"
                                                        style={{
                                                            display: "-webkit-box",
                                                            WebkitLineClamp: 3,
                                                            WebkitBoxOrient: "vertical",
                                                            overflow: "hidden"
                                                        }}
                                                    >
                                                        {readmePreviews[repo.id]}
                                                    </p>
                                                </div>
                                            )}

                                            {repo.language && (
                                                <div className="mb-6">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs sm:text-sm ${getLanguageColor(repo.language)}`}>
                                                        {repo.language}
                                                    </span>
                                                    {repo.stargazers_count > 0 && (
                                                        <span className="ml-3 text-xs sm:text-sm text-muted-foreground">
                                                            ★ {repo.stargazers_count}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex flex-wrap gap-3">
                                                {repo.homepage && (
                                                    <Button size="sm" className="w-full sm:w-auto" asChild>
                                                        <a href={repo.homepage} target="_blank" rel="noopener noreferrer">
                                                            <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                                                        </a>
                                                    </Button>
                                                )}
                                                <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                                        <Github className="mr-2 h-4 w-4" /> View Code
                                                    </a>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="bg-background rounded-lg border overflow-hidden w-full max-w-xl md:max-w-2xl aspect-[4/3] md:aspect-video mx-auto flex items-center justify-center">
                                            {screenshotUrls[repo.id] ? (
                                                <img
                                                    src={screenshotUrls[repo.id]}
                                                    alt={`${repo.name} screenshot`}
                                                    className="h-full w-full object-cover"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="text-center h-full w-full flex flex-col items-center justify-center">
                                                    <Github className="h-10 w-10 mx-auto mb-2 text-primary" />
                                                    <span className="text-lg text-muted-foreground">{repo.name}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </HorizontalScroll>
                )}
            </div>

            {/* Ending/Contact Section */}
            <div ref={ctaSectionRef} className="py-24 bg-primary/10 h-[80vh] flex items-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6 cta-content">Interested in Working Together?</h2>
                        <p className="text-lg text-muted-foreground mb-8 cta-content">
                            I&apos;m always open to discussing new projects, creative ideas or opportunities to be part of your vision.
                            Let&apos;s create something amazing together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {hasLinkedIn && (
                                <Button size="lg" className="cta-buttons" onClick={() => window.open(site.linkedinUrl, "_blank")}>
                                    <Linkedin className="mr-2 h-4 w-4" /> Connect Me
                                </Button>
                            )}
                            {hasGitHub && (
                                <Button variant="outline" size="lg" className="cta-buttons" onClick={() => window.open(site.githubUrl, "_blank")}>
                                    <Github className="mr-2 h-4 w-4" /> View GitHub
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
