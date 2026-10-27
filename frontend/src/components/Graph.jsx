import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";

import dagre from "@dagrejs/dagre";

import "@xyflow/react/dist/style.css";

import { Handle, Position } from "@xyflow/react";

import FileNode from "./FileNode";

import ClassNode from "./ClassNode";
import FunctionNode from "./FunctionNode";

const NODE_WIDTH = 210;
const NODE_HEIGHT = 100;

function getLayoutedElements(nodes, edges) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));

  graph.setGraph({
    rankdir: "LR",
    nodesep: 50,
    ranksep: 140,
  });

  nodes.forEach((node) => {
    graph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  const layoutedNodes = nodes.map((node) => {
    const position = graph.node(node.id);

    return {
      ...node,
      position: {
        x: position.x - NODE_WIDTH / 2,
        y: position.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}

function Graph({ nodes, edges, onNodeClick }) {
  const layout = getLayoutedElements(nodes, edges);

  const nodeTypes = {
    file: FileNode,
    class: ClassNode,
    function: FunctionNode,
  };

  return (
    <div className="graph-container">
      <div className="graph-header">
        <div>
          <span className="graph-title">
            Architecture
          </span>

          <span className="graph-subtitle">
            Dependency graph
          </span>
        </div>

        <div className="graph-legend">
          <span>
            <i className="legend-file"></i>
            File
          </span>

          <span>
            <i className="legend-dependency"></i>
            Dependency
          </span>
        </div>
      </div>

      <ReactFlow
        nodes={layout.nodes}
        edges={layout.edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
      >
        <Background
          gap={24}
          size={1}
        />

        <Controls />

        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default Graph;