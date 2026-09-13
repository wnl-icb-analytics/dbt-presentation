"use client";

import { motion } from "framer-motion";

const problems = [
  "Analysts working in silos",
  "Same metric, different answers",
  "Logic scattered across tools",
  "Fragile, unpredictable code",
  "No version control",
  "No testing",
  "No documentation",
];

export default function Slide03WhyDbtExists() {
  return (
    <div className="slide" style={{ padding: "2rem 3rem", height: "100vh", minHeight: "auto", overflow: "hidden" }}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "0.25rem" }}
      >
        Why dbt was created
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ color: "#64748b", fontSize: "1.05rem", marginBottom: "0" }}
      >
        Fishtown Analytics, 2016 — &ldquo;Analytics teams have a workflow problem.&rdquo;
      </motion.p>

      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "3.5rem",
        padding: "2rem 0",
      }}>

        {/* The Problem */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            flex: 1,
            maxWidth: "650px",
            height: "560px",
          }}
        >
          <div style={{
            padding: "2.5rem 3rem",
            background: "rgba(30, 30, 46, 0.5)",
            border: "2px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "1rem",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}>
            <h3 style={{
              color: "#ef4444",
              fontSize: "1.8rem",
              fontWeight: 600,
              margin: "0 0 2rem 0",
            }}>
              The Problem
            </h3>

            <div style={{
              display: "grid",
              gap: "1.1rem",
            }}>
              {problems.map((problem, i) => (
                <motion.div
                  key={problem}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  style={{
                    color: "#cbd5e1",
                    fontSize: "1.3rem",
                    paddingLeft: "1.8rem",
                    position: "relative",
                  }}
                >
                  <span style={{
                    position: "absolute",
                    left: 0,
                    color: "#ef4444",
                    fontSize: "1.4rem",
                  }}>×</span>
                  {problem}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: "auto",
                color: "#ef4444",
                fontSize: "1.2rem",
                fontWeight: 500,
                opacity: 0.8,
              }}
            >
              → Lower velocity, less trust in data, decisions delayed
            </motion.div>
          </div>
        </motion.div>

        {/* The Solution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            flex: 1,
            maxWidth: "650px",
            height: "560px",
          }}
        >
          <div style={{
            padding: "2.5rem 3rem",
            background: "rgba(30, 30, 46, 0.5)",
            border: "2px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "1rem",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}>
            <h3 style={{
              color: "#22c55e",
              fontSize: "1.8rem",
              fontWeight: 600,
              margin: "0 0 2rem 0",
            }}>
              💡 The Insight
            </h3>

            <p style={{
              color: "#e2e8f0",
              fontSize: "1.7rem",
              fontWeight: 600,
              margin: "0 0 1.8rem 0",
              lineHeight: 1.5,
            }}>
              Software engineering already solved these problems.
            </p>

            <p style={{
              color: "#94a3b8",
              fontSize: "1.35rem",
              margin: "0 0 1.5rem 0",
              lineHeight: 1.6,
            }}>
              Source control, testing, documentation, modularity, collaboration — these weren&apos;t
              unique to analytics. They were software engineering fundamentals.
            </p>

            <p style={{
              color: "#22c55e",
              fontSize: "1.5rem",
              fontWeight: 600,
              margin: 0,
              fontStyle: "italic",
            }}>
              &ldquo;Analytics is software.&rdquo;
            </p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
              style={{
                marginTop: "auto",
                color: "#22c55e",
                fontSize: "1.2rem",
                fontWeight: 500,
                opacity: 0.8,
              }}
            >
              → Apply the same practices to analytics
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
