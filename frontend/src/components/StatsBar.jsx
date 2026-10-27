function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-dot blue"></span>
        <span>{stats.files}</span>
        <label>Files</label>
      </div>

      <div className="stat">
        <span className="stat-dot purple"></span>
        <span>{stats.classes}</span>
        <label>Classes</label>
      </div>

      <div className="stat">
        <span className="stat-dot green"></span>
        <span>{stats.functions}</span>
        <label>Functions</label>
      </div>

      <div className="stat">
        <span className="stat-dot orange"></span>
        <span>{stats.dependencies}</span>
        <label>Dependencies</label>
      </div>
    </div>
  );
}

export default StatsBar;