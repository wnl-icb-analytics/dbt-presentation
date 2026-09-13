"use client";

import CodeSlideLayout, { type TreeFile } from "../CodeSlideLayout";
import ClickReveal from "../ClickReveal";
import { useSlideContext } from "../SlideNavigation";

const filesStep0: TreeFile[] = [
  {
    name: "blood_pressure_latest.sql",
    path: "blood_pressure_latest.sql",
    type: "file",
    lang: "sql",
  },
];

const filesStep1: TreeFile[] = [
  {
    name: "dbt_project.yml",
    path: "dbt_project.yml",
    type: "file",
    lang: "yaml",
  },
  {
    name: "profiles.yml",
    path: "profiles.yml",
    type: "file",
    lang: "yaml",
  },
  {
    name: "models",
    path: "models",
    type: "folder",
    children: [
      {
        name: "int_blood_pressure_latest.sql",
        path: "models/int_blood_pressure_latest.sql",
        type: "file",
        lang: "sql",
      },
    ],
  },
];

const codeStep0 = `CREATE TABLE analytics.blood_pressure_latest AS
SELECT
    person_id,
    clinical_effective_date,
    systolic_value,
    diastolic_value,
    CASE WHEN systolic_value >= 140 OR diastolic_value >= 90
         THEN TRUE ELSE FALSE END AS is_hypertensive
FROM DATA_LAKE.OLIDS.observation
WHERE concept_code IN ('271649006', '271650006')
QUALIFY ROW_NUMBER() OVER (
    PARTITION BY person_id ORDER BY clinical_effective_date DESC) = 1`;

const codeStep1 = `{{ config(materialized='table') }}

SELECT
    person_id,
    clinical_effective_date,
    systolic_value,
    diastolic_value,
    CASE WHEN systolic_value >= 140 OR diastolic_value >= 90
         THEN TRUE ELSE FALSE END AS is_hypertensive
FROM DATA_LAKE.OLIDS.observation
WHERE concept_code IN ('271649006', '271650006')
QUALIFY ROW_NUMBER() OVER (
    PARTITION BY person_id ORDER BY clinical_effective_date DESC) = 1`;

export default function Slide12DbtModel() {
  const { currentStep } = useSlideContext();
  const isStep1 = currentStep >= 1;

  return (
    <div className="slide" style={{ padding: "2rem 3rem", height: "100vh", minHeight: "auto", overflow: "hidden" }}>
      <h2 style={{ marginBottom: "0.25rem" }}>Step 1: Put your SQL in models/</h2>
      <p style={{ color: "#64748b", fontSize: "1.05rem", marginBottom: "0" }}>
        You write SELECT, dbt handles CREATE/REPLACE.
      </p>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <CodeSlideLayout
        files={isStep1 ? filesStep1 : filesStep0}
        activeFile={isStep1 ? "models/int_blood_pressure_latest.sql" : "blood_pressure_latest.sql"}
        code={isStep1 ? codeStep1 : codeStep0}
        lang="sql"
        projectName={isStep1 ? "dbt-ncl-analytics" : "my project"}
        highlightLines={isStep1 ? [1] : []}
      />
      <ClickReveal step={1}>
        <div style={{
          marginTop: "1rem",
          display: "flex",
          gap: "1rem",
        }}>
          <div style={{
            flex: 1,
            padding: "0.75rem 1rem",
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            borderRadius: "0.5rem",
            fontSize: "1.1rem",
          }}>
            <span style={{ color: "#22c55e", fontWeight: 500 }}>dbt run</span>{" "}
            <span style={{ color: "#94a3b8" }}>
              → creates table <code style={{ color: "#22c55e" }}>int_blood_pressure_latest</code> in your configured database/schema.
            </span>
          </div>
          <div style={{
            flex: 1,
            padding: "0.75rem 1rem",
            background: "rgba(249, 115, 22, 0.1)",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            borderRadius: "0.5rem",
            fontSize: "1.1rem",
          }}>
            <span style={{ color: "#f97316" }}>⚠</span>{" "}
            <span style={{ color: "#94a3b8" }}>
              We&apos;re still hardcoding source tables. Let&apos;s fix that next.
            </span>
          </div>
        </div>
      </ClickReveal>
      </div>
    </div>
  );
}
