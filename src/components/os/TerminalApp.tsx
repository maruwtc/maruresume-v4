"use client";

import { useEffect, useRef, useState } from "react";
import { apps, experience, skillTags } from "@/components/os/data";
import type { AppId } from "@/components/os/types";
import { hasGitHub, hasLinkedIn, site } from "@/lib/site";

type TerminalLineKind = "input" | "output" | "error" | "system";

type TerminalLine = {
  id: number;
  kind: TerminalLineKind;
  text: string;
};

type CtfFile = {
  path: string;
  content: string;
};

type CtfChallenge = {
  id: string;
  name: string;
  description: string;
  objective: string;
  startDir: string;
  hint: string;
  flag: string;
  dirs: string[];
  files: CtfFile[];
};

const ctfChallenges: CtfChallenge[] = [
  {
    id: "log-hunter",
    name: "Log Hunter",
    description: "Find a leaked flag hidden in service logs.",
    objective: "Inspect logs and submit the leaked flag.",
    startDir: "/var/log",
    hint: "Check auth and backup logs first.",
    flag: "CTF{log_hunter_42}",
    dirs: ["/", "/var", "/var/log", "/home", "/home/ctf"],
    files: [
      {
        path: "/README.txt",
        content:
          "Challenge: Log Hunter\nA SOC analyst reported secret leakage in logs.\nUse ls/cd/cat/grep to find the flag.\n",
      },
      {
        path: "/var/log/auth.log",
        content:
          "08:11:02 login accepted user=ctf\n08:12:19 sudo denied user=guest\n08:14:39 debug token candidate=CTF{log_hunter_42}\n08:15:22 session closed user=ctf\n",
      },
      {
        path: "/var/log/backup.log",
        content: "backup job: ok\nbackup job: ok\nbackup job: warning: skipped tmp\n",
      },
    ],
  },
  {
    id: "config-spelunk",
    name: "Config Spelunk",
    description: "Recover a flag from developer backup configs.",
    objective: "Locate and decode the suspicious value.",
    startDir: "/home/ctf",
    hint: "Look at old env backup files and decode base64 text.",
    flag: "CTF{env_backup_leak}",
    dirs: ["/", "/home", "/home/ctf", "/home/ctf/projects"],
    files: [
      {
        path: "/README.txt",
        content:
          "Challenge: Config Spelunk\nA redacted .env backup was committed by mistake.\nFind and decode the encoded secret.\n",
      },
      {
        path: "/home/ctf/.env.bak",
        content: "APP_MODE=dev\nNEXT_PUBLIC_ANALYTICS=off\nFLAG_B64=Q1RGe2Vudl9iYWNrdXBfbGVha30=\n",
      },
      {
        path: "/home/ctf/projects/notes.txt",
        content: "Reminder: use strings or decode helpers for strange values.\n",
      },
    ],
  },
  {
    id: "source-peek",
    name: "Source Peek",
    description: "Read source snippets to find insecure debug leftovers.",
    objective: "Trace debug notes in source and submit the flag.",
    startDir: "/app",
    hint: "Check login source and old comments.",
    flag: "CTF{debug_comment_exposed}",
    dirs: ["/", "/app", "/app/src", "/app/src/auth"],
    files: [
      {
        path: "/README.txt",
        content:
          "Challenge: Source Peek\nA debug shortcut may have been left in source code.\nReview files in /app/src/auth.\n",
      },
      {
        path: "/app/src/auth/login.ts",
        content:
          "export function login(u: string, p: string) {\n  // TODO remove before release: debug_flag=CTF{debug_comment_exposed}\n  return u.length > 0 && p.length > 0;\n}\n",
      },
      {
        path: "/app/src/auth/policy.md",
        content: "Policy: remove test credentials and debug comments prior to prod deployment.\n",
      },
    ],
  },
];

function normalizePath(basePath: string, rawPath: string) {
  const joined = rawPath.startsWith("/") ? rawPath : `${basePath}/${rawPath}`;
  const parts = joined.split("/").filter(Boolean);
  const stack: string[] = [];

  parts.forEach((part) => {
    if (part === ".") return;
    if (part === "..") {
      stack.pop();
      return;
    }
    stack.push(part);
  });

  return `/${stack.join("/")}`;
}

function listDir(challenge: CtfChallenge, dirPath: string) {
  if (!challenge.dirs.includes(dirPath)) return null;

  const prefix = dirPath === "/" ? "/" : `${dirPath}/`;
  const entries = new Set<string>();

  challenge.dirs.forEach((dir) => {
    if (!dir.startsWith(prefix) || dir === dirPath) return;
    const rest = dir.slice(prefix.length);
    if (!rest) return;
    const first = rest.split("/")[0];
    entries.add(`${first}/`);
  });

  challenge.files.forEach((file) => {
    if (!file.path.startsWith(prefix)) return;
    const rest = file.path.slice(prefix.length);
    if (!rest || rest.includes("/")) return;
    entries.add(rest);
  });

  return Array.from(entries).sort();
}

function readFile(challenge: CtfChallenge, path: string) {
  return challenge.files.find((file) => file.path === path)?.content ?? null;
}

