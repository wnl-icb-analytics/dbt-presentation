"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import DbtDAGExecution, { DbtDAGExecutionHandle } from "../DbtDAGExecution";

type Command = "run" | "build" | "test";

const commandDescriptions: Record<Command, string> = {
  run: "Executes SQL to build models in your warehouse",
  build: "Runs models + tests together, stops downstream on test failure",
  test: "Runs data quality tests without building models",
};

export default function Slide18DbtExecution() {
  const [command, setCommand] = useState<Command>("run");
  const [executedCommand, setExecutedCommand] = useState<Command | null>(null);
  const dagRef = useRef<DbtDAGExecutionHandle>(null);
  const hasRun = executedCommand === command;

  const handleExecute = () => {
    dagRef.current?.execute();
    setExecutedCommand(command);
  };

  return (
    <div className="slide" style={{ padding: "1.5rem 2.5rem", height: "100vh", minHeight: "auto", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
        <h2 style={{ margin: 0 }}>How dbt runs</h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {(["run", "build", "test"] as Command[]).map((cmd) => (
            <button
              key={cmd}
              onClick={() => setCommand(cmd)}
              style={{
                padding: "0.4rem 0.75rem",
                background: command === cmd ? "rgba(249, 115, 22, 0.2)" : "rgba(0,0,0,0.2)",
                border: command === cmd ? "1px solid #f97316" : "1px solid #475569",
                borderRadius: "0.375rem",
                color: command === cmd ? "#f97316" : "#94a3b8",
                cursor: "pointer",
                fontSize: "1.05rem",
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              dbt {cmd}
            </button>
          ))}
        </div>
        <button
          onClick={handleExecute}
          style={{
            background: hasRun ? "#334155" : "#f97316",
            border: hasRun ? "1px solid #475569" : "1px solid #f97316",
            borderRadius: "0.375rem",
            padding: "0.4rem 0.75rem",
            color: "white",
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          {hasRun ? "Replay" : "Execute"}
        </button>
        <motion.div
          key={command}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            padding: "0.4rem 0.6rem",
            background: "rgba(59, 130, 246, 0.1)",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            borderRadius: "0.375rem",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
          }}
        >
          <span style={{ color: "#3b82f6", fontWeight: 600 }}>ℹ</span>
          <span style={{ color: "#94a3b8" }}>{commandDescriptions[command]}</span>
        </motion.div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <DbtDAGExecution ref={dagRef} command={command} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1.25rem",
            marginTop: "1rem",
          }}
        >
        <div style={{
          padding: "0.4rem 0.6rem",
          background: "rgba(34, 197, 94, 0.1)",
          border: "1px solid rgba(34, 197, 94, 0.3)",
          borderRadius: "0.375rem",
          fontSize: "0.9rem",
        }}>
          <span style={{ color: "#22c55e", fontWeight: 500 }}>Parallel</span>
          <span style={{ color: "#94a3b8" }}> — Models that don&apos;t depend on each other run concurrently</span>
        </div>
        <div style={{
          padding: "0.4rem 0.6rem",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          borderRadius: "0.375rem",
          fontSize: "0.9rem",
        }}>
          <span style={{ color: "#ef4444", fontWeight: 500 }}>Isolated</span>
          <span style={{ color: "#94a3b8" }}> — Failures don&apos;t propagate to unrelated branches</span>
        </div>
        <div style={{
          padding: "0.4rem 0.6rem",
          background: "rgba(100, 116, 139, 0.1)",
          border: "1px solid rgba(100, 116, 139, 0.3)",
          borderRadius: "0.375rem",
          fontSize: "0.9rem",
        }}>
          <span style={{ color: "#94a3b8", fontWeight: 500 }}>Smart skip</span>
          <span style={{ color: "#64748b" }}> — Only downstream dependents are skipped</span>
        </div>
        </motion.div>
      </div>
    </div>
  );
}
