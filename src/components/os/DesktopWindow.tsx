import type React from "react";
import { Minus, PictureInPicture2, Square, X } from "lucide-react";
import { renderAppBody } from "@/components/os/AppBody";
import type { AppConfig, AppId, ResizeDirection, WindowState } from "@/components/os/types";

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
        <div className={`os-window-drag ${canDrag ? "desktop" : ""}`} onPointerDown={(event) => onDragStart(app.id, event)}>
          <div className="os-window-title">
            <Icon className="h-4 w-4" />
            <span>{app.title}</span>
          </div>
        </div>
        <div className="os-window-actions">
          <button type="button" className="os-action os-min" onClick={onMinimize} aria-label={`Minimize ${app.title}`}>
            <Minus className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="os-action os-max"
            onClick={onMaximize}
            aria-label={`${state.maximized ? "Restore" : "Maximize"} ${app.title}`}
          >
            {state.maximized ? <PictureInPicture2 className="h-4 w-4" /> : <Square className="h-4 w-4" />}
          </button>
          <button type="button" className="os-action os-close" onClick={onClose} aria-label={`Close ${app.title}`}>
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>
      <div className="os-window-body">{renderAppBody(app.id, onOpenApp)}</div>
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
