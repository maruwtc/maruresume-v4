import { BookText, Briefcase, FolderKanban, Mail, Shield, Terminal, User } from "lucide-react";
import type { AppConfig, AppId, ExperienceItem, WindowState } from "@/components/os/types";

export const apps: AppConfig[] = [
  {
    id: "about",
    title: "About.me",
    icon: User,
    position: { top: 72, left: 72 },
    size: { width: 640, height: 470 },
  },
  {
    id: "experience",
    title: "Experience.log",
    icon: Briefcase,
    position: { top: 120, left: 420 },
    size: { width: 700, height: 520 },
  },
  {
    id: "skills",
    title: "Skills.matrix",
    icon: Shield,
    position: { top: 210, left: 120 },
    size: { width: 620, height: 430 },
  },
  {
    id: "contact",
    title: "Contact.link",
    icon: Mail,
    position: { top: 180, left: 710 },
    size: { width: 540, height: 390 },
  },
  {
    id: "projects",
    title: "Projects.dir",
    icon: FolderKanban,
    position: { top: 72, left: 740 },
    size: { width: 520, height: 390 },
  },
  {
    id: "handbook",
    title: "Attack-Handbook",
    icon: BookText,
    position: { top: 440, left: 80 },
    size: { width: 580, height: 390 },
  },
  {
    id: "terminal",
    title: "Security-Terminal",
    icon: Terminal,
    position: { top: 100, left: 220 },
    size: { width: 760, height: 530 },
  },
];

export const experience: ExperienceItem[] = [
  {
    role: "IT Security Operations Analyst",
    company: "iFAST Hong Kong Holdings Limited",
    period: "Sep 2023 - Present",
    summary:
      "Led blue-team controls, red-team testing, audit support, and automation-driven operational hardening.",
  },
  {
    role: "System Engineer",
    company: "NEC Hong Kong Limited",
    period: "Mar 2022 - Jul 2023",
    summary:
      "Delivered SD-WAN and IPsec projects, maintained core network infrastructure, and supported security operations.",
  },
  {
    role: "IT Support Officer",
    company: "TAS Services Limited",
    period: "Dec 2020 - Jan 2022",
    summary: "Handled daily enterprise IT support and service reliability activities.",
  },
  {
    role: "Engineer",
    company: "HKT",
    period: "Sep 2019 - May 2020",
    summary: "Supported implementation and maintenance work across IT environments.",
  },
];

export const skillTags = [
  "TypeScript",
  "React",
  "Node.js",
  "Golang",
  "Python",
  "Penetration Testing",
  "Network Security",
  "Vulnerability Assessment",
  "Information Security",
];

export const INITIAL_OPEN: AppId[] = ["terminal"];
export const MIN_WINDOW_WIDTH = 320;
export const MIN_WINDOW_HEIGHT = 220;

export function clamp(value: number, min: number, max: number) {
  if (max <= min) return min;
  return Math.min(Math.max(value, min), max);
}

export function initialWindowState(): Record<AppId, WindowState> {
  return apps.reduce((acc, app) => {
    acc[app.id] = {
      frame: {
        top: app.position.top,
        left: app.position.left,
        width: app.size.width,
        height: app.size.height,
      },
      minimized: false,
      maximized: false,
    };
    return acc;
  }, {} as Record<AppId, WindowState>);
}
