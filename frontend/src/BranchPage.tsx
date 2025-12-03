import Sidebar from "./Sidebar";
import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import type { Node, Edge, Connection } from "reactflow";
import "reactflow/dist/style.css";
import { Plus, X, Trash2, Menu } from "lucide-react";

const fileNameMap: Record<string, string> = {
  branch_001: "Nvidia 2026",
  branch_002: "Meta 2026",
  branch_003: "Netflix Data Analyst 2026",
  branch_004: "Apple Data Analyst 2026",
  branch_005: "EOG SWE 2026",
  branch_006: "Roblox SWE 2026",
  branch_008: "Amazon Data Analyst 2026",
  branch_009: "TMobile SWE 2026",
};

const CustomNode = ({ data, style }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseColor = style?.backgroundColor || "#10B981";
  const onRemove = data.onRemove;

  // Lighten color for hover
  const lightenColor = (color: string) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const lighten = (val: number) => Math.min(255, val + 60);
    return `#${lighten(r).toString(16).padStart(2, "0")}${lighten(g)
      .toString(16)
      .padStart(2, "0")}${lighten(b).toString(16).padStart(2, "0")}`;
  };

  const isCategory =
    data.isCategory || (data.branchId && data.branchId.startsWith("cat-"));

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent node selection when clicking delete
    if (onRemove && data.branchId) {
      onRemove(data.branchId);
    }
  };

  const nodeStyle = {
    position: "relative" as const,
    backgroundColor: isHovered ? lightenColor(baseColor) : baseColor,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: style?.color || "white",
    padding: style?.padding,
    borderRadius: isCategory ? "20px" : "50%",
    width: isCategory ? style?.width || "150px" : style?.width || "50px",
    height: isCategory ? style?.height || "50px" : style?.height || "50px",
    fontWeight: isCategory ? "bold" : "normal",
    textAlign: "center" as const,
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={nodeStyle}
    >
      {/* Delete button - only show for non-category nodes when hovered */}
      {!isCategory && isHovered && onRemove && (
        <button
          onClick={handleDelete}
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#ef4444",
            color: "white",
            border: "2px solid white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
            zIndex: 1001,
            transition: "all 0.2s ease",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#dc2626";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#ef4444";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ×
        </button>
      )}

      {/* Tooltip for branch nodes */}
      {!isCategory && isHovered && data.branchId && (
        <div
          style={{
            position: "absolute",
            top: "-50px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "white",
            padding: "6px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            zIndex: 999,
            pointerEvents: "none",
          }}
        >
          {data.fileName} {/* Show file name */}
          <br />
          {"Date created: 12/3/2025"}
        </div>
      )}

      {/* Handles for connectivity */}
      {isCategory ? (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: "#555",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          }}
          isConnectable={true}
        />
      ) : (
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={{
              background: "#555",
              borderRadius: "100%",
              transform: "translate(-50%, -50%)",
            }}
            isConnectable={true}
          />
          <Handle
            type="source"
            position={Position.Right}
            style={{
              background: "#555",
              borderRadius: "100%",
              transform: "translate(50%, -50%)",
            }}
            isConnectable={true}
          />
        </>
      )}

      {data.label}
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

type BranchNode = {
  branch_info: {
    branch_id: string;
    parent_branch_id: (string | null)[];
    children_branch_ids: (string | null)[];
  };
  categoryId: string;
  categoryParents?: string[];
  fileName?: string;
};

type GraphData = {
  categories: Array<{ id: string; label: string; color: string }>;
  nodes: BranchNode[];
};

