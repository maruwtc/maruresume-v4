import { BookText, Briefcase, FolderKanban, Mail, Settings2, Shield, Terminal, User } from "lucide-react";
import type { AppConfig, AppId, ExperienceItem, WindowState } from "@/components/os/types";

export const apps: AppConfig[] = [
  {
    id: "about",
    title: "About",
    icon: User,
    position: { top: 72, left: 72 },
    size: { width: 640, height: 470 },
  },
  {
    id: "experience",
    title: "Experience",
    icon: Briefcase,
    position: { top: 120, left: 420 },
    size: { width: 700, height: 520 },
  },
  {
    id: "skills",
    title: "Skills",
    icon: Shield,
    position: { top: 210, left: 120 },
    size: { width: 620, height: 430 },
  },
  {
    id: "contact",
    title: "Contact",
    icon: Mail,
    position: { top: 180, left: 710 },
    size: { width: 540, height: 390 },
  },
  {
    id: "projects",
    title: "Projects",
    icon: FolderKanban,
    position: { top: 72, left: 740 },
    size: { width: 520, height: 390 },
  },
  {
    id: "handbook",
    title: "Attack Handbook",
    icon: BookText,
    position: { top: 440, left: 80 },
    size: { width: 580, height: 390 },
  },
  {
    id: "terminal",
    title: "Terminal",
    icon: Terminal,
    position: { top: 100, left: 220 },
    size: { width: 760, height: 530 },
  },
  {
    id: "settings",
    title: "Settings",
    icon: Settings2,
    position: { top: 150, left: 320 },
    size: { width: 480, height: 360 },
  },
];

export const experience: ExperienceItem[] = [
  {
    role: "Senior IT Security Operation Analyst",
    company: "iFAST Holdings",
    period: "Mar 2026 - Present",
    summary:
      "Led IT security audits across systems and applications for HKMA/TRM compliance, performed risk assessments and gap analyses, and conducted PoC evaluations on AI-driven Detection & Response (AIDR) and AI Security Posture Management (AISPM) solutions.",
  },
  {
    role: "IT Security Operation Analyst",
    company: "iFAST Holdings",
    period: "Sep 2023 - Feb 2026",
    summary:
      "Executed Blue Team operations across EDR, SIEM, and DLP platforms; performed Red Team penetration tests and vulnerability management; investigated SOC alerts and coordinated incident remediation.",
  },
  {
    role: "System Engineer",
    company: "NEC Hong Kong Limited",
    period: "Mar 2022 - Jul 2023",
    summary:
      "Managed SD-WAN and site-to-site IPsec VPN implementations, maintained network firewalls, routers, and switches, and assisted in IT security auditing.",
  },
  {
    role: "IT Support Officer",
    company: "TAS Services Limited",
    period: "Dec 2020 - Jan 2022",
    summary:
      "Managed NGFW, infrastructure, and network operations; supported daily office IT operations and led Windows 7 to Windows 10 migration for HKSAR Home Affairs Department.",
  },
  {
    role: "Engineer",
    company: "HKT",
    period: "Sep 2019 - May 2020",
    summary: "Supported implementation and maintenance of IT infrastructure and network environments.",
  },
];

export const skillTags = [
  "Penetration Testing",
  "OWASP WSTG",
  "WAF",
  "DLP",
  "EDR",
  "SIEM",
  "TypeScript",
  "Go",
  "Python",
  "Java",
  "Next.js",
  "Node.js",
  "Gin",
  "Flask",
  "React Native",
  "LAN/WAN",
  "TCP/IP",
  "VPN",
  "NGFW",
  "Cisco Routers & Switches",
  "Cloud Networking",
  "Cloud Security",
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
