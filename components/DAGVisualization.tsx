"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  dependencies: string[];
}

interface DAGVisualizationProps {
  mode: "simple" | "complex";
  animate?: boolean;
}

// Simple: Loading data from external sources into the data lake
const simpleNodes: Node[] = [
  { id: "api", label: "Fingertips API", x: 100, y: 20, dependencies: [] },
  { id: "proc", label: "sp_load_fingertips", x: 100, y: 100, dependencies: ["api"] },
  { id: "table", label: "DATA_LAKE.fingertips", x: 100, y: 180, dependencies: ["proc"] },
];

// Generate a dense transformation layer DAG
function generateComplexNodes(): Node[] {
  const nodes: Node[] = [];
  const layers = [
    { prefix: "src", count: 6, y: 0 },
    { prefix: "stg", count: 6, y: 80 },
    { prefix: "int", count: 8, y: 160 },
    { prefix: "dim", count: 4, y: 240 },
    { prefix: "fct", count: 6, y: 320 },
    { prefix: "rpt", count: 4, y: 400 },
  ];

  const width = 700;

  const pseudoRandom = (seed: number) => {
    const x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };

  layers.forEach((layer, layerIdx) => {
    const spacing = width / (layer.count + 1);
    for (let i = 0; i < layer.count; i++) {
      const id = `${layer.prefix}${i}`;
      const deps: string[] = [];
      const seed = layerIdx * 100 + i;

      if (layerIdx > 0) {
        const prevLayer = layers[layerIdx - 1];
        const numDeps = 1 + Math.floor(pseudoRandom(seed) * 2);
        const startIdx = Math.floor(pseudoRandom(seed + 1) * prevLayer.count);
        for (let d = 0; d < numDeps && d < prevLayer.count; d++) {
          const depIdx = (startIdx + d) % prevLayer.count;
          deps.push(`${prevLayer.prefix}${depIdx}`);
        }
        if (layerIdx > 1 && pseudoRandom(seed + 2) > 0.65) {
          const skipLayer = layers[layerIdx - 2];
          const skipIdx = Math.floor(pseudoRandom(seed + 3) * skipLayer.count);
          deps.push(`${skipLayer.prefix}${skipIdx}`);
        }
      }

      nodes.push({
        id,
        label: id,
        x: spacing * (i + 1) - 38,
        y: layer.y,
        dependencies: deps,
      });
    }
  });

  return nodes;
}

const complexNodes = generateComplexNodes();

export default function DAGVisualization({ mode, animate = true }: DAGVisualizationProps) {
  const nodes = mode === "simple" ? simpleNodes : complexNodes;
  const animationKey = `${mode}-${animate}`;
  const [activeKey, setActiveKey] = useState(animationKey);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [runningNodes, setRunningNodes] = useState<Set<string>>(new Set());

  if (activeKey !== animationKey) {
    setActiveKey(animationKey);
    setCompletedNodes(new Set());
    setRunningNodes(new Set());
  }

  // Dimensions
  const nodeWidth = mode === "simple" ? 180 : 75;
  const nodeHeight = mode === "simple" ? 40 : 26;
  const fontSize = mode === "simple" ? 12 : 8;
  const width = mode === "simple" ? 380 : 750;
  const height = mode === "simple" ? 260 : 480;

  const edges = useMemo(() => {
    const result: { from: Node; to: Node }[] = [];
    nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        const dep = nodes.find(n => n.id === depId);
        if (dep) result.push({ from: dep, to: node });
      });
    });
    return result;
  }, [nodes]);

  // Animate nodes completing at different rates
  useEffect(() => {
    if (!animate) return;

    const nodeCount = nodes.length;
    const timeouts: NodeJS.Timeout[] = [];

    // Calculate execution order based on dependencies
    const executed = new Set<string>();
    const order: string[] = [];

    const canExecute = (node: Node) =>
      node.dependencies.every(dep => executed.has(dep));

    while (order.length < nodeCount) {
      for (const node of nodes) {
        if (!executed.has(node.id) && canExecute(node)) {
          order.push(node.id);
          executed.add(node.id);
        }
      }
    }

    // Animate with varying speeds
    let time = 300;
    order.forEach((nodeId) => {
      // Start running
      const startTime = time;
      timeouts.push(setTimeout(() => {
        setRunningNodes(prev => new Set([...prev, nodeId]));
      }, startTime));

      // Duration varies (simulates different job lengths)
      const duration = mode === "simple"
        ? 800 + Math.random() * 500
        : 300 + Math.random() * 400;

      // Complete
      timeouts.push(setTimeout(() => {
        setRunningNodes(prev => {
          const next = new Set(prev);
          next.delete(nodeId);
          return next;
        });
        setCompletedNodes(prev => new Set([...prev, nodeId]));
      }, startTime + duration));

      time += mode === "simple" ? duration * 0.9 : duration * 0.5;
    });

    return () => timeouts.forEach(t => clearTimeout(t));
  }, [animate, mode, nodes]);

  const getNodeStatus = (id: string) => {
    if (completedNodes.has(id)) return "complete";
    if (runningNodes.has(id)) return "running";
    return "pending";
  };

  const getEdgeStatus = (from: Node, to: Node) => {
    if (completedNodes.has(from.id) && (completedNodes.has(to.id) || runningNodes.has(to.id))) {
      return "active";
    }
    if (completedNodes.has(from.id)) return "ready";
    return "pending";
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: "visible" }}
    >
      {/* Draw edges */}
      {edges.map(({ from, to }, i) => {
        const status = getEdgeStatus(from, to);
        return (
          <motion.line
            key={`edge-${i}`}
            x1={from.x + nodeWidth / 2}
            y1={from.y + nodeHeight}
            x2={to.x + nodeWidth / 2}
            y2={to.y}
            stroke={status === "active" ? "#22c55e" : status === "ready" ? "#3b82f6" : "#334155"}
            strokeWidth={mode === "simple" ? 2.5 : 1.5}
            strokeOpacity={status === "pending" ? 0.3 : 0.8}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: i * 0.02 }}
          />
        );
      })}

      {/* Draw nodes */}
      {nodes.map((node, i) => {
        const status = getNodeStatus(node.id);
        const fill = status === "complete" ? "#22c55e"
          : status === "running" ? "#3b82f6"
          : "#334155";

        return (
          <motion.g
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.03 }}
          >
            <motion.rect
              x={node.x}
              y={node.y}
              width={nodeWidth}
              height={nodeHeight}
              rx={mode === "simple" ? 6 : 4}
              fill={fill}
              animate={{ fill }}
              transition={{ duration: 0.3 }}
            />
            {status === "running" && (
              <motion.rect
                x={node.x}
                y={node.y}
                width={nodeWidth}
                height={nodeHeight}
                rx={mode === "simple" ? 6 : 4}
                fill="none"
                stroke="#60a5fa"
                strokeWidth={2}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
            <text
              x={node.x + nodeWidth / 2}
              y={node.y + nodeHeight / 2 + fontSize / 3}
              textAnchor="middle"
              fill="white"
              fontSize={fontSize}
              fontFamily="var(--font-mono), monospace"
            >
              {node.label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
}
