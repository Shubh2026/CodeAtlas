import { Handle, Position } from "@xyflow/react";

function ClassNode({ data }) {
  return (
    <div className="class-node">
      <Handle
        type="target"
        position={Position.Left}
      />

      <div className="class-node-header">
        <div className="class-icon">C</div>

        <div className="class-name">
          {data.label}
        </div>
      </div>

      <div className="class-node-type">
        Class
      </div>

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default ClassNode;