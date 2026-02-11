"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Make sure to register the ScrollTrigger plugin
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export interface AnimationOptions {
    trigger?: string | Element | null;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    markers?: boolean;
    toggleActions?: string;
    once?: boolean;
    fromVars?: gsap.TweenVars;
    toVars?: gsap.TweenVars;
    duration?: number;
    delay?: number;
    stagger?: number | object;
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
}

// Define a type for the ScrollTrigger instance
interface GSAPScrollTrigger {
    id?: string;
}

/**
 * Custom hook to create GSAP animations with ScrollTrigger
 * @param selector - CSS selector, ref.current, or element to animate
 * @param options - Animation options
 */
export const useGSAPAnimation = (
    selector: string | Element | React.RefObject<Element>,
    options: AnimationOptions = {}
) => {
    const animationRef = useRef<gsap.core.Timeline | gsap.core.Tween | null>(null);
    const callbacksRef = useRef({
        onEnter: options.onEnter,
        onLeave: options.onLeave,
        onEnterBack: options.onEnterBack,
        onLeaveBack: options.onLeaveBack,
    });

    // Update callbacks ref when options change
    useEffect(() => {
        callbacksRef.current = {
            onEnter: options.onEnter,
            onLeave: options.onLeave,
            onEnterBack: options.onEnterBack,
            onLeaveBack: options.onLeaveBack,
        };
    }, [options.onEnter, options.onLeave, options.onEnterBack, options.onLeaveBack]);

    useEffect(() => {
        // If selector is a ref, use ref.current
        const element = selector && typeof selector === 'object' && 'current' in selector
            ? selector.current
            : selector;

        if (!element) return;

        const {
            trigger = element,
            start = "top 75%",
            end = "bottom 75%",
            scrub = false,
            pin = false,
            markers = false,
            toggleActions = "play none none none",
            once = false,
            fromVars = { y: 50, opacity: 0 },
            toVars = { y: 0, opacity: 1 },
            duration = 0.7,
            delay = 0,
            stagger = 0,
        } = options;

        // Create the animation
        animationRef.current = gsap.fromTo(
            element,
            fromVars,
            {
                ...toVars,
                duration,
                delay,
                stagger,
                scrollTrigger: {
                    trigger,
                    start,
                    end,
                    scrub,
                    pin,
                    markers,
                    toggleActions,
                    once,
                    onEnter: () => callbacksRef.current.onEnter?.(),
                    onLeave: () => callbacksRef.current.onLeave?.(),
                    onEnterBack: () => callbacksRef.current.onEnterBack?.(),
                    onLeaveBack: () => callbacksRef.current.onLeaveBack?.(),
                },
            }
        );

        // Clean up
        return () => {
            if (animationRef.current) {
                animationRef.current.kill();

                // Also kill any associated ScrollTriggers
                const st = ScrollTrigger.getById((animationRef.current.scrollTrigger as GSAPScrollTrigger)?.id || "");
                if (st) st.kill();
            }
        };
    }, [selector, options]);

    // Return methods to control the animation
    return {
        // Play the animation
        play: () => animationRef.current?.play(),
        // Pause the animation
        pause: () => animationRef.current?.pause(),
        // Restart the animation
        restart: () => animationRef.current?.restart(),
        // Kill the animation
        kill: () => {
            if (animationRef.current) {
                animationRef.current.kill();
                // Also kill any associated ScrollTriggers
                const st = ScrollTrigger.getById((animationRef.current.scrollTrigger as GSAPScrollTrigger)?.id || "");
                if (st) st.kill();
            }
        },
        // Get the animation instance
        animation: animationRef.current,
    };
};