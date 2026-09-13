"use client";

import { motion } from "framer-motion";

export default function Slide02AnalyticsIsSoftware() {
  return (
    <div className="slide slide-center" style={{ position: "relative", overflow: "hidden" }}>
      {/* Subtle gradient background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at 50% 40%, rgba(249, 115, 22, 0.08) 0%, transparent 60%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: "900px" }}>
        {/* The big statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 style={{
            fontSize: "5.5rem",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: "1.8rem",
            lineHeight: 1.1,
          }}>
            <span style={{ color: "#f1f5f9" }}>Analytics</span>
            <br />
            <span style={{ color: "#f97316" }}>is software.</span>
          </h1>
        </motion.div>

        {/* The implication */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          style={{
            fontSize: "1.8rem",
            color: "#94a3b8",
            marginBottom: "3.5rem",
            lineHeight: 1.5,
          }}
        >
          So why don&apos;t we treat it that way?
        </motion.p>

        {/* The practices that were missing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {[
            "Version control",
            "Code review",
            "Testing",
            "Documentation",
            "Environments",
          ].map((practice, i) => (
            <motion.div
              key={practice}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              style={{
                padding: "0.75rem 1.5rem",
                background: "rgba(249, 115, 22, 0.1)",
                border: "1px solid rgba(249, 115, 22, 0.3)",
                borderRadius: "2rem",
                color: "#fb923c",
                fontSize: "1.2rem",
                fontWeight: 500,
              }}
            >
              {practice}
            </motion.div>
          ))}
        </motion.div>

        {/* Fishtown attribution */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
          style={{
            marginTop: "3.5rem",
            fontSize: "1.1rem",
            color: "#64748b",
          }}
        >
          — The insight behind dbt, Fishtown Analytics, 2016
        </motion.p>
      </div>
    </div>
  );
}
