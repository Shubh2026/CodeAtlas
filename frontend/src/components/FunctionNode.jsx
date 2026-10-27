import { Handle, Position } from "@xyflow/react";

function FunctionNode({ data }) {
  return (
    <div className="function-node">
      <Handle
        type="target"
        position={Position.Left}
      />

      <div className="function-node-header">
        <div className="function-icon">ƒ</div>

        <div className="function-name">
          {data.label}
        </div>
      </div>

      <div className="function-node-type">
        Function
      </div>

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default FunctionNode;