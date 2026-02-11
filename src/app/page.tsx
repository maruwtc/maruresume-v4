"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type React from "react";
import { LayoutTemplate, Wrench } from "lucide-react";
import { DesktopWindow } from "@/components/os/DesktopWindow";
import { PhoneShell } from "@/components/os/PhoneShell";
import { TabletShell } from "@/components/os/TabletShell";
import {
  apps,
  clamp,
  INITIAL_OPEN,
  initialWindowState,
  MIN_WINDOW_HEIGHT,
  MIN_WINDOW_WIDTH,
} from "@/components/os/data";
import type { AppId, InteractionState, ResizeDirection, ViewMode, WindowState } from "@/components/os/types";

export default function Home() {
  const workspaceRef = useRef<HTMLElement>(null);
  const interactionRef = useRef<InteractionState | null>(null);
  const windowStateRef = useRef<Record<AppId, WindowState>>(initialWindowState());
  const desktopIconRefs = useRef<Record<AppId, HTMLButtonElement | null>>({
    about: null,
    experience: null,
    skills: null,
    contact: null,
    projects: null,
    terminal: null,
    handbook: null,
  });

  const [openWindows, setOpenWindows] = useState<AppId[]>(INITIAL_OPEN);
  const [order, setOrder] = useState<AppId[]>(INITIAL_OPEN);
  const [windowState, setWindowState] = useState<Record<AppId, WindowState>>(() => initialWindowState());
  const [startOpen, setStartOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("desktop");
  const [phoneActiveApp, setPhoneActiveApp] = useState<AppId | null>(null);
  const [tabletActiveApp, setTabletActiveApp] = useState<AppId | null>(null);
  const [selectedDesktopApps, setSelectedDesktopApps] = useState<AppId[]>([]);
  const [selectionBox, setSelectionBox] = useState<{
    active: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    windowStateRef.current = windowState;
  }, [windowState]);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setViewMode("phone");
        return;
      }
      if (width <= 1180) {
        setViewMode("tablet");
        return;
      }
      setViewMode("desktop");
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (viewMode === "phone") setPhoneActiveApp(null);
    if (viewMode === "tablet") setTabletActiveApp(null);
  }, [viewMode]);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isDesktop = viewMode === "desktop";
  const isPhone = viewMode === "phone";
  const isTablet = viewMode === "tablet";

  const clockText = useMemo(() => {
    if (!now) return "--:--:--";
    return now.toLocaleTimeString([], { hour12: false });
  }, [now]);

  const dateText = useMemo(() => {
    if (!now) return "--";
    return now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "short", day: "numeric" });
  }, [now]);

  const hourAngle = useMemo(() => {
    if (!now) return 0;
    return ((now.getHours() % 12) + now.getMinutes() / 60) * 30;
  }, [now]);

  const minuteAngle = useMemo(() => {
    if (!now) return 0;
    return (now.getMinutes() + now.getSeconds() / 60) * 6;
  }, [now]);

  const secondAngle = useMemo(() => {
    if (!now) return 0;
    return now.getSeconds() * 6;
  }, [now]);

  const focusApp = (id: AppId) => {
    setOrder((prev) => [...prev.filter((entry) => entry !== id), id]);
  };

  const openApp = (id: AppId) => {
    if (isPhone) {
      setPhoneActiveApp(id);
      return;
    }

    if (isTablet) {
      setTabletActiveApp(id);
      return;
    }

    setOpenWindows((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setWindowState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        minimized: false,
      },
    }));
    focusApp(id);
    setSelectedDesktopApps([id]);
    setStartOpen(false);
  };

  const closeApp = (id: AppId) => {
    setOpenWindows((prev) => prev.filter((entry) => entry !== id));
    setOrder((prev) => prev.filter((entry) => entry !== id));
  };

  const minimizeApp = (id: AppId) => {
    setWindowState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        minimized: true,
      },
    }));
    setOrder((prev) => prev.filter((entry) => entry !== id));
  };

  const toggleMaximize = (id: AppId) => {
    if (!workspaceRef.current || !isDesktop) return;

    const bounds = workspaceRef.current.getBoundingClientRect();

    setWindowState((prev) => {
      const current = prev[id];
      if (current.maximized && current.restoreFrame) {
        return {
          ...prev,
          [id]: {
            ...current,
            frame: current.restoreFrame,
            restoreFrame: undefined,
            maximized: false,
          },
        };
      }

      return {
        ...prev,
        [id]: {
          ...current,
          frame: {
            top: 8,
            left: 8,
            width: Math.max(320, bounds.width - 16),
            height: Math.max(240, bounds.height - 16),
          },
          restoreFrame: current.frame,
          maximized: true,
          minimized: false,
        },
      };
    });

    focusApp(id);
  };

  const onTaskbarClick = (id: AppId) => {
    const current = windowState[id];
    const activeApp = order.at(-1);

    if (current.minimized) {
      openApp(id);
      return;
    }

    if (activeApp === id) {
      minimizeApp(id);
      return;
    }

    focusApp(id);
  };

  const startDrag = (id: AppId, event: React.PointerEvent<HTMLElement>) => {
    if (!isDesktop) return;
    if (!workspaceRef.current) return;
    if (windowState[id].maximized) return;

    const workspaceRect = workspaceRef.current.getBoundingClientRect();
    const frame = windowState[id].frame;

    interactionRef.current = {
      mode: "move",
      id,
      pointerId: event.pointerId,
      offsetX: event.clientX - workspaceRect.left - frame.left,
      offsetY: event.clientY - workspaceRect.top - frame.top,
    };

    setDragging(true);
    focusApp(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const startResize = (id: AppId, direction: ResizeDirection, event: React.PointerEvent<HTMLElement>) => {
    if (!isDesktop) return;
    if (!workspaceRef.current) return;
    if (windowState[id].maximized) return;

    interactionRef.current = {
      mode: "resize",
      id,
      pointerId: event.pointerId,
      direction,
      startX: event.clientX,
      startY: event.clientY,
      startFrame: windowState[id].frame,
    };

    setDragging(true);
    focusApp(id);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!interactionRef.current || !workspaceRef.current) return;
      const interaction = interactionRef.current;
      const workspaceRect = workspaceRef.current.getBoundingClientRect();

      if (interaction.mode === "move") {
        const currentFrame = windowStateRef.current[interaction.id].frame;
        const nextLeft = clamp(
          event.clientX - workspaceRect.left - interaction.offsetX,
          0,
          Math.max(0, workspaceRect.width - currentFrame.width)
        );
        const nextTop = clamp(
          event.clientY - workspaceRect.top - interaction.offsetY,
          0,
          Math.max(0, workspaceRect.height - currentFrame.height)
        );

        setWindowState((prev) => ({
          ...prev,
          [interaction.id]: {
            ...prev[interaction.id],
            frame: {
              ...prev[interaction.id].frame,
              top: nextTop,
              left: nextLeft,
            },
          },
        }));

        return;
      }

      const { direction, startFrame } = interaction;
      const dx = event.clientX - interaction.startX;
      const dy = event.clientY - interaction.startY;
      const hasLeft = direction.includes("left");
      const hasRight = direction.includes("right");
      const hasTop = direction.includes("top");
      const hasBottom = direction.includes("bottom");

      let nextLeft = startFrame.left;
      let nextTop = startFrame.top;
      let nextWidth = startFrame.width;
      let nextHeight = startFrame.height;

      if (hasRight) {
        nextWidth = clamp(startFrame.width + dx, MIN_WINDOW_WIDTH, workspaceRect.width - startFrame.left);
      }

      if (hasBottom) {
        nextHeight = clamp(startFrame.height + dy, MIN_WINDOW_HEIGHT, workspaceRect.height - startFrame.top);
      }

      if (hasLeft) {
        nextLeft = clamp(startFrame.left + dx, 0, startFrame.left + startFrame.width - MIN_WINDOW_WIDTH);
        nextWidth = startFrame.width + (startFrame.left - nextLeft);
      }

      if (hasTop) {
        nextTop = clamp(startFrame.top + dy, 0, startFrame.top + startFrame.height - MIN_WINDOW_HEIGHT);
        nextHeight = startFrame.height + (startFrame.top - nextTop);
      }

      nextWidth = Math.min(nextWidth, workspaceRect.width - nextLeft);
      nextHeight = Math.min(nextHeight, workspaceRect.height - nextTop);

      setWindowState((prev) => ({
        ...prev,
        [interaction.id]: {
          ...prev[interaction.id],
          frame: {
            top: nextTop,
            left: nextLeft,
            width: nextWidth,
            height: nextHeight,
          },
        },
      }));
    };

    const onPointerUp = (event: PointerEvent) => {
      if (!interactionRef.current) return;
      if (interactionRef.current.pointerId !== event.pointerId) return;
      interactionRef.current = null;
      setDragging(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  useEffect(() => {
    if (!workspaceRef.current || !isDesktop) return;

    const onResize = () => {
      const bounds = workspaceRef.current?.getBoundingClientRect();
      if (!bounds) return;

      setWindowState((prev) => {
        const next = { ...prev };

        apps.forEach((app) => {
          const state = next[app.id];
          if (!state.maximized) return;

          next[app.id] = {
            ...state,
            frame: {
              top: 8,
              left: 8,
              width: Math.max(320, bounds.width - 16),
              height: Math.max(240, bounds.height - 16),
            },
          };
        });

        return next;
      });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isDesktop]);

  const activeApp = order.at(-1);

  const startDesktopSelection = (event: React.PointerEvent<HTMLElement>) => {
    if (!isDesktop) return;
    if (event.button !== 0) return;
    const target = event.target as HTMLElement;

    if (
      target.closest(".os-window") ||
      target.closest(".os-taskbar") ||
      target.closest(".os-start-menu") ||
      target.closest(".os-widget-rail") ||
      target.closest(".os-icon")
    ) {
      return;
    }

    setSelectedDesktopApps([]);
    const startX = event.clientX;
    const startY = event.clientY;
    setSelectionBox({
      active: true,
      startX,
      startY,
      currentX: startX,
      currentY: startY,
    });
  };

  useEffect(() => {
    if (!selectionBox?.active) return;

    const onPointerMove = (event: PointerEvent) => {
      const currentX = event.clientX;
      const currentY = event.clientY;
      setSelectionBox((prev) => (prev ? { ...prev, currentX, currentY } : prev));

      const left = Math.min(selectionBox.startX, currentX);
      const right = Math.max(selectionBox.startX, currentX);
      const top = Math.min(selectionBox.startY, currentY);
      const bottom = Math.max(selectionBox.startY, currentY);

      const selected = apps
        .filter((app) => {
          const element = desktopIconRefs.current[app.id];
          if (!element) return false;
          const rect = element.getBoundingClientRect();
          return !(rect.right < left || rect.left > right || rect.bottom < top || rect.top > bottom);
        })
        .map((app) => app.id);

      setSelectedDesktopApps(selected);
    };

    const onPointerUp = () => {
      setSelectionBox(null);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [selectionBox]);

  useEffect(() => {
    if (!startOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.closest(".os-start-menu") || target.closest(".start-btn")) return;
      setStartOpen(false);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [startOpen]);

  if (isPhone) {
    return (
      <PhoneShell
        activeAppId={phoneActiveApp}
        onOpenApp={openApp}
        onGoHome={() => setPhoneActiveApp(null)}
        dateText={dateText}
        clockText={clockText}
      />
    );
  }

  if (isTablet) {
    return (
      <TabletShell
        activeAppId={tabletActiveApp}
        onOpenApp={openApp}
        onGoHome={() => setTabletActiveApp(null)}
        dateText={dateText}
        clockText={clockText}
      />
    );
  }

  return (
    <main
      className={`os-shell mode-${viewMode} ${dragging ? "dragging" : ""}`}
      onPointerDown={startDesktopSelection}
    >
      <div className="os-wallpaper" aria-hidden="true" />

      <section className="os-desktop-icons" aria-label="Desktop icons">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              type="button"
              ref={(el) => {
                desktopIconRefs.current[app.id] = el;
              }}
              className={`os-icon ${selectedDesktopApps.includes(app.id) ? "selected" : ""}`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                setSelectedDesktopApps([app.id]);
              }}
              onDoubleClick={(event) => {
                event.stopPropagation();
                openApp(app.id);
              }}
            >
              <span className="os-icon-badge">
                <Icon className="h-5 w-5" />
              </span>
              <span>{app.title}</span>
            </button>
          );
        })}
      </section>
      {selectionBox?.active && (
        <div
          className="desktop-select-box"
          style={{
            left: Math.min(selectionBox.startX, selectionBox.currentX),
            top: Math.min(selectionBox.startY, selectionBox.currentY),
            width: Math.abs(selectionBox.currentX - selectionBox.startX),
            height: Math.abs(selectionBox.currentY - selectionBox.startY),
          }}
          aria-hidden="true"
        />
      )}

      <aside className="os-widget-rail" aria-label="Desktop widgets">
        <section className="os-widget clock-widget">
          <h2>Local Clock</h2>
          <div className="analog-clock" aria-label="Analog clock">
            <span className="clock-mark top" />
            <span className="clock-mark right" />
            <span className="clock-mark bottom" />
            <span className="clock-mark left" />
            <span className="clock-hand hour" style={{ transform: `translateX(-50%) rotate(${hourAngle}deg)` }} />
            <span className="clock-hand minute" style={{ transform: `translateX(-50%) rotate(${minuteAngle}deg)` }} />
            <span className="clock-hand second" style={{ transform: `translateX(-50%) rotate(${secondAngle}deg)` }} />
            <span className="clock-center" />
          </div>
          <p className="widget-time">{clockText}</p>
          <p className="widget-date">{dateText}</p>
        </section>

        <section className="os-widget">
          <h2>System</h2>
          <p>Profile: ChrisOS Desktop</p>
          <p>Mode: Security + Engineering</p>
          <p>Shell: `zsh` compatible</p>
        </section>

        <section className="os-widget">
          <h2>Quick Tips</h2>
          <p>Use terminal `help` to list commands.</p>
          <p>Drag window title bars to move windows.</p>
          <p>Drag window borders/corners to resize.</p>
        </section>
      </aside>

      <section ref={workspaceRef} className="os-workspace" aria-label="Workspace">
        {openWindows.map((id) => {
          const app = apps.find((entry) => entry.id === id);
          if (!app) return null;

          const state = windowState[id];
          if (state.minimized) return null;

          return (
            <DesktopWindow
              key={app.id}
              app={app}
              state={state}
              zIndex={50 + order.indexOf(app.id)}
              canResize={isDesktop}
              canDrag={isDesktop}
              isActive={activeApp === app.id}
              onFocus={() => focusApp(app.id)}
              onClose={() => closeApp(app.id)}
              onMinimize={() => minimizeApp(app.id)}
              onMaximize={() => toggleMaximize(app.id)}
              onDragStart={startDrag}
              onResizeStart={startResize}
              onOpenApp={openApp}
            />
          );
        })}
      </section>

      {startOpen && (
        <aside className="os-start-menu" aria-label="Start menu">
          <h2>
            <Wrench className="h-4 w-4" />
            Quick Launch
          </h2>
          {apps.map((app) => {
            const Icon = app.icon;
            return (
              <button key={app.id} type="button" className="os-start-item" onClick={() => openApp(app.id)}>
                <Icon className="h-4 w-4" />
                {app.title}
              </button>
            );
          })}
        </aside>
      )}

      <nav className="os-taskbar" aria-label="Taskbar">
        <button type="button" className={`start-btn ${startOpen ? "active" : ""}`} onClick={() => setStartOpen((prev) => !prev)}>
          <LayoutTemplate className="h-4 w-4" />
        </button>

        <div className="os-running">
          {openWindows.map((id) => {
            const app = apps.find((entry) => entry.id === id);
            if (!app) return null;

            const Icon = app.icon;
            return (
              <button
                key={`task-${id}`}
                type="button"
                className={`os-task-btn ${activeApp === id ? "active" : ""} ${windowState[id].minimized ? "minimized" : ""}`}
                onClick={() => onTaskbarClick(id)}
                aria-label={`Focus ${app.title}`}
              >
                <Icon className="h-4 w-4" />
                <span>{app.title}</span>
              </button>
            );
          })}
        </div>

        <div className="os-clock">{clockText}</div>
      </nav>
    </main>
  );
}
