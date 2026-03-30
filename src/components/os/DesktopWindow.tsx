import type React from "react";
import { Maximize2, Minus, X } from "lucide-react";
import { renderAppBody } from "@/components/os/AppBody";
import type { AppConfig, AppId, LiquidGlassMode, ResizeDirection, ThemeMode, WindowState } from "@/components/os/types";

export function DesktopWindow({
  app,
  state,
  isActive,
  zIndex,
  canResize,
  canDrag,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onDragStart,
  onResizeStart,
  onOpenApp,
  liquidGlassMode,
  onSetLiquidGlassMode,
  themeMode,
  resolvedThemeMode,
  onSetThemeMode,
}: {
  app: AppConfig;
  state: WindowState;
  isActive: boolean;
  zIndex: number;
  canResize: boolean;
  canDrag: boolean;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragStart: (id: AppId, event: React.PointerEvent<HTMLElement>) => void;
  onResizeStart: (id: AppId, direction: ResizeDirection, event: React.PointerEvent<HTMLElement>) => void;
  onOpenApp: (id: AppId) => void;
  liquidGlassMode: LiquidGlassMode;
  onSetLiquidGlassMode: (mode: LiquidGlassMode) => void;
  themeMode: ThemeMode;
  resolvedThemeMode: "light" | "dark";
  onSetThemeMode: (mode: ThemeMode) => void;
}) {
  const Icon = app.icon;

  return (
    <article
      className={`os-window ${isActive ? "active" : ""} ${state.maximized ? "maximized" : ""}`}
      onMouseDown={onFocus}
      style={{
        top: state.frame.top,
        left: state.frame.left,
        width: state.frame.width,
        height: state.frame.height,
        zIndex,
      }}
      aria-label={app.title}
    >
      <header className="os-window-head" onMouseDown={onFocus}>
        {/* macOS-style traffic lights */}
        <div className="os-trafficlights">
          <button
            type="button"
            className="os-tl os-tl-close"
            onClick={onClose}
            aria-label={`Close ${app.title}`}
          >
            <X style={{ width: 7, height: 7 }} />
          </button>
          <button
            type="button"
            className="os-tl os-tl-min"
            onClick={onMinimize}
            aria-label={`Minimize ${app.title}`}
          >
            <Minus style={{ width: 7, height: 7 }} />
          </button>
          <button
            type="button"
            className="os-tl os-tl-max"
            onClick={onMaximize}
            aria-label={`${state.maximized ? "Restore" : "Maximize"} ${app.title}`}
          >
            <Maximize2 style={{ width: 6, height: 6 }} />
          </button>
        </div>

        {/* Drag area with centered title */}
        <div
          className={`os-window-drag ${canDrag ? "desktop" : ""}`}
          onPointerDown={(event) => onDragStart(app.id, event)}
          onDoubleClick={onMaximize}
        >
          <div className="os-window-title">
            <Icon className="h-3.5 w-3.5 opacity-70" />
            <span>{app.title}</span>
          </div>
        </div>
      </header>

      <div className="os-window-body">
        {renderAppBody(app.id, onOpenApp, {
          liquidGlassMode,
          onSetLiquidGlassMode,
          themeMode,
          resolvedThemeMode,
          onSetThemeMode,
        })}
      </div>

      {canResize && !state.maximized && (
        <>
          <button type="button" className="os-resize-handle top" onPointerDown={(event) => onResizeStart(app.id, "top", event)} aria-label={`Resize ${app.title} top`} />
          <button type="button" className="os-resize-handle right" onPointerDown={(event) => onResizeStart(app.id, "right", event)} aria-label={`Resize ${app.title} right`} />
          <button type="button" className="os-resize-handle bottom" onPointerDown={(event) => onResizeStart(app.id, "bottom", event)} aria-label={`Resize ${app.title} bottom`} />
          <button type="button" className="os-resize-handle left" onPointerDown={(event) => onResizeStart(app.id, "left", event)} aria-label={`Resize ${app.title} left`} />
          <button type="button" className="os-resize-handle top-left" onPointerDown={(event) => onResizeStart(app.id, "top-left", event)} aria-label={`Resize ${app.title} top left`} />
          <button type="button" className="os-resize-handle top-right" onPointerDown={(event) => onResizeStart(app.id, "top-right", event)} aria-label={`Resize ${app.title} top right`} />
          <button type="button" className="os-resize-handle bottom-left" onPointerDown={(event) => onResizeStart(app.id, "bottom-left", event)} aria-label={`Resize ${app.title} bottom left`} />
          <button type="button" className="os-resize-handle bottom-right" onPointerDown={(event) => onResizeStart(app.id, "bottom-right", event)} aria-label={`Resize ${app.title} bottom right`} />
        </>
      )}
    </article>
  );
}
