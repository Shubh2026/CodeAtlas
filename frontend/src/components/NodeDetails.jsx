function NodeDetails({ node, onClose }) {
  if (!node) {
    return (
      <div className="details-panel empty-details">
        <div className="details-placeholder">
          <div className="placeholder-icon">◇</div>
          <h3>Select a node</h3>
          <p>
            Click a file in the architecture graph
            to inspect its structure.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="details-panel">
      <div className="details-header">
        <div>
          <div className="details-type">FILE</div>
          <h3>{node.label}</h3>
        </div>

        <button onClick={onClose}>×</button>
      </div>

      <div className="details-content">
        <div className="detail-item">
          <label>PATH</label>
          <p>{node.path}</p>
        </div>

        <div className="detail-item">
          <label>TYPE</label>
          <p>Python module</p>
        </div>

        <div className="detail-item">
          <label>STATUS</label>
          <p className="healthy">● Analyzed</p>
        </div>
      </div>

      <button className="explain-button">
        ✦ Explain with AI
      </button>
    </div>
  );
}

export default NodeDetails;