export function TerminalApp({ onOpenApp }: { onOpenApp: (id: AppId) => void }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalLine[]>([
    { id: 0, kind: "system", text: "ChrisOS Security Terminal v1.0" },
    { id: 1, kind: "system", text: "Type `help` to list commands. Type `ctf list` to play CTF simulation." },
    { id: 2, kind: "system", text: "" },
  ]);
  const [cwd, setCwd] = useState("/home/chris");
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [solvedChallenges, setSolvedChallenges] = useState<string[]>([]);
  const viewportRef = useRef<HTMLDivElement>(null);
  const nextLineIdRef = useRef(3);

  useEffect(() => {
    viewportRef.current?.scrollTo({ top: viewportRef.current.scrollHeight, behavior: "smooth" });
  }, [history]);

  const pushLine = (kind: TerminalLineKind, text: string) => {
    const id = nextLineIdRef.current;
    nextLineIdRef.current += 1;
    setHistory((prev) => [...prev, { id, kind, text }]);
  };

  const getChallenge = () => ctfChallenges.find((challenge) => challenge.id === activeChallengeId) ?? null;

  const runCtfMetaCommand = (args: string[]) => {
    const sub = (args[0] || "").toLowerCase();

    if (!sub || sub === "help") {
      pushLine("output", "ctf commands: ctf list | ctf start <id> | ctf status | ctf hint | ctf exit | ctf reset");
      return;
    }

    if (sub === "list") {
      ctfChallenges.forEach((challenge) => {
        const solvedTag = solvedChallenges.includes(challenge.id) ? " [solved]" : "";
        pushLine("output", `${challenge.id}${solvedTag} - ${challenge.name}: ${challenge.description}`);
      });
      return;
    }

    if (sub === "start") {
      const challenge = ctfChallenges.find((item) => item.id === args[1]);
      if (!challenge) {
        pushLine("error", "Usage: ctf start <id>. Run `ctf list` first.");
        return;
      }
      setActiveChallengeId(challenge.id);
      setCwd(challenge.startDir);
      pushLine("system", `Started challenge: ${challenge.name}`);
      pushLine("system", `Objective: ${challenge.objective}`);
      pushLine("system", "Tip: run ls, cd, cat, grep <pattern> <file>, strings <file>, submit <flag>");
      return;
    }

    if (sub === "status") {
      const challenge = getChallenge();
      if (!challenge) {
        pushLine("output", `No active challenge. Solved ${solvedChallenges.length}/${ctfChallenges.length}.`);
        return;
      }
      pushLine("output", `Active: ${challenge.id} (${challenge.name})`);
      pushLine("output", `Objective: ${challenge.objective}`);
      pushLine("output", `Working dir: ${cwd}`);
      return;
    }

    if (sub === "hint") {
      const challenge = getChallenge();
      if (!challenge) {
        pushLine("error", "No active challenge. Start one using `ctf start <id>`." );
        return;
      }
      pushLine("output", `Hint: ${challenge.hint}`);
      return;
    }

    if (sub === "exit") {
      if (!getChallenge()) {
        pushLine("output", "No active challenge.");
        return;
      }
      setActiveChallengeId(null);
      setCwd("/home/chris");
      pushLine("system", "Exited CTF challenge mode.");
      return;
    }

    if (sub === "reset") {
      setActiveChallengeId(null);
      setSolvedChallenges([]);
      setCwd("/home/chris");
      pushLine("system", "CTF progress reset.");
      return;
    }

    pushLine("error", "Unknown ctf command. Try `ctf help`.");
  };

  const runCommand = (rawInput: string) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    pushLine("input", `chris@security-os:${cwd}$ ${trimmed}`);

    const [cmdRaw, ...args] = trimmed.split(/\s+/);
    const cmd = cmdRaw.toLowerCase();
    const activeChallenge = getChallenge();

    if (cmd === "help") {
      pushLine("output", "Available: help, whoami, uname, pwd, ls, cd, cat, grep, strings, submit, ctf, open <app>, skills, experience, contact, date, echo <text>, clear");
      pushLine("output", "For CTF simulation: ctf list -> ctf start <id> -> find flag -> submit CTF{...}");
      return;
    }

    if (cmd === "ctf") {
      runCtfMetaCommand(args);
      return;
    }

    if (cmd === "clear") {
      setHistory([]);
      return;
    }

    if (cmd === "whoami") {
      pushLine("output", "Chris Wong");
      return;
    }

    if (cmd === "uname") {
      pushLine("output", "ChrisOS 1.0.0 web-security build");
      return;
    }

    if (cmd === "pwd") {
      pushLine("output", cwd);
      return;
    }

    if (cmd === "date") {
      pushLine("output", new Date().toString());
      return;
    }

    if (cmd === "ls") {
      if (!activeChallenge) {
        pushLine("output", apps.map((app) => app.id).join("  "));
        return;
      }
      const targetPath = normalizePath(cwd, args[0] ?? ".");
      const entries = listDir(activeChallenge, targetPath);
      if (!entries) {
        pushLine("error", `ls: cannot access '${targetPath}': Not a directory`);
        return;
      }
      pushLine("output", entries.join("  ") || "(empty)");
      return;
    }

    if (cmd === "cd") {
      if (!activeChallenge) {
        pushLine("error", "cd is available inside active CTF challenges. Use `ctf start <id>`.");
        return;
      }
      const targetPath = normalizePath(cwd, args[0] ?? "/");
      if (!activeChallenge.dirs.includes(targetPath)) {
        pushLine("error", `cd: no such directory: ${targetPath}`);
        return;
      }
      setCwd(targetPath);
      return;
    }

    if (cmd === "cat") {
      if (!activeChallenge) {
        pushLine("error", "cat is available inside active CTF challenges.");
        return;
      }
      if (!args[0]) {
        pushLine("error", "Usage: cat <file>");
        return;
      }
      const path = normalizePath(cwd, args[0]);
      const content = readFile(activeChallenge, path);
      if (!content) {
        pushLine("error", `cat: ${path}: No such file`);
        return;
      }
      content.split("\n").forEach((line) => pushLine("output", line));
      return;
    }

    if (cmd === "grep") {
      if (!activeChallenge) {
        pushLine("error", "grep is available inside active CTF challenges.");
        return;
      }
      if (args.length < 2) {
        pushLine("error", "Usage: grep <pattern> <file>");
        return;
      }
      const [pattern, fileName] = args;
      const path = normalizePath(cwd, fileName);
      const content = readFile(activeChallenge, path);
      if (!content) {
        pushLine("error", `grep: ${path}: No such file`);
        return;
      }
      const lines = content.split("\n").filter((line) => line.toLowerCase().includes(pattern.toLowerCase()));
      if (!lines.length) {
        pushLine("output", "(no matches)");
        return;
      }
      lines.forEach((line) => pushLine("output", line));
      return;
    }

    if (cmd === "strings") {
      if (!activeChallenge) {
        pushLine("error", "strings is available inside active CTF challenges.");
        return;
      }
      if (!args[0]) {
        pushLine("error", "Usage: strings <file>");
        return;
      }
      const path = normalizePath(cwd, args[0]);
      const content = readFile(activeChallenge, path);
      if (!content) {
        pushLine("error", `strings: ${path}: No such file`);
        return;
      }
      const extracted = (content.match(/[ -~]{4,}/g) || []).slice(0, 20);
      if (!extracted.length) {
        pushLine("output", "(no printable strings)");
        return;
      }
      extracted.forEach((line) => pushLine("output", line));
      return;
    }

    if (cmd === "submit") {
      if (!activeChallenge) {
        pushLine("error", "submit is available inside active CTF challenges.");
        return;
      }
      const candidate = args.join(" ");
      if (!candidate) {
        pushLine("error", "Usage: submit <flag>");
        return;
      }
      if (candidate === activeChallenge.flag) {
        setSolvedChallenges((prev) => (prev.includes(activeChallenge.id) ? prev : [...prev, activeChallenge.id]));
        pushLine("system", "Correct flag. Challenge solved.");
        pushLine("system", "Run `ctf list` for another challenge or `ctf exit`.");
        return;
      }
      pushLine("error", "Incorrect flag. Keep digging.");
      return;
    }

    if (cmd === "echo") {
      pushLine("output", args.join(" "));
      return;
    }

    if (cmd === "skills") {
      pushLine("output", skillTags.join(" | "));
      return;
    }

    if (cmd === "experience") {
      experience.forEach((item) => pushLine("output", `${item.role} @ ${item.company} (${item.period})`));
      return;
    }

    if (cmd === "contact") {
      const channels = [hasLinkedIn ? `LinkedIn: ${site.linkedinUrl}` : "", hasGitHub ? `GitHub: ${site.githubUrl}` : ""]
        .filter(Boolean)
        .join(" | ");
      pushLine("output", channels || "No public contact links configured.");
      return;
    }

    if (cmd === "open") {
      const target = (args[0] || "").toLowerCase() as AppId;
      const validTargets: AppId[] = ["about", "experience", "skills", "contact", "projects", "terminal", "handbook"];
      if (!validTargets.includes(target)) {
        pushLine("error", "Usage: open <about|experience|skills|contact|projects|terminal|handbook>");
        return;
      }
      onOpenApp(target);
      pushLine("output", `Opened ${target}.`);
      return;
    }

    pushLine("error", `command not found: ${cmdRaw}. Try 'help'.`);
  };

  return (
    <div className="terminal-app">
      <div className="terminal-log" ref={viewportRef}>
        {history.map((line) => (
          <p key={line.id} className={`terminal-line ${line.kind}`}>
            {line.text || "\u00A0"}
          </p>
        ))}
      </div>
      <form
        className="terminal-input-row"
        onSubmit={(event) => {
          event.preventDefault();
          runCommand(input);
          setInput("");
        }}
      >
        <span className="terminal-prompt">{`chris@security-os:${cwd}$`}</span>
        <input
          className="terminal-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck={false}
          suppressHydrationWarning
          aria-label="Terminal command input"
        />
      </form>
    </div>
  );
}
