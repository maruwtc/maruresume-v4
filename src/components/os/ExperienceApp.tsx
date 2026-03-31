"use client";

import { useState } from "react";
import { Briefcase, ChevronDown } from "lucide-react";
import { experience } from "@/components/os/data";

export function ExperienceApp() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggle = (idx: number) => setExpanded((prev) => (prev === idx ? null : idx));

  return (
    <div className="exp-timeline">
      {experience.map((item, idx) => {
        const isOpen = expanded === idx;
        return (
          <div key={`${item.company}-${item.role}`} className="exp-entry">
            {/* Spine */}
            <div className="exp-spine" aria-hidden="true">
              <div className="exp-dot">
                <Briefcase className="h-3 w-3" />
              </div>
              {idx < experience.length - 1 && <div className="exp-line" />}
            </div>

            {/* Content */}
            <div className="exp-body">
              <span className="exp-period">{item.period}</span>
              <h3 className="exp-role">{item.role}</h3>
              <span className="exp-company">{item.company}</span>

              {/* Tech stack chips */}
              {item.techStack && item.techStack.length > 0 && (
                <div className="chip-row exp-tech-row">
                  {item.techStack.map((tech) => (
                    <span key={tech} className="chip chip-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Expandable bullets */}
              {item.bullets && item.bullets.length > 0 && (
                <>
                  <button
                    type="button"
                    className="exp-toggle-btn"
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                  >
                    <ChevronDown
                      className="h-3.5 w-3.5"
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 200ms ease",
                      }}
                    />
                    {isOpen ? "Hide details" : "Show details"}
                  </button>
                  {isOpen && (
                    <ul className="exp-bullets">
                      {item.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
