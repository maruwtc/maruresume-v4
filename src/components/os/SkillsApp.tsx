"use client";

import { useState } from "react";
import { skillCategories } from "@/components/os/data";
import type { SkillLevel } from "@/components/os/types";

const LEVEL_LABELS: Record<SkillLevel, string> = {
  expert: "Expert",
  proficient: "Proficient",
  familiar: "Familiar",
};

const ALL_TAB = "All";

export function SkillsApp() {
  const [activeTab, setActiveTab] = useState(ALL_TAB);

  const tabs = [ALL_TAB, ...skillCategories.map((c) => c.label)];
  const visibleCategories =
    activeTab === ALL_TAB
      ? skillCategories
      : skillCategories.filter((c) => c.label === activeTab);

  return (
    <div className="stack">
      {/* Category tabs */}
      <div className="skill-cat-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`skill-cat-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Skill groups */}
      {visibleCategories.map((category) => (
        <div key={category.label}>
          <p className="md3-section-label">{category.label}</p>
          <div className="chip-row">
            {category.skills.map((skill) => (
              <span
                key={skill.name}
                className={`chip skill-chip ${category.colorClass}`}
                title={LEVEL_LABELS[skill.level]}
              >
                <span className={`skill-dot skill-dot-${skill.level}`} />
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="skill-legend">
        {(["expert", "proficient", "familiar"] as SkillLevel[]).map((level) => (
          <span key={level} className="skill-legend-item">
            <span className={`skill-dot skill-dot-${level}`} />
            {LEVEL_LABELS[level]}
          </span>
        ))}
      </div>
    </div>
  );
}
