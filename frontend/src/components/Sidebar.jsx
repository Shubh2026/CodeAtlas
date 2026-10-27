function Sidebar({ project, stats }) {
  return (
    <aside className="sidebar">
      <div className="logo">
        <div className="logo-mark">◇</div>
        <span>CodeAtlas</span>
      </div>

      <div className="sidebar-section">
        <div className="section-label">PROJECT</div>

        <div className="project-name">
          <span className="folder-icon">▾</span>
          {project}
        </div>

        <div className="file-item">◈ main.py</div>
        <div className="file-item">◈ config.py</div>
        <div className="file-item">▸ models</div>
        <div className="file-item">▸ services</div>
        <div className="file-item">▸ utils</div>
      </div>

      <div className="sidebar-section">
        <div className="section-label">ANALYSIS</div>

        <div className="stat-row">
          <span>Files</span>
          <strong>{stats.files}</strong>
        </div>

        <div className="stat-row">
          <span>Classes</span>
          <strong>{stats.classes}</strong>
        </div>

        <div className="stat-row">
          <span>Functions</span>
          <strong>{stats.functions}</strong>
        </div>

        <div className="stat-row">
          <span>Dependencies</span>
          <strong>{stats.dependencies}</strong>
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="connection-status">
          <span className="status-dot"></span>
          Backend connected
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;