function NodeDetails({ node, onClose }) {
  if (!node) {
    return (
      <div className="details-panel empty-details">
        <div className="details-placeholder">
          <div className="placeholder-icon">◇</div>
          <h3>Select a node</h3>
          <p>
            Click a file, class, or function to inspect it.
          </p>
        </div>
      </div>
    );
  }

  const type = node.type;
  const data = node.data || {};

  const typeLabel = {
    file: "FILE",
    class: "CLASS",
    function: "FUNCTION",
  };

  const typeName = {
    file: "Python module",
    class: "Python class",
    function: "Python function",
  };

  return (
    <div className="details-panel">
      <div className="details-header">
        <div>
          <div className="details-type">
            {typeLabel[type] || "NODE"}
          </div>

          <h3>{data.label}</h3>
        </div>

        <button onClick={onClose}>×</button>
      </div>

      <div className="details-content">

        <div className="detail-item">
          <label>PATH</label>
          <p>{data.path}</p>
        </div>

        <div className="detail-item">
          <label>TYPE</label>
          <p>{typeName[type] || "Code element"}</p>
        </div>

        {data.line && (
          <div className="detail-item">
            <label>LINE</label>
            <p>{data.line}</p>
          </div>
        )}

        {type === "file" && (
          <>
            <div className="detail-item">
              <label>STRUCTURE</label>
              <p>
                {data.classes ?? 0} classes ·{" "}
                {data.functions ?? 0} functions
              </p>
            </div>

            <div className="detail-item">
              <label>STATUS</label>
              <p className="healthy">● Analyzed</p>
            </div>
          </>
        )}

        {type === "class" && (
          <div className="detail-item">
            <label>ELEMENT</label>
            <p>Class definition</p>
          </div>
        )}

        {type === "function" && (
          <>
            <div className="detail-item">
              <label>ELEMENT</label>
              <p>Function / method</p>
            </div>

            {data.parent && (
              <div className="detail-item">
                <label>PARENT CLASS</label>
                <p>{data.parent.split(":").pop()}</p>
              </div>
            )}
          </>
        )}
      </div>

      <button className="explain-button">
        ✦ Explain with AI
      </button>
    </div>
  );
}

export default NodeDetails;