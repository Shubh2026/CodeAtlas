import { useEffect, useRef, useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Graph from "./components/Graph";
import NodeDetails from "./components/NodeDetails";
import StatsBar from "./components/StatsBar";

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const [aiAnalysis, setAiAnalysis] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleAIInsights = async () => {
    setAiLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/projects/${projectName}/ai`
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "AI analysis failed");
      }

      setAiAnalysis(result.analysis);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const [stats, setStats] = useState({
    files: 0,
    classes: 0,
    functions: 0,
    dependencies: 0,
  });

  const [projectName, setProjectName] = useState(
    "codeatlas-sample-repo"
  );

  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      alert("Please upload a ZIP file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/projects/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.detail || "Upload failed"
        );
      }

      setProjectName(result.project);

    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    fetch(
      `http://127.0.0.1:8000/api/projects/${projectName}/analyze`
    )
      .then((response) => response.json())
      .then((data) => {
        const fileNodes = data.nodes
          .filter((node) => node.type === "file")
          .map((node) => {
            const children = data.nodes.filter(
              (n) =>
                (n.type === "function" || n.type === "class") &&
                n.path === node.path
            );

            const functions = children.filter(
              (n) => n.type === "function"
            ).length;

            const classes = children.filter(
              (n) => n.type === "class"
            ).length;

            return {
              id: node.id,
              type: "file",
              position: { x: 0, y: 0 },
              data: {
                label: node.label,
                path: node.path,
                functions,
                classes,
              },
            };
          });

        const classAndFunctionNodes = data.nodes
          .filter(
            (node) =>
              node.type === "class" ||
              node.type === "function"
          )
          .map((node) => ({
            id: node.id,
            type: node.type,
            position: { x: 0, y: 0 },
            data: {
              label: node.label,
              path: node.path,
              line: node.line,
              parent: node.parent,
            },
          }));

        const graphNodes = [
          ...fileNodes,
          ...classAndFunctionNodes,
        ];

        const hierarchyEdges = data.nodes
          .filter(
            (node) =>
              node.type === "class" ||
              node.type === "function"
          )
          .map((node) => ({
            id: `${node.parent ?? node.path}->${node.id}`,
            source: node.parent ?? node.path,
            target: node.id,
            type: "smoothstep",
          }));

        const importEdges = data.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: "imports",
          animated: true,
        }));

        const flowEdges = [
          ...hierarchyEdges,
          ...importEdges,
        ];

        setNodes(graphNodes);
        setEdges(flowEdges);

        setStats({
          files: data.files.length,

          classes: data.nodes.filter(
            (node) => node.type === "class"
          ).length,

          functions: data.nodes.filter(
            (node) => node.type === "function"
          ).length,

          dependencies: data.edges.length,
        });
      })
      .catch((error) => {
        console.error("Failed to load project:", error);
      });
  }, [projectName]);

  return (
    <div className="app">
      <Sidebar
        project={projectName}
        stats={stats}
      />

      <main className="main">
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <Topbar
          project={projectName}
          onUpload={handleUpload}
          uploading={uploading}
          onAIInsights={handleAIInsights}
          aiLoading={aiLoading}
        />

        <div className="workspace">
          <Graph
            nodes={nodes}
            edges={edges}
            onNodeClick={setSelectedNode}
          />

          <NodeDetails
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>

        <StatsBar stats={stats} />
        {aiAnalysis && (
          <div className="ai-panel">
            <div className="ai-panel-header">
              <div>
                <span className="ai-panel-label">AI ARCHITECT</span>
                <h2>Codebase Insights</h2>
              </div>

              <button onClick={() => setAiAnalysis("")}>×</button>
            </div>

            <div className="ai-panel-content">
              <pre>{aiAnalysis}</pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;