const sampleData: GraphData = {
  categories: [
    { id: "cat-1", label: "Summer 2026 intern", color: "#2D5016" },
    { id: "cat-2", label: "Data Analyst", color: "#2D5016" },
    { id: "cat-3", label: "Software Engineering", color: "#2D5016" },
  ],
  nodes: [
    {
      branch_info: {
        branch_id: "branch_001",
        parent_branch_id: [null],
        children_branch_ids: ["branch_002", "branch_004"],
      },
      categoryId: "cat-1",
      fileName: fileNameMap["branch_001"],
    },
    {
      branch_info: {
        branch_id: "branch_002",
        parent_branch_id: ["branch_001"],
        children_branch_ids: ["branch_006"],
      },
      categoryId: "cat-1",
      fileName: fileNameMap["branch_002"],
    },
    {
      branch_info: {
        branch_id: "branch_003",
        parent_branch_id: [null],
        children_branch_ids: ["branch_004"],
      },
      categoryId: "cat-2",
      fileName: fileNameMap["branch_003"],
    },
    {
      branch_info: {
        branch_id: "branch_004",
        parent_branch_id: ["branch_003", "branch_001"],
        children_branch_ids: [null],
      },
      categoryId: "cat-2",
      fileName: fileNameMap["branch_004"],
    },
    {
      branch_info: {
        branch_id: "branch_005",
        parent_branch_id: [null],
        children_branch_ids: ["branch_009"],
      },
      categoryId: "cat-3",
      fileName: fileNameMap["branch_005"],
    },
    {
      branch_info: {
        branch_id: "branch_006",
        parent_branch_id: ["branch_002"],
        children_branch_ids: [null],
      },
      categoryId: "cat-1",
      fileName: fileNameMap["branch_006"],
    },
    {
      branch_info: {
        branch_id: "branch_009",
        parent_branch_id: ["branch_005"],
        children_branch_ids: [null],
      },
      categoryId: "cat-3",
      fileName: fileNameMap["branch_009"],
    },
  ],
};

