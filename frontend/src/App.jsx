import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Graph from "./components/Graph";
import NodeDetails from "./components/NodeDetails";
import StatsBar from "./components/StatsBar";

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);

  const [stats, setStats] = useState({
    files: 0,
    classes: 0,
    functions: 0,
    dependencies: 0,
  });

  const projectName = "codeatlas-sample-repo";

  useEffect(() => {
    fetch(
      `http://127.0.0.1:8000/api/projects/${projectName}/analyze`
    )
      .then((response) => response.json())
      .then((data) => {
        const fileNodes = data.nodes
          .filter((node) => node.type === "file")
          .map((node, index) => ({
            id: node.id,

            position: {
              x: (index % 3) * 320,
              y: Math.floor(index / 3) * 220,
            },

            data: {
              label: node.label,
              path: node.path,
            },

            style: {
              background: "#111827",
              color: "#f9fafb",
              border: "1px solid #374151",
              borderRadius: "10px",
              padding: "14px 18px",
              width: 180,
              fontSize: 13,
            },
          }));

        const flowEdges = data.edges.map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: "imports",
          animated: true,
        }));

        setNodes(fileNodes);
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
  }, []);

  return (
    <div className="app">
      <Sidebar
        project={projectName}
        stats={stats}
      />

      <main className="main">
        <Topbar project={projectName} />

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
      </main>
    </div>
  );
}

export default App;