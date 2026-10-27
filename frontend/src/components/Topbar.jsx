function Topbar({ project }) {
  return (
    <header className="topbar">
      <div>
        <div className="breadcrumb">
          Workspace / <span>{project}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <button className="search-button">
          <span>⌕</span>
          Search code
          <kbd>Ctrl K</kbd>
        </button>

        <button className="ai-button">
          ✦ AI Insights
        </button>

        <button className="icon-button">
          ⚙
        </button>
      </div>
    </header>
  );
}

export default Topbar;