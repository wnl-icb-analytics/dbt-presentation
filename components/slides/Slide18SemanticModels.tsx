"use client";

import { motion } from "framer-motion";
import CodeSlideLayout, { TreeFile } from "../CodeSlideLayout";

const files: TreeFile[] = [
  {
    name: "models",
    type: "folder",
    path: "models",
    children: [
      {
        name: "semantic",
        type: "folder",
        path: "models/semantic",
        children: [
          {
            name: "sem_patient_encounters.sql",
            type: "file",
            path: "models/semantic/sem_patient_encounters.sql",
            lang: "sql",
          },
        ],
      },
    ],
  },
];

const code = `{{ config(materialized='semantic_view') }}

TABLES (
    {{ ref('dim_patient') }} AS patients,
    {{ ref('fct_encounters') }} AS encounters
)
RELATIONSHIPS (
    encounters (patient_id) REFERENCES patients (patient_id)
)
DIMENSIONS (
    patients.patient_id,
    patients.age_band,
    encounters.encounter_type
)
FACTS (
    encounters.length_of_stay
)
METRICS (
    avg_los AS AVG(encounters.length_of_stay),
    encounter_count AS COUNT(encounters.encounter_id)
)`;

export default function Slide20SemanticModels() {
  return (
    <div className="slide" style={{ padding: "2rem 3rem", height: "100vh", minHeight: "auto", overflow: "hidden" }}>
      <h2 style={{ marginBottom: "0.25rem" }}>Semantic models</h2>
      <p style={{ color: "#64748b", fontSize: "1.05rem", marginBottom: "0" }}>
        Snowflake semantic views via <code style={{ color: "#3b82f6" }}>dbt_semantic_view</code>. Define relationships, dimensions, and metrics.
      </p>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "1.5rem" }}>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <CodeSlideLayout
          files={files}
          activeFile="models/semantic/sem_patient_encounters.sql"
          code={code}
          lang="sql"
          projectName="dbt-analytics"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: "1rem",
          padding: "0.75rem 1rem",
          background: "rgba(59, 130, 246, 0.1)",
          borderRadius: "0.5rem",
          borderLeft: "3px solid #3b82f6",
        }}
      >
        <span style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Query with </span>
        <code style={{ color: "#3b82f6", fontSize: "1.1rem" }}>{`SELECT * FROM semantic_view(ref('...'))`}</code>
        <span style={{ color: "#94a3b8", fontSize: "1.1rem" }}> or use Cortex AI for natural language</span>
      </motion.div>
      </div>
    </div>
  );
}
