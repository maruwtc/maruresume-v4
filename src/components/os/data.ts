import { BookText, Briefcase, FolderKanban, Mail, Settings2, Shield, Terminal, User } from "lucide-react";
import type { AppConfig, AppId, Certification, ExperienceItem, SkillCategory, WindowState } from "@/components/os/types";

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
    techStack: ["AIDR", "AISPM", "HKMA/TRM", "Risk Assessment", "Gap Analysis"],
    bullets: [
      "Lead IT security audits across systems and applications for HKMA/TRM compliance",
      "Perform risk assessments and gap analyses on enterprise systems",
      "Conduct PoC evaluations on AI-driven Detection & Response (AIDR) solutions",
      "Evaluate AI Security Posture Management (AISPM) platforms",
    ],
  },
  {
    role: "IT Security Operation Analyst",
    company: "iFAST Holdings",
    period: "Sep 2023 - Feb 2026",
    summary:
      "Executed Blue Team operations across EDR, SIEM, and DLP platforms; performed Red Team penetration tests and vulnerability management; investigated SOC alerts and coordinated incident remediation.",
    techStack: ["EDR", "SIEM", "DLP", "Penetration Testing", "Vulnerability Management"],
    bullets: [
      "Executed Blue Team operations across EDR, SIEM, and DLP platforms",
      "Performed Red Team penetration tests and vulnerability management cycles",
      "Investigated SOC alerts and coordinated incident remediation",
      "Monitored and responded to security incidents across multiple environments",
    ],
  },
  {
    role: "System Engineer",
    company: "NEC Hong Kong Limited",
    period: "Mar 2022 - Jul 2023",
    summary:
      "Managed SD-WAN and site-to-site IPsec VPN implementations, maintained network firewalls, routers, and switches, and assisted in IT security auditing.",
    techStack: ["SD-WAN", "IPsec VPN", "NGFW", "Cisco", "IT Auditing"],
    bullets: [
      "Managed SD-WAN and site-to-site IPsec VPN implementations",
      "Maintained network firewalls, routers, and switches",
      "Assisted in IT security auditing and compliance reviews",
    ],
  },
  {
    role: "IT Support Officer",
    company: "TAS Services Limited",
    period: "Dec 2020 - Jan 2022",
    summary:
      "Managed NGFW, infrastructure, and network operations; supported daily office IT operations and led Windows 7 to Windows 10 migration for HKSAR Home Affairs Department.",
    techStack: ["NGFW", "Windows Migration", "Active Directory", "Network Ops"],
    bullets: [
      "Managed NGFW, infrastructure, and network operations",
      "Supported daily office IT operations for enterprise users",
      "Led Windows 7 to Windows 10 migration for HKSAR Home Affairs Department",
    ],
  },
  {
    role: "Engineer",
    company: "HKT",
    period: "Sep 2019 - May 2020",
    summary: "Supported implementation and maintenance of IT infrastructure and network environments.",
    techStack: ["IT Infrastructure", "Network Maintenance"],
    bullets: [
      "Supported implementation and maintenance of IT infrastructure",
      "Maintained network environments and resolved technical issues",
    ],
  },
];

export const certifications: Certification[] = [
  { name: "BSc Computing", issuer: "Coventry University", year: 2024 },
  { name: "Advanced Diploma in IT", issuer: "HKU SPACE", year: 2023 },
];

export const skillCategories: SkillCategory[] = [
  {
    label: "Security",
    colorClass: "skill-cat-security",
    skills: [
      { name: "Penetration Testing", level: "expert" },
      { name: "OWASP WSTG", level: "expert" },
      { name: "SIEM", level: "proficient" },
      { name: "EDR", level: "proficient" },
      { name: "DLP", level: "proficient" },
      { name: "WAF", level: "proficient" },
      { name: "Cloud Security", level: "familiar" },
    ],
  },
  {
    label: "Development",
    colorClass: "skill-cat-dev",
    skills: [
      { name: "TypeScript", level: "expert" },
      { name: "Go", level: "proficient" },
      { name: "Python", level: "proficient" },
      { name: "Next.js", level: "proficient" },
      { name: "Node.js", level: "proficient" },
      { name: "Gin", level: "proficient" },
      { name: "Java", level: "familiar" },
      { name: "Flask", level: "familiar" },
      { name: "React Native", level: "familiar" },
    ],
  },
  {
    label: "Infrastructure",
    colorClass: "skill-cat-infra",
    skills: [
      { name: "LAN/WAN", level: "expert" },
      { name: "TCP/IP", level: "expert" },
      { name: "VPN", level: "expert" },
      { name: "NGFW", level: "proficient" },
      { name: "Cisco Routers & Switches", level: "proficient" },
      { name: "SD-WAN", level: "familiar" },
      { name: "Cloud Networking", level: "familiar" },
    ],
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
