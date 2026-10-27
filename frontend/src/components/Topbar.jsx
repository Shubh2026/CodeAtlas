function Topbar({
  project,
  onUpload,
  uploading,
  onAIInsights,
  aiLoading,
}) {
  return (
    <header className="topbar">
      <div>
        <div className="breadcrumb">
          Workspace / <span>{project || "No project"}</span>
        </div>
      </div>

      <div className="topbar-actions">
        <button
          className="upload-button"
          onClick={onUpload}
          disabled={uploading}
        >
          {uploading ? "Analyzing..." : "＋ Upload ZIP"}
        </button>

        <button className="search-button">
          <span>⌕</span>
          Search code
          <kbd>Ctrl K</kbd>
        </button>

        <button
          className="ai-button"
          onClick={onAIInsights}
          disabled={aiLoading}
        >
          {aiLoading ? "✦ Analyzing..." : "✦ AI Insights"}
        </button>

        <button className="icon-button">⚙</button>
      </div>
    </header>
  );
}

export default Topbar;