function generateLayout(
  data: GraphData,
  onRemoveNode?: (nodeId: string) => void
) {
  const { categories, nodes: dataNodes } = data;

  const nodeMap = new Map(dataNodes.map((n) => [n.branch_info.branch_id, n]));
  const inDegree = new Map<string, number>();

  dataNodes.forEach((node) => {
    inDegree.set(node.branch_info.branch_id, 0);
  });

  dataNodes.forEach((node) => {
    const children = node.branch_info.children_branch_ids.filter(
      (c) => c !== null
    );
    children.forEach((childId) => {
      inDegree.set(childId, (inDegree.get(childId) || 0) + 1);
    });
  });

  const roots = dataNodes.filter(
    (n) =>
      n.branch_info.parent_branch_id.length === 0 ||
      n.branch_info.parent_branch_id.every((p) => p === null)
  );

  const levels: string[][] = [];
  const nodeLevel = new Map<string, number>();
  const queue: { id: string; level: number }[] = roots.map((r) => ({
    id: r.branch_info.branch_id,
    level: 0,
  }));

  while (queue.length > 0) {
    const { id, level } = queue.shift()!;

    if (nodeLevel.has(id)) {
      const currentLevel = nodeLevel.get(id)!;
      if (level > currentLevel) {
        const oldLevelArray = levels[currentLevel];
        const idx = oldLevelArray.indexOf(id);
        if (idx > -1) oldLevelArray.splice(idx, 1);

        nodeLevel.set(id, level);
        if (!levels[level]) levels[level] = [];
        levels[level].push(id);
      }
      continue;
    }

    nodeLevel.set(id, level);
    if (!levels[level]) levels[level] = [];
    levels[level].push(id);

    const node = nodeMap.get(id);
    if (node) {
      const children = node.branch_info.children_branch_ids.filter(
        (c) => c !== null
      );
      children.forEach((childId) => {
        queue.push({ id: childId, level: level + 1 });
      });
    }
  }

  const categoryColors = new Map(categories.map((c) => [c.id, c.color]));
  const CATEGORY_WIDTH = 150;
  const CATEGORY_HEIGHT = 50;
  const CATEGORY_SPACING = 100;
  const DOC_SIZE = 50;
  const LEVEL_SPACING = 200;
  const NODE_SPACING = 100;

  const reactFlowNodes: Node[] = [];
  const reactFlowEdges: Edge[] = [];

  categories.forEach((cat, idx) => {
    reactFlowNodes.push({
      id: cat.id,
      type: "custom",
      data: { label: cat.label, branchId: cat.id, isCategory: true },
      position: { x: 0, y: idx * CATEGORY_SPACING },
      style: {
        backgroundColor: cat.color,
        color: "white",
        padding: "10px",
        borderRadius: "50% / 50%",
        width: CATEGORY_WIDTH,
        height: CATEGORY_HEIGHT,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
      },
    });
  });

  levels.forEach((levelNodes, levelIdx) => {
    levelNodes.forEach((nodeId, nodeIdx) => {
      const node = nodeMap.get(nodeId);
      if (!node) return;

      // Initialize categoryParents if not present
      if (!node.categoryParents) {
        node.categoryParents = [node.categoryId];
      }

      // // const color = categoryColors.get(node.categoryId) || '#999';
      // const color =
      //   node.categoryId === ""
      //     ? "#90EE90" // Light green for unconnected nodes
      //     : categoryColors.get(node.categoryId) || "#999";

      // Determine node color
      let color = "#90EE90"; // default light green

      if (node.categoryId && categoryColors.has(node.categoryId)) {
        color = categoryColors.get(node.categoryId)!;
      }

      // If node has categoryParents (multi-category), use the first as primary color
      if (
        node.categoryParents &&
        node.categoryParents.length > 0 &&
        categoryColors.has(node.categoryParents[0])
      ) {
        color = categoryColors.get(node.categoryParents[0])!;
      }

      const x = CATEGORY_WIDTH + 100 + levelIdx * LEVEL_SPACING;
      const y = nodeIdx * NODE_SPACING + 25;

      reactFlowNodes.push({
        id: nodeId,
        // key: `${nodeId}-${color}`,
        type: "custom",
        data: {
          label: "",
          isCircle: true,
          branchId: nodeId,
          fileName: node.fileName || nodeId, // ← add this

          categoryParents: [...(node.categoryParents ?? [])], // ← new array reference
          onRemove: onRemoveNode,
          color,
          updateKey: color,
        },
        position: { x, y },
        style: {
          backgroundColor: color,
          width: DOC_SIZE,
          height: DOC_SIZE,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // ...{}
        },
      });

      // Create edges from all category parents
      if (levelIdx === 0) {
        // For root nodes, create edges from all their category parents
        if (node.categoryParents && node.categoryParents.length > 0) {
          node.categoryParents.forEach((catId) => {
            reactFlowEdges.push({
              id: `e-${catId}-${nodeId}`,
              source: catId,
              target: nodeId,
              type: "default",
              style: { stroke: "#AAAAAA", strokeWidth: 2 },
            });
          });
        } else {
          // Fallback to single category if categoryParents not set
          reactFlowEdges.push({
            id: `e-${node.categoryId}-${nodeId}`,
            source: node.categoryId,
            target: nodeId,
            type: "default",
            style: { stroke: "#AAAAAA", strokeWidth: 2 },
          });
        }
      }

      const children = node.branch_info.children_branch_ids.filter(
        (c) => c !== null
      );
      children.forEach((childId) => {
        reactFlowEdges.push({
          id: `e-${nodeId}-${childId}`,
          source: nodeId,
          target: childId,
          type: "default",
          style: { stroke: "#AAAAAA", strokeWidth: 2 },
        });
      });
    });
  });

  return { nodes: reactFlowNodes, edges: reactFlowEdges };
}

interface FlowDiagramProps {
  graphData: GraphData;
  setGraphData: React.Dispatch<React.SetStateAction<GraphData>>;
  filteredFrom: string | null;
  setFilteredFrom: React.Dispatch<React.SetStateAction<string | null>>;
  selectedNode: string | null;
  setSelectedNode: React.Dispatch<React.SetStateAction<string | null>>;
}

