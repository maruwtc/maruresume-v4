import type React from "react";

export type AppId = "about" | "experience" | "skills" | "contact" | "projects" | "terminal" | "handbook";
export type ViewMode = "desktop" | "tablet" | "phone";

export type AppConfig = {
  id: AppId;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  position: { top: number; left: number };
  size: { width: number; height: number };
};

export type WindowFrame = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type WindowState = {
  frame: WindowFrame;
  minimized: boolean;
  maximized: boolean;
  restoreFrame?: WindowFrame;
};

export type ResizeDirection = "top" | "right" | "bottom" | "left" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

export type InteractionState =
  | {
      mode: "move";
      id: AppId;
      pointerId: number;
      offsetX: number;
      offsetY: number;
    }
  | {
      mode: "resize";
      id: AppId;
      pointerId: number;
      direction: ResizeDirection;
      startX: number;
      startY: number;
      startFrame: WindowFrame;
    };

export type ExperienceItem = {
  role: string;
  company: string;
  period: string;
  summary: string;
};
