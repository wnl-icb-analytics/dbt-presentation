"use client";

import { motion } from "framer-motion";

export default function Slide06WhereDbtFits() {
  return (
    <div className="slide" style={{ padding: "2rem 3rem", height: "100vh", minHeight: "auto", overflow: "hidden" }}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: "0.25rem" }}
      >
        Where dbt fits
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ color: "#64748b", fontSize: "1.05rem", marginBottom: "0" }}
      >
        The &ldquo;T&rdquo; in ELT — where data engineers, analytics engineers, and analysts collaborate.
      </motion.p>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "1.5rem" }}>
        
        {/* ELT Pipeline with roles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "stretch",
            gap: "0.5rem",
          }}
        >
          {/* E + L */}
          <div style={{
            background: "rgba(139, 92, 246, 0.1)",
            border: "1px solid rgba(139, 92, 246, 0.3)",
            borderRadius: "0.75rem",
            padding: "1.75rem 2rem",
            textAlign: "center",
            width: "260px",
          }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#a78bfa", marginBottom: "0.25rem" }}>
              E + L
            </div>
            <div style={{ fontSize: "1.05rem", color: "#94a3b8", marginBottom: "0.9rem" }}>
              Extract & Load
            </div>
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "0.6rem" }}>
              ADF, APIs, Fivetran
            </div>
            <div style={{
              fontSize: "0.85rem",
              color: "#a78bfa",
              background: "rgba(139, 92, 246, 0.15)",
              padding: "0.3rem 0.6rem",
              borderRadius: "1rem",
              display: "inline-block",
              fontWeight: 500,
            }}>
              Data Engineers
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", color: "#475569", fontSize: "1.5rem" }}>→</div>

          {/* T - Transform (highlighted, wider) */}
          <div style={{
            background: "linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(249, 115, 22, 0.04))",
            border: "2px solid #f97316",
            borderRadius: "0.75rem",
            padding: "1.75rem 2.5rem",
            textAlign: "center",
            width: "480px",
          }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#f97316", marginBottom: "0.25rem" }}>
              T
            </div>
            <div style={{ fontSize: "1.05rem", color: "#fb923c", marginBottom: "0.5rem" }}>
              Transform
            </div>
            <div style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#f97316",
              marginBottom: "0.75rem",
            }}>
              dbt
            </div>

            {/* Collaboration zone */}
            <div style={{
              display: "flex",
              justifyContent: "center",
              gap: "0.5rem",
            }}>
              <div style={{
                fontSize: "0.85rem",
                color: "#f97316",
                background: "rgba(249, 115, 22, 0.15)",
                padding: "0.3rem 0.6rem",
                borderRadius: "1rem",
                fontWeight: 500,
              }}>
                Analytics Engineers
              </div>
              <div style={{
                fontSize: "0.85rem",
                color: "#22c55e",
                background: "rgba(34, 197, 94, 0.15)",
                padding: "0.3rem 0.6rem",
                borderRadius: "1rem",
                fontWeight: 500,
              }}>
                Data Analysts
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", color: "#475569", fontSize: "1.5rem" }}>→</div>

          {/* Output */}
          <div style={{
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "0.75rem",
            padding: "1.75rem 2rem",
            textAlign: "center",
            width: "260px",
          }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#22c55e", marginBottom: "0.25rem" }}>
              📊
            </div>
            <div style={{ fontSize: "1.05rem", color: "#86efac", marginBottom: "0.75rem" }}>
              Analytics Ready
            </div>
            <div style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "0.6rem" }}>
              Dashboards, Reports, ML
            </div>
            <div style={{
              fontSize: "0.85rem",
              color: "#22c55e",
              background: "rgba(34, 197, 94, 0.15)",
              padding: "0.3rem 0.6rem",
              borderRadius: "1rem",
              display: "inline-block",
              fontWeight: 500,
            }}>
              Consumers
            </div>
          </div>
        </motion.div>

        {/* Role descriptions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
          <div style={{
            padding: "1.5rem 1.75rem",
            background: "rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.2)",
            borderRadius: "0.5rem",
            width: "360px",
          }}>
            <div style={{ color: "#a78bfa", fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.4rem" }}>
              🔧 Data Engineers
            </div>
            <div style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.5 }}>
              Build pipelines, ensure data lands reliably. Hand off clean raw tables.
            </div>
          </div>

          <div style={{
            padding: "1.5rem 1.75rem",
            background: "rgba(249, 115, 22, 0.08)",
            border: "1px solid rgba(249, 115, 22, 0.2)",
            borderRadius: "0.5rem",
            width: "360px",
          }}>
            <div style={{ color: "#f97316", fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.4rem" }}>
              🏗️ Analytics Engineers
            </div>
            <div style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.5 }}>
              Build foundational models, enforce standards. Create trusted, reusable datasets.
            </div>
          </div>

          <div style={{
            padding: "1.5rem 1.75rem",
            background: "rgba(34, 197, 94, 0.08)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            borderRadius: "0.5rem",
            width: "360px",
          }}>
            <div style={{ color: "#22c55e", fontWeight: 600, fontSize: "1.1rem", marginBottom: "0.4rem" }}>
              📈 Data Analysts
            </div>
            <div style={{ color: "#94a3b8", fontSize: "1rem", lineHeight: 1.5 }}>
              Build business-specific models, answer questions. Use the same tools and repo.
            </div>
          </div>
        </motion.div>

        {/* Key point */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            textAlign: "center",
            padding: "0.75rem 1.5rem",
            background: "rgba(249, 115, 22, 0.08)",
            border: "1px solid rgba(249, 115, 22, 0.2)",
            borderRadius: "0.5rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <span style={{ color: "#94a3b8", fontSize: "1.1rem" }}>
            Everyone works in the same repo, same patterns, same quality standards.
          </span>
        </motion.div>
      </div>
    </div>
  );
}
