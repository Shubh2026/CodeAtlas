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