const FlowDiagram: React.FC<FlowDiagramProps> = ({
  graphData,
  setGraphData,
  filteredFrom,
  setFilteredFrom,
  selectedNode,
  setSelectedNode,
}) => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleRemoveNodeFromDiagram = (nodeId: string) => {
    if (nodeId.startsWith("cat-")) {
      alert("Cannot remove category nodes");
      return;
    }

    const updatedData: GraphData = {
      ...graphData,
      nodes: graphData.nodes.filter((n) => n.branch_info.branch_id !== nodeId),
    };

    updatedData.nodes.forEach((node) => {
      node.branch_info.parent_branch_id =
        node.branch_info.parent_branch_id.filter((p) => p !== nodeId) as (
          | string
          | null
        )[];
      node.branch_info.children_branch_ids =
        node.branch_info.children_branch_ids.filter((c) => c !== nodeId) as (
          | string
          | null
        )[];
    });

    setGraphData(updatedData);
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }

    syncToBackend("REMOVE_NODE", {
      nodeId: nodeId,
      timestamp: new Date().toISOString(),
    });
  };

  // Backend sync function
  const syncToBackend = async (action: string, payload: any) => {
    console.log(`Syncing to backend - Action: ${action}`, payload);

    try {
      console.log("Backend sync successful");
    } catch (error) {
      console.error("Backend sync failed:", error);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      console.log("New connection established:", params);
      setEdges((eds) => addEdge(params, eds));

      const toast = document.createElement("div");
      toast.textContent = `✅ New connection created between ${params.source} → ${params.target}`;
      toast.style.position = "fixed";
      toast.style.bottom = "20px";
      toast.style.right = "20px";
      toast.style.background = "#333";
      toast.style.color = "white";
      toast.style.padding = "10px 15px";
      toast.style.borderRadius = "6px";
      toast.style.fontSize = "14px";
      toast.style.opacity = "0.95";
      toast.style.zIndex = "9999";
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);

      // Sync new connection to backend
      syncToBackend("ADD_CONNECTION", {
        source: params.source,
        target: params.target,
        timestamp: new Date().toISOString(),
      });

      // Update graph data
      setGraphData((prevData) => {
        const newData: GraphData = {
          ...prevData,
          nodes: prevData.nodes.map((n) => ({ ...n })),
        };

        const isSourceCategory = params.source?.startsWith("cat-");

        const sourceNode = newData.nodes.find(
          (n) => n.branch_info.branch_id === params.source
        );
        const targetNode = newData.nodes.find(
          (n) => n.branch_info.branch_id === params.target
        );

        if (!targetNode) return newData;

        // CATEGORY → NODE connection
        if (isSourceCategory) {
          // ensure categoryParents array exists
          if (!targetNode.categoryParents) {
            targetNode.categoryParents = [];
          }

          // add category to parents
          if (!targetNode.categoryParents.includes(params.source!)) {
            targetNode.categoryParents = [
              ...targetNode.categoryParents,
              params.source!,
            ];
          }

          // IMPORTANT: update categoryId so layout gets correct color
          targetNode.categoryId = params.source!;

          // Keep parent_branch_id as [null]
          targetNode.branch_info.parent_branch_id = [null];
        } else {
          // NODE → NODE connection
          const parentIds = targetNode.branch_info.parent_branch_id.filter(
            (id): id is string => id !== null
          );

          if (!parentIds.includes(params.source!)) {
            targetNode.branch_info.parent_branch_id = [
              ...parentIds,
              params.source!,
            ];
          }

          if (sourceNode) {
            const children = sourceNode.branch_info.children_branch_ids.filter(
              (c): c is string => c !== null
            );

            if (!children.includes(params.target!)) {
              sourceNode.branch_info.children_branch_ids = [
                ...children,
                params.target!,
              ];
            }
          }
        }

        return newData;
      });
    },

    [setEdges, setGraphData]
  );

  const getDescendants = (nodeId: string, data: GraphData): Set<string> => {
    const descendants = new Set<string>();
    const nodeMap = new Map(
      data.nodes.map((n) => [n.branch_info.branch_id, n])
    );

    // If it's a category, get all nodes of that category and their descendants
    const category = data.categories.find((c) => c.id === nodeId);
    if (category) {
      const categoryNodes = data.nodes.filter((n) => {
        // Check if node belongs to this category (either as primary or in categoryParents)
        return (
          n.categoryId === nodeId ||
          (n.categoryParents && n.categoryParents.includes(nodeId))
        );
      });

      categoryNodes.forEach((n) => {
        descendants.add(n.branch_info.branch_id);
        const nodeDescendants = getDescendantsHelper(
          n.branch_info.branch_id,
          nodeMap
        );
        nodeDescendants.forEach((d) => descendants.add(d));
      });

      return descendants;
    }

    // For regular nodes, get all descendants
    const nodeDescendants = getDescendantsHelper(nodeId, nodeMap);
    nodeDescendants.forEach((d) => descendants.add(d));

    return descendants;
  };

  const getDescendantsHelper = (
    nodeId: string,
    nodeMap: Map<string, BranchNode>
  ): Set<string> => {
    const descendants = new Set<string>();
    const queue = [nodeId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      // Prevent infinite loops
      if (visited.has(currentId)) {
        continue;
      }
      visited.add(currentId);
      descendants.add(currentId);

      const node = nodeMap.get(currentId);
      if (node) {
        const children = node.branch_info.children_branch_ids.filter(
          (c): c is string => c !== null && c !== undefined
        );
        children.forEach((childId) => {
          if (!visited.has(childId)) {
            queue.push(childId);
          }
        });
      }
    }

    return descendants;
  };

  const handleGenerate = (filterFromNode?: string) => {
    let filteredData = graphData;
    let shouldIncludeCategories = false;

    if (filterFromNode) {
      const descendants = getDescendants(filterFromNode, graphData);

      // Check if filterFromNode is a category
      const isCategory = graphData.categories.find(
        (c) => c.id === filterFromNode
      );

      if (isCategory) {
        // When filtering by category, include the category itself
        shouldIncludeCategories = true;
        filteredData = {
          categories: graphData.categories.filter(
            (c) => c.id === filterFromNode
          ),
          nodes: graphData.nodes.filter((n: any) =>
            descendants.has(n.branch_info.branch_id)
          ),
        };
      } else {
        // For regular nodes, filter nodes and keep all categories
        filteredData = {
          ...graphData,
          nodes: graphData.nodes.filter((n: any) =>
            descendants.has(n.branch_info.branch_id)
          ),
        };
      }
    }

    const { nodes: newNodes, edges: newEdges } = generateLayout(
      filteredData,
      handleRemoveNodeFromDiagram
    );
    setNodes(newNodes);
    setEdges(newEdges);
    setFilteredFrom(filterFromNode || null);
  };

  const onNodeClick = useCallback(
    (_: any, node: Node) => {
      setSelectedNode(node.id);

      // Do filtering for both categories & nodes
      handleGenerate(node.id);

      // 🚫 Prevent category nodes from navigating to CreatePage
      const isCategory = node.id.startsWith("cat-");
      if (isCategory) return;

      // ✔ Only non-category nodes navigate to CreatePage
      try {
        navigate("/CreatePage", { state: { branchId: node.id } });
      } catch {
        location.hash = `#/CreatePage`;
      }
    },
    [graphData, navigate]
  );

  useEffect(() => {
    handleGenerate(filteredFrom || undefined);
  }, [graphData, filteredFrom]);

  return (
    <div style={{ width: "100%", height: "100%", background: "#F5F5F5" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        minZoom={0.2}
        maxZoom={4}
      >
        <MiniMap
          nodeStrokeWidth={3}
          nodeColor={(n) => (n.style?.backgroundColor as string) || "#5D9A5D"}
        />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
};

function BranchPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [filteredFrom, setFilteredFrom] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [graphData, setGraphData] = useState(sampleData);

  const syncToBackend = async (action: string, payload: any) => {
    console.log(`Syncing to backend - Action: ${action}`, payload);
    try {
      console.log("Backend sync successful");
    } catch (error) {
      console.error("Backend sync failed:", error);
    }
  };

  const handleAddNode = () => {
    const newBranchId = `New Resume`;

    // Create new node with no category (will be light green until connected to a category)
    const newNode: BranchNode = {
      branch_info: {
        branch_id: newBranchId,
        parent_branch_id: [],
        children_branch_ids: [],
      },
      categoryId: "", // Empty categoryId for unconnected nodes
    };

    const updatedData: GraphData = {
      ...graphData,
      nodes: [...graphData.nodes, newNode],
    };

    setGraphData(updatedData);

    syncToBackend("ADD_NODE", {
      node: newNode,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRemoveNode = () => {
    if (!selectedNode) {
      alert("Please select a node first by clicking on it");
      return;
    }

    if (selectedNode.startsWith("cat-")) {
      alert("Cannot remove category nodes");
      return;
    }

    const updatedData: GraphData = {
      ...graphData,
      nodes: graphData.nodes.filter(
        (n) => n.branch_info.branch_id !== selectedNode
      ),
    };

    updatedData.nodes.forEach((node) => {
      node.branch_info.parent_branch_id =
        node.branch_info.parent_branch_id.filter((p) => p !== selectedNode) as (
          | string
          | null
        )[];
      node.branch_info.children_branch_ids =
        node.branch_info.children_branch_ids.filter(
          (c) => c !== selectedNode
        ) as (string | null)[];
    });

    setGraphData(updatedData);
    setSelectedNode(null);

    syncToBackend("REMOVE_NODE", {
      nodeId: selectedNode,
      timestamp: new Date().toISOString(),
    });
  };

  const handleResetView = () => {
    setFilteredFrom(null);
    setSelectedNode(null);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#F3F4F6",
      }}
    >
      {/* Sidebar on the left */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
          transition: "all 0.3s ease",
        }}
      >
        {/* Header section */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "bold",
                color: "#10B981",
                marginBottom: "8px",
              }}
            >
              Branch View
            </h2>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {filteredFrom && (
              <button
                onClick={handleResetView}
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(16, 185, 129, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(16, 185, 129, 0.3)";
                }}
              >
                Reset View
              </button>
            )}

            <button
              onClick={handleAddNode}
              style={{
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(16, 185, 129, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(16, 185, 129, 0.3)";
              }}
            >
              <Plus size={18} />
              Add
            </button>

            <button
              onClick={handleRemoveNode}
              style={{
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 4px 12px rgba(239, 68, 68, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 2px 8px rgba(239, 68, 68, 0.3)";
              }}
            >
              <Trash2 size={18} />
              Remove Node
            </button>

            {selectedNode && (
              <div
                style={{
                  fontSize: "13px",
                  color: "#666",
                  marginLeft: "8px",
                  padding: "8px 12px",
                  background: "#F3F4F6",
                  borderRadius: "6px",
                }}
              >
                Selected: <strong>{selectedNode}</strong>
              </div>
            )}
          </div>
        </div>

        {/*  Flow Diagram container */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "10px",
            flex: 1,
            margin: "20px",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <FlowDiagram
            graphData={graphData}
            setGraphData={setGraphData}
            filteredFrom={filteredFrom}
            setFilteredFrom={setFilteredFrom}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
          />
        </div>
      </div>
    </div>
  );
}

export default BranchPage;
