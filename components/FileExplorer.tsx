"use client";

import { useState, useEffect, useCallback } from "react";
import { ShikiMagicMove } from "shiki-magic-move/react";
import type { HighlighterCore } from "shiki";
import { createHighlighter } from "shiki";
import "shiki-magic-move/dist/style.css";

export interface FileNode {
  name: string;
  type: "file" | "folder";
  path: string;
  content?: string;
  lang?: string;
  children?: FileNode[];
}

interface FileExplorerProps {
  files: FileNode[];
  defaultFile?: string;
  title?: string;
}

function FolderIcon() {
  return (
    <svg className="file-tree-icon" viewBox="0 0 16 16" fill="currentColor">
      <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75Z" />
    </svg>
  );
}

function FileIcon({ lang }: { lang?: string }) {
  const color =
    lang === "sql"
      ? "#e38c00"
      : lang === "yaml"
        ? "#cb171e"
        : lang === "typescript"
          ? "#3178c6"
          : "#6e7681";

  return (
    <svg className="file-tree-icon" viewBox="0 0 16 16" fill={color}>
      <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5Zm6.75.062V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z" />
    </svg>
  );
}

function FileTreeItem({
  node,
  depth,
  selectedPath,
  onSelect,
}: {
  node: FileNode;
  depth: number;
  selectedPath: string | null;
  onSelect: (node: FileNode) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const isActive = selectedPath === node.path;
  const indent = depth * 16;

  if (node.type === "folder") {
    return (
      <>
        <div
          className={`file-tree-item folder ${isActive ? "active" : ""}`}
          style={{ paddingLeft: `${indent + 8}px` }}
          onClick={() => setExpanded(!expanded)}
        >
          <FolderIcon />
          <span>{node.name}</span>
        </div>
        {expanded &&
          node.children?.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              onSelect={onSelect}
            />
          ))}
      </>
    );
  }

  return (
    <div
      className={`file-tree-item file ${isActive ? "active" : ""}`}
      style={{ paddingLeft: `${indent + 8}px` }}
      onClick={() => onSelect(node)}
    >
      <FileIcon lang={node.lang} />
      <span>{node.name}</span>
    </div>
  );
}

function findFile(files: FileNode[], path: string): FileNode | null {
  for (const file of files) {
    if (file.path === path) return file;
    if (file.children) {
      const found = findFile(file.children, path);
      if (found) return found;
    }
  }
  return null;
}

export default function FileExplorer({
  files,
  defaultFile,
  title = "Project",
}: FileExplorerProps) {
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(() =>
    defaultFile ? findFile(files, defaultFile) : null
  );
  const [trackedDefault, setTrackedDefault] = useState(defaultFile);
  const [highlighter, setHighlighter] = useState<HighlighterCore | null>(null);

  if (defaultFile !== trackedDefault) {
    setTrackedDefault(defaultFile);
    const file = defaultFile ? findFile(files, defaultFile) : null;
    if (file) setSelectedFile(file);
  }

  useEffect(() => {
    createHighlighter({
      themes: ["github-dark"],
      langs: ["sql", "yaml", "bash"],
    }).then(setHighlighter);
  }, []);

  const handleSelect = useCallback((node: FileNode) => {
    if (node.type === "file" && node.content) {
      setSelectedFile(node);
    }
  }, []);

  return (
    <div className="file-explorer">
      <div className="file-tree-panel">
        <div className="file-tree-header">{title}</div>
        <div className="file-tree">
          {files.map((node) => (
            <FileTreeItem
              key={node.path}
              node={node}
              depth={0}
              selectedPath={selectedFile?.path ?? null}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      <div className="code-viewer-panel">
        {selectedFile && selectedFile.content ? (
          <div className="code-wrapper">
            <div className="code-filename">{selectedFile.path}</div>
            <div className="code-block-inner">
              {highlighter ? (
                <ShikiMagicMove
                  lang={selectedFile.lang || "sql"}
                  theme="github-dark"
                  highlighter={highlighter}
                  code={selectedFile.content.trim()}
                  options={{
                    duration: 400,
                    stagger: 2,
                    lineNumbers: false,
                  }}
                />
              ) : (
                <pre>
                  <code>{selectedFile.content}</code>
                </pre>
              )}
            </div>
          </div>
        ) : (
          <div className="code-viewer-empty">Select a file to view</div>
        )}
      </div>
    </div>
  );
}
