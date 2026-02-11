// components/animations/HorizontalScroll.tsx
"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface HorizontalScrollProps {
    children: ReactNode;
    className?: string;
    wrapperClassName?: string;
    scrub?: boolean | number;
    start?: string;
    end?: string;
    pin?: boolean;
    snap?: boolean | number | string;
    markers?: boolean;
}

/**
 * Component that creates a horizontal scrolling section
 */
export const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
    children,
    className = "",
    wrapperClassName = "flex flex-nowrap",
    scrub = 1,
    start = "top top",
    end,
    pin = true,
    snap = false,
    markers = false,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || !wrapperRef.current) return;

        const sections = gsap.utils.toArray<HTMLElement>(
            containerRef.current.querySelectorAll(".section")
        );

        if (sections.length === 0) {
            console.warn("No sections with class 'section' found in HorizontalScroll");
            return;
        }

        // Calculate the total width (in percentage) to scroll
        const totalWidth = (sections.length - 1) * 100;

        // Create the horizontal scroll animation
        const scrollTween = gsap.to(sections, {
            xPercent: -totalWidth,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                pin,
                scrub,
                start,
                end: end || `+=${containerRef.current.offsetWidth * (sections.length - 1)}`,
                snap: snap ? {
                    snapTo: 1 / (sections.length - 1),
                    duration: { min: 0.1, max: 0.3 },
                    delay: 0.1,
                    ease: "power1.inOut"
                } : undefined,
                markers,
                invalidateOnRefresh: true,
                // Prevent overlap with other sections
                pinSpacing: true,
            },
        });

        return () => {
            // Clean up ScrollTrigger when component unmounts
            scrollTween.scrollTrigger?.kill();
            scrollTween.kill();
        };
    }, [scrub, start, end, pin, snap, markers]);

    return (
        <div ref={containerRef} className={`overflow-hidden ${className}`}>
            <div ref={wrapperRef} className={wrapperClassName}>
                {children}
            </div>
        </div>
    );
};