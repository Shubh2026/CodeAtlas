import {
  Handle,
  Position,
} from "@xyflow/react";

function FileNode({ data }) {
  return (
    <div className="file-node">
      <Handle
        type="target"
        position={Position.Left}
      />

      <div className="file-node-header">
        <div className="file-icon">◇</div>

        <div className="file-name">
          {data.label}
        </div>
      </div>

      <div className="file-node-type">
        Python module
      </div>

      <div className="file-node-meta">
        {data.functions ?? 0} functions
        <span>•</span>
        {data.classes ?? 0} classes
      </div>

      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default FileNode;