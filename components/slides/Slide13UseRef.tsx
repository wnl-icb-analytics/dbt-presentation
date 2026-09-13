"use client";

import CodeSlideLayout, { type TreeFile } from "../CodeSlideLayout";
import ClickReveal from "../ClickReveal";
import { useSlideContext } from "../SlideNavigation";

const files: TreeFile[] = [
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
        name: "sources",
        path: "models/sources",
        type: "folder",
        children: [
          {
            name: "_sources.yml",
            path: "models/sources/_sources.yml",
            type: "file",
            lang: "yaml",
          },
        ],
      },
      {
        name: "staging",
        path: "models/staging",
        type: "folder",
        children: [
          {
            name: "stg_olids_observation.sql",
            path: "models/staging/stg_olids_observation.sql",
            type: "file",
            lang: "sql",
          },
        ],
      },
      {
        name: "int_blood_pressure_latest.sql",
        path: "models/int_blood_pressure_latest.sql",
        type: "file",
        lang: "sql",
      },
    ],
  },
];

const codeStep0 = `{{ config(materialized='table') }}

SELECT
    person_id,
    clinical_effective_date,
    systolic_value,
    diastolic_value,
    CASE WHEN systolic_value >= 140 OR diastolic_value >= 90
         THEN TRUE ELSE FALSE END AS is_hypertensive
FROM {{ source('olids', 'observation') }}
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
FROM {{ ref('stg_olids_observation') }}
WHERE concept_code IN ('271649006', '271650006')
QUALIFY ROW_NUMBER() OVER (
    PARTITION BY person_id ORDER BY clinical_effective_date DESC) = 1`;

export default function Slide15UseRef() {
  const { currentStep } = useSlideContext();
  const isStep1 = currentStep >= 1;

  return (
    <div className="slide" style={{ padding: "2rem 3rem", height: "100vh", minHeight: "auto", overflow: "hidden" }}>
      <h2 style={{ marginBottom: "0.25rem" }}>Step 4: Use ref() for dependencies</h2>
      <p style={{ color: "#64748b", fontSize: "1.05rem", marginBottom: "0" }}>
        Declare dependencies. dbt builds models in the right order automatically.
      </p>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", paddingTop: "1.5rem" }}>
      <CodeSlideLayout
        files={files}
        activeFile="models/int_blood_pressure_latest.sql"
        code={isStep1 ? codeStep1 : codeStep0}
        lang="sql"
        highlightLines={isStep1 ? [10] : []}
        projectName="dbt-ncl-analytics"
      />
      <ClickReveal step={1}>
        <p style={{ marginTop: "1rem", fontSize: "1.15rem", color: "#94a3b8" }}>
          <code style={{ color: "#22c55e" }}>{`ref('stg_olids_observation')`}</code> refers to the model file <code style={{ color: "#3b82f6" }}>stg_olids_observation.sql</code> — dbt resolves it to the correct schema/table at runtime.
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "1rem", color: "#64748b" }}>
          Model names must be unique across the project — dbt uses the filename (without <code style={{ color: "#64748b" }}>.sql</code>) as the identifier.
        </p>
      </ClickReveal>
      </div>
    </div>
  );
}
