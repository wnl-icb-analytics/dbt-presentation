"use client";

import { useCallback, useEffect, useState, useRef, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { getNextSlideId, getPrevSlideId, totalSlides } from "@/lib/slides";

interface SlideNavigationProps {
  slideId: number;
  totalSteps: number;
  children: React.ReactNode;
}

// Context for child components to access current step
import { createContext, useContext } from "react";

interface SlideContextValue {
  currentStep: number;
  totalSteps: number;
  isLastStep: boolean;
}

export const SlideContext = createContext<SlideContextValue>({
  currentStep: 0,
  totalSteps: 0,
  isLastStep: false,
});

export function useSlideContext() {
  return useContext(SlideContext);
}

function subscribeMacPlatform() {
  return () => {};
}

function getMacPlatformSnapshot() {
  return navigator.platform.toUpperCase().includes("MAC");
}

function getMacPlatformServerSnapshot() {
  return false;
}

export default function SlideNavigation({
  slideId,
  totalSteps,
  children,
}: SlideNavigationProps) {
  const router = useRouter();
  const [stepState, setStepState] = useState({ slideId, step: 0 });
  const isMac = useSyncExternalStore(
    subscribeMacPlatform,
    getMacPlatformSnapshot,
    getMacPlatformServerSnapshot
  );

  if (stepState.slideId !== slideId) {
    setStepState({ slideId, step: 0 });
  }

  const currentStep = stepState.slideId === slideId ? stepState.step : 0;

  const goNext = useCallback(() => {
    if (currentStep < totalSteps) {
      setStepState((s) => ({ ...s, step: s.step + 1 }));
    } else {
      const nextId = getNextSlideId(slideId);
      if (nextId) {
        router.push(`/slides/${nextId}`);
      }
    }
  }, [currentStep, totalSteps, slideId, router]);

  const goPrev = useCallback(() => {
    if (currentStep > 0) {
      setStepState((s) => ({ ...s, step: s.step - 1 }));
    } else {
      const prevId = getPrevSlideId(slideId);
      if (prevId) {
        router.push(`/slides/${prevId}`);
      }
    }
  }, [currentStep, slideId, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip Cmd+K / Ctrl+K (handled by SlideNavigator)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        return;
      }

      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        goPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // Prefetch adjacent slides for faster navigation
  useEffect(() => {
    const nextId = getNextSlideId(slideId);
    const prevId = getPrevSlideId(slideId);
    if (nextId) router.prefetch(`/slides/${nextId}`);
    if (prevId) router.prefetch(`/slides/${prevId}`);
  }, [slideId, router]);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;

      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const deltaY = e.changedTouches[0].clientY - touchStartY.current;
      const minSwipeDistance = 50;

      // Only trigger if horizontal swipe is greater than vertical (not scrolling)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX < 0) {
          goNext();
        } else {
          goPrev();
        }
      }

      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [goNext, goPrev]);

  const isLastStep = currentStep >= totalSteps;
  const hasNextSlide = getNextSlideId(slideId) !== null;

  return (
    <SlideContext.Provider value={{ currentStep, totalSteps, isLastStep }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={slideId}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <div className="slide-counter">
        {slideId} / {totalSlides}
      </div>

      {/* Clickable next button - positioned above nav hint */}
      {isLastStep && hasNextSlide && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={goNext}
          className="next-slide-hint"
          style={{
            position: "fixed",
            right: "1.5rem",
            bottom: "3.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#64748b",
            fontSize: "0.85rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
          }}
        >
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: "1.5rem" }}
          >
            →
          </motion.span>
        </motion.button>
      )}

      <div className="nav-hint">
        <kbd>←</kbd> <kbd>→</kbd> to navigate
        <span style={{ margin: "0 0.75rem", opacity: 0.4 }}>|</span>
        <kbd>{isMac ? "⌘" : "Ctrl"}</kbd><kbd>K</kbd> jump to slide
      </div>
    </SlideContext.Provider>
  );
}
