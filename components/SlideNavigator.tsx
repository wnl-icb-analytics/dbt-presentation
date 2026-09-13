"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { slides } from "@/lib/slides";
import Image from "next/image";

// Cache bust thumbnails on each build
const CACHE_BUST = process.env.NEXT_PUBLIC_BUILD_TIME || Date.now().toString();

export default function SlideNavigator() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [prevSearch, setPrevSearch] = useState(search);

  if (search !== prevSearch) {
    setPrevSearch(search);
    setSelectedIndex(0);
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredSlides = useMemo(() => {
    if (!search.trim()) return slides;
    const term = search.toLowerCase();
    return slides.filter(
      (slide) =>
        slide.title.toLowerCase().includes(term) ||
        slide.id.toString().includes(term)
    );
  }, [search]);

  const navigateToSlide = useCallback((id: number) => {
    router.push(`/slides/${id}`);
    setIsOpen(false);
  }, [router]);

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open: Cmd+K (Mac) or Ctrl+K (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen((prev) => !prev);
        setSearch("");
        setSelectedIndex(0);
        return;
      }

      if (!isOpen) return;

      // Stop all key events from reaching SlideNavigation when modal is open
      e.stopPropagation();

      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filteredSlides.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filteredSlides[selectedIndex]) {
        e.preventDefault();
        navigateToSlide(filteredSlides[selectedIndex].id);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [isOpen, filteredSlides, selectedIndex, navigateToSlide]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const selectedEl = listRef.current.querySelector(
        `[data-index="${selectedIndex}"]`
      );
      if (selectedEl) {
        selectedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 1000,
            }}
          />

          {/* Modal container for centering */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{
                width: "min(550px, 90vw)",
                maxHeight: "70vh",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "0.75rem",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                display: "flex",
                flexDirection: "column",
                pointerEvents: "auto",
              }}
            >
            {/* Search input */}
            <div
              style={{
                padding: "1rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search slides..."
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                  color: "var(--foreground)",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>

            {/* Slide list */}
            <div
              ref={listRef}
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "0.5rem",
              }}
            >
              {filteredSlides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  data-index={index}
                  onClick={() => navigateToSlide(slide.id)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    cursor: "pointer",
                    borderRadius: "0.5rem",
                    padding: "0.5rem",
                    marginBottom: "0.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    background:
                      index === selectedIndex
                        ? "var(--accent-dim)"
                        : "transparent",
                    borderLeft:
                      index === selectedIndex
                        ? "3px solid var(--accent)"
                        : "3px solid transparent",
                    transition: "background 0.1s, border-color 0.1s",
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      position: "relative",
                      width: "120px",
                      height: "68px",
                      flexShrink: 0,
                      borderRadius: "0.375rem",
                      overflow: "hidden",
                      background: "rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <Image
                      src={`/thumbnails/slide-${slide.id}.png?v=${CACHE_BUST}`}
                      alt={slide.title}
                      fill
                      style={{
                        objectFit: "cover",
                        transform: "scale(1.5)",
                        transformOrigin: "center 35%",
                      }}
                      sizes="120px"
                      unoptimized
                    />
                  </div>

                  {/* Title and number */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: 500,
                        color:
                          index === selectedIndex
                            ? "var(--foreground)"
                            : "rgba(255, 255, 255, 0.85)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {slide.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--muted)",
                        marginTop: "0.25rem",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      Slide {slide.id}
                    </div>
                  </div>
                </motion.div>
              ))}

              {filteredSlides.length === 0 && (
                <div
                  style={{
                    gridColumn: "1 / -1",
                    padding: "3rem",
                    textAlign: "center",
                    color: "var(--muted)",
                  }}
                >
                  No slides found
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div
              style={{
                padding: "0.75rem 1rem",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "center",
                gap: "1.25rem",
                fontSize: "0.75rem",
                color: "var(--muted)",
              }}
            >
              <span>
                <kbd className="nav-kbd">⌘K</kbd> open
              </span>
              <span>
                <kbd className="nav-kbd">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="nav-kbd">Enter</kbd> select
              </span>
              <span>
                <kbd className="nav-kbd">Esc</kbd> close
              </span>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
