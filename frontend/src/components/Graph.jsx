import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

function Graph({ nodes, edges, onNodeClick }) {
  return (
    <div className="graph-container">
      <div className="graph-header">
        <div>
          <span className="graph-title">Architecture</span>
          <span className="graph-subtitle">
            Dependency graph
          </span>
        </div>

        <div className="graph-legend">
          <span>
            <i className="legend-file"></i> File
          </span>
          <span>
            <i className="legend-dependency"></i> Dependency
          </span>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
      >
        <Background gap={24} size={1} />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default Graph;