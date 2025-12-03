import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./Sidebar";
import { useLocation } from "react-router-dom";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Node,
  Edge,
  BackgroundVariant,
  Handle,
  Position,
  Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { Plus, Trash2, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

/* ---------------------- Types --------------------- */

interface PersonalInformation {
  name: string;
  phone: string;
  email: string;
  location: string;
  links: Array<{ [key: string]: string }>;
}
interface Project {
  name: string;
  technologies: string[];
  role: string;
  start_date: string;
  end_date: string;
  description: string[];
}
interface Education {
  institution: string;
  location: string;
  majors: string[];
  minors: string[];
  start_date: string;
  end_date: string;
  GPA: string;
  description: string[];
}
interface LeadershipExperience {
  role: string;
  start_date: string;
  end_date: string;
  description: string[];
}
interface Skills {
  programming_languages: string[];
  frameworks: string[];
  developer_tools: string[];
  languages: string[];
}

interface ResumeContent {
  personal_information: PersonalInformation;
  projects: Project[];
  education: Education[];
  leadership_experience: LeadershipExperience[];
  skills: Skills;
}
interface ResumeInfo {
  resume_creation_date: string;
  filename: string;
  template_used: string;
  section_order: string[];
}
interface BranchInfo {
  parent_resume_ids: (string | null)[];
  children_resume_ids: (string | null)[];
  created_date: string;
  last_modified: string;
}
interface Metadata {
  resume_info: ResumeInfo;
  branch_info: BranchInfo;
}
interface Resume {
  user_id: string;
  resume_id: string;
  resume: ResumeContent;
  metadata: Metadata;
}

/* ---------------------- Config / constants --------------------- */

const API_BASE_URL = "http://localhost:3000";
const TEST_USER_ID = "000000";

const categories = [
  { id: "cat-fullstack", label: "FULL STACK", color: "#10B981" },
  { id: "cat-aiml", label: "AI/ML", color: "#10B981" },
  { id: "cat-internship", label: "INTERNSHIP", color: "#10B981" },
  { id: "cat-leadership", label: "LEADERSHIP", color: "#10B981" },
];

/* ---------------------- Custom Node --------------------- */

const lightenColor = (color: string) => {
  const hex = color.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const lighten = (val: number) => Math.min(255, val + 30);
  return `#${lighten(r).toString(16).padStart(2, "0")}${lighten(g)
    .toString(16)
    .padStart(2, "0")}${lighten(b).toString(16).padStart(2, "0")}`;
};

const CustomNode = React.memo(({ data, isConnectable }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCategory = !!data.isCategory;
  const baseColor = isCategory ? "#10B981" : "#10B981";
  const backgroundColor = isHovered ? lightenColor(baseColor) : baseColor;

  return isCategory ? (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      style={{
        backgroundColor,
        color: "white",
        padding: "12px 24px",
        borderRadius: "40px",
        fontSize: "14px",
        fontWeight: "bold",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
        minWidth: "140px",
        textAlign: "center",
        overflow: "visible",
      }}
      aria-label={`category ${data.label}`}
    >
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#555", width: 8, height: 8, right: -4 }}
      />
      {data.label}
    </div>
  ) : (
    <div
      role="group"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor,
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: isHovered
          ? "0 4px 12px rgba(16, 185, 129, 0.4)"
          : "0 2px 8px rgba(16, 185, 129, 0.3)",
        transform: isHovered ? "scale(1.1)" : "scale(1)",
      }}
      aria-label={`resume ${data.fileName || data.resumeId}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        style={{ background: "#555", width: 8, height: 8, left: -4 }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: "#555", width: 8, height: 8, right: -4 }}
      />

      {isHovered && data.fileName && (
        <div
          style={{
            position: "absolute",
            top: -60,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#333",
            color: "white",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: 12,
            whiteSpace: "nowrap",
            zIndex: 1000,
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <div style={{ fontWeight: "bold" }}>{data.fileName}</div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>
            {data.createdDate || "No date"}
          </div>
        </div>
      )}

      {/* {isHovered && (
        <button
          aria-label={`delete ${data.resumeId}`}
          style={{
            position: 'absolute',
            top: -8,
            right: -8,
            width: 20,
            height: 20,
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            color: 'white',
            border: '2px solid white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            fontWeight: 'bold',
            zIndex: 1001,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          ×
        </button>
      )} */}
    </div>
  );
});

const nodeTypes = { custom: CustomNode };

/* ---------------------- Main Component --------------------- */

const ResumeTreeVisualizer: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserId] = useState<string>(TEST_USER_ID);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const abortRef = useRef<AbortController | null>(null);
  const [newCategoryLabel, setNewCategoryLabel] = useState("");

  useEffect(() => {
    if (location.state?.openModal) {
      setIsModalOpen(true);
      try {
        const newState = { ...location.state, openModal: false };
        window.history.replaceState(newState, "");
      } catch (err) {
        console.warn("replaceState failed", err);
      }
    }
  }, [location.state]);

  const genId = () => {
    try {
      return uuidv4();
    } catch {
      return `id-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }
  };

  /* ---------------------- createFlowElements (memoized) --------------------- */
  const createFlowElements = useCallback(
    (fetchedResumes: Resume[]): { nodes: Node[]; edges: Edge[] } => {
      const nodesOut: Node[] = [];
      const edgesOut: Edge[] = [];
      const nodeMap = new Map<string, Resume>();

      if (!Array.isArray(fetchedResumes) || fetchedResumes.length === 0) {
        return { nodes: [], edges: [] };
      }

      // Build map
      fetchedResumes.forEach((r) => {
        if (r && r.resume_id) nodeMap.set(r.resume_id, r);
      });

      // Category nodes
      const CATEGORY_SPACING = 120;
      categories.forEach((cat, idx) => {
        nodesOut.push({
          id: cat.id,
          type: "custom",
          data: { label: cat.label, isCategory: true },
          position: { x: 0, y: idx * CATEGORY_SPACING },
          draggable: false,
        });
      });

      const childrenMap = new Map<string, string[]>();
      const parentsMap = new Map<string, string[]>();

      fetchedResumes.forEach((resume) => {
        const rId = resume.resume_id;
        const childIds =
          resume.metadata?.branch_info?.children_resume_ids || [];
        const validChildren = childIds.filter(
          (id): id is string => id !== null && id !== ""
        );
        childrenMap.set(rId, validChildren);

        const parentIds = resume.metadata?.branch_info?.parent_resume_ids || [];
        const validParents = parentIds.filter(
          (id): id is string => id !== null && id !== ""
        );
        parentsMap.set(rId, validParents);
      });

      // Make parent-child symmetric
      fetchedResumes.forEach((resume) => {
        const rId = resume.resume_id;
        const parents = parentsMap.get(rId) || [];
        parents.forEach((p) => {
          const pChildren = childrenMap.get(p) || [];
          if (!pChildren.includes(rId)) childrenMap.set(p, [...pChildren, rId]);
        });
      });

      // Find roots: nodes with no parents
      const roots = fetchedResumes.filter((r) => {
        const parents = parentsMap.get(r.resume_id) || [];
        return parents.length === 0;
      });

      // If everything has parents (cycle?), treat any node as root to ensure display
      const rootIds =
        roots.length > 0
          ? roots.map((r) => r.resume_id)
          : fetchedResumes.map((r) => r.resume_id);

      // Layout: positionSubtree with cycle detection
      const positioned = new Set<string>();
      const visitedStack = new Set<string>();
      const levelWidth = 150;
      const levelHeight = 80;
      let categoryOffset = 0;

      const positionSubtree = (
        nodeId: string,
        x: number,
        y: number,
        level: number
      ): number => {
        if (visitedStack.has(nodeId)) {
          // cycle detected — create node if not created and return 1 to prevent infinite recursion
          if (!positioned.has(nodeId) && nodeMap.has(nodeId)) {
            const resume = nodeMap.get(nodeId)!;
            const createdDate = resume.metadata?.branch_info?.created_date
              ? new Date(
                  resume.metadata.branch_info.created_date
                ).toLocaleDateString()
              : "";
            nodesOut.push({
              id: nodeId,
              type: "custom",
              data: {
                resumeId: nodeId,
                createdDate,
                isCategory: false,
                fileName: resume.metadata?.resume_info?.filename,
              },
              position: { x, y },
              draggable: true,
            });
            positioned.add(nodeId);
          }
          return 1;
        }

        if (positioned.has(nodeId)) {
          return 1;
        }

        const resume = nodeMap.get(nodeId);
        if (!resume) {
          console.warn("Missing resume for nodeId", nodeId);
          return 0;
        }

        // mark visited in current path
        visitedStack.add(nodeId);

        const createdDate = resume.metadata?.branch_info?.created_date
          ? new Date(
              resume.metadata.branch_info.created_date
            ).toLocaleDateString()
          : "";
        nodesOut.push({
          id: nodeId,
          type: "custom",
          data: {
            resumeId: nodeId,
            createdDate,
            isCategory: false,
            fileName: resume.metadata?.resume_info?.filename,
          },
          position: { x, y },
          draggable: true,
        });
        positioned.add(nodeId);

        // connect to category for roots
        if (level === 0) {
          const categoryId =
            categories[Math.min(categoryOffset, categories.length - 1)].id;
          edgesOut.push({
            id: `e-${categoryId}-${nodeId}`,
            source: categoryId,
            target: nodeId,
            type: "default",
            animated: false,
            style: { stroke: "#AAAAAA", strokeWidth: 2 },
          });
        }

        const children = childrenMap.get(nodeId) || [];
        if (children.length === 0) {
          visitedStack.delete(nodeId);
          return 1;
        }

        let currentY = y - ((children.length - 1) * levelHeight) / 2;
        let total = 0;
        children.forEach((childId) => {
          // add edge regardless (even if child is a previously positioned node)
          edgesOut.push({
            id: `e-${nodeId}-${childId}`,
            source: nodeId,
            target: childId,
            type: "default",
            animated: false,
            style: { stroke: "#AAAAAA", strokeWidth: 2 },
          });

          const childHeight = positionSubtree(
            childId,
            x + levelWidth,
            currentY,
            level + 1
          );
          currentY += childHeight * levelHeight;
          total += childHeight;
        });

        visitedStack.delete(nodeId);
        return Math.max(total, 1);
      };

      // Position roots
      let startY = 50;
      rootIds.forEach((rId) => {
        const treeHeight = positionSubtree(rId, 250, startY, 0);
        startY += treeHeight * levelHeight + 50;
        categoryOffset++;
      });

      return { nodes: nodesOut, edges: edgesOut };
    },
    []
  );

  /* ---------------------- fetchResumes (stable) --------------------- */
  const fetchResumes = useCallback(async () => {
    if (!selectedUserId) return;
    setLoading(true);
    setError(null);
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const response = await fetch(
        `${API_BASE_URL}/resumes/${selectedUserId}`,
        { signal: ac.signal }
      );
      if (!response.ok)
        throw new Error(`Failed to fetch resumes (${response.status})`);
      const data = await response.json();

      let fetchedResumes: Resume[] = [];
      if (data.Items && Array.isArray(data.Items)) fetchedResumes = data.Items;
      else if (Array.isArray(data)) fetchedResumes = data;
      else if (data) fetchedResumes = [data];

      fetchedResumes = fetchedResumes.filter((resume: Resume) => {
        const hasValidUserId = !!resume.user_id && resume.user_id !== "string";
        const hasValidResumeId =
          !!resume.resume_id && resume.resume_id !== "string";
        return hasValidUserId && hasValidResumeId;
      });

      if (fetchedResumes.length === 0) {
        setError("No valid resumes found for this user");
        setNodes([]);
        setEdges([]);
        setResumes([]);
        setLoading(false);
        return;
      }

      setResumes(fetchedResumes);
      const { nodes: flowNodes, edges: flowEdges } =
        createFlowElements(fetchedResumes);
      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (err) {
      if ((err as any)?.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        console.error("Error fetching resumes", err);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [selectedUserId, createFlowElements, setNodes, setEdges]);

  useEffect(() => {
    fetchResumes();
    return () => {
      abortRef.current?.abort();
    };
  }, [fetchResumes]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (!node.data?.isCategory) setSelectedNode(node.id);
  }, []);

  /* ---------------------- Add Node --------------------- */
  const handleAddNode = async () => {
    if (!selectedNode) {
      window.alert("Please select a node first by clicking on it");
      return;
    }
    if (selectedNode.startsWith("cat-")) {
      window.alert(
        "Cannot add children to category nodes. Please select a resume node."
      );
      return;
    }

    try {
      const newResumeId = genId();

      const newResume: Resume = {
        user_id: selectedUserId,
        resume_id: newResumeId,
        resume: {
          personal_information: {
            name: "",
            phone: "",
            email: "",
            location: "",
            links: [],
          },
          projects: [],
          education: [],
          leadership_experience: [],
          skills: {
            programming_languages: [],
            frameworks: [],
            developer_tools: [],
            languages: [],
          },
        },
        metadata: {
          resume_info: {
            resume_creation_date: new Date().toISOString().split("T")[0],
            filename: `Resume_${newResumeId}.pdf`,
            template_used: "jakes_resume",
            section_order: ["education", "projects", "skills"],
          },
          branch_info: {
            parent_resume_ids: [selectedNode],
            children_resume_ids: [],
            created_date: new Date().toISOString(),
            last_modified: new Date().toISOString(),
          },
        },
      };

      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newResume),
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`Failed to create resume: ${response.status} ${txt}`);
      }

      // Update parent locally / server-side (try to keep view consistent)
      const parentResume = resumes.find((r) => r.resume_id === selectedNode);
      if (parentResume) {
        const updatedParent = {
          ...parentResume,
          metadata: {
            ...parentResume.metadata,
            branch_info: {
              ...parentResume.metadata.branch_info,
              children_resume_ids: [
                ...parentResume.metadata.branch_info.children_resume_ids.filter(
                  (id) => id !== null && id !== ""
                ),
                newResumeId,
              ],
              last_modified: new Date().toISOString(),
            },
          },
        };

        try {
          await fetch(
            `${API_BASE_URL}/resumes/${selectedUserId}/${selectedNode}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedParent),
            }
          );
        } catch (err) {
          console.warn("Failed to update parent after creating child", err);
        }
      }

      window.alert(
        `✅ New resume ${newResumeId} created as child of ${selectedNode}`
      );
      await fetchResumes();
      setSelectedNode(newResumeId);
    } catch (err) {
      console.error("Error adding node:", err);
      window.alert(
        `Failed to add node: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  /* ---------------------- Remove Node --------------------- */
  const handleRemoveNode = async () => {
    if (!selectedNode) {
      window.alert("Please select a node first by clicking on it");
      return;
    }
    if (selectedNode.startsWith("cat-")) {
      window.alert("Cannot remove category nodes");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete resume ${selectedNode}? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      const resumeToDelete = resumes.find((r) => r.resume_id === selectedNode);
      if (!resumeToDelete) throw new Error("Resume not found");

      // update parents (remove this child)
      const parentIds =
        resumeToDelete.metadata.branch_info.parent_resume_ids.filter(
          (id): id is string => !!id
        );
      for (const parentId of parentIds) {
        const parentResume = resumes.find((r) => r.resume_id === parentId);
        if (parentResume) {
          const updatedParent = {
            ...parentResume,
            metadata: {
              ...parentResume.metadata,
              branch_info: {
                ...parentResume.metadata.branch_info,
                children_resume_ids:
                  parentResume.metadata.branch_info.children_resume_ids.filter(
                    (id) => id !== selectedNode
                  ),
                last_modified: new Date().toISOString(),
              },
            },
          };

          try {
            await fetch(
              `${API_BASE_URL}/resumes/${selectedUserId}/${parentId}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedParent),
              }
            );
          } catch (err) {
            console.warn(
              "Failed to update parent during delete:",
              parentId,
              err
            );
          }
        }
      }

      // update children (remove this parent)
      const childIds =
        resumeToDelete.metadata.branch_info.children_resume_ids.filter(
          (id): id is string => !!id
        );
      for (const childId of childIds) {
        const childResume = resumes.find((r) => r.resume_id === childId);
        if (childResume) {
          const updatedChild = {
            ...childResume,
            metadata: {
              ...childResume.metadata,
              branch_info: {
                ...childResume.metadata.branch_info,
                parent_resume_ids:
                  childResume.metadata.branch_info.parent_resume_ids.filter(
                    (id) => id !== selectedNode
                  ),
                last_modified: new Date().toISOString(),
              },
            },
          };

          try {
            await fetch(
              `${API_BASE_URL}/resumes/${selectedUserId}/${childId}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedChild),
              }
            );
          } catch (err) {
            console.warn("Failed to update child during delete:", childId, err);
          }
        }
      }

      // delete
      const deleteResponse = await fetch(
        `${API_BASE_URL}/resumes/${selectedUserId}/${selectedNode}`,
        { method: "DELETE" }
      );
      if (!deleteResponse.ok) {
        const txt = await deleteResponse.text();
        throw new Error(`Failed to delete: ${deleteResponse.status} ${txt}`);
      }

      window.alert(`✅ Resume ${selectedNode} deleted successfully`);
      setSelectedNode(null);
      await fetchResumes();
    } catch (err) {
      console.error("Error removing node:", err);
      window.alert(
        `Failed to remove node: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  /* ---------------------- Connect Nodes --------------------- */

  const handleConnect = useCallback(
    async (connection: Connection) => {
      const { source, target } = connection;

      if (!source || !target) return; // safety check

      const sourceIsCategory = source.startsWith("cat-");
      const targetIsCategory = target.startsWith("cat-");

      // Block category→category and resume→category
      if (
        (sourceIsCategory && targetIsCategory) ||
        (!sourceIsCategory && targetIsCategory)
      ) {
        window.alert("❌ Cannot connect to a category node as target.");
        return;
      }

      // Handle category → resume edge (no metadata update needed)
      if (sourceIsCategory) {
        setEdges((prev) => [
          ...prev,
          {
            id: `e-${source}-${target}`,
            source,
            target,
            type: "default",
            animated: false,
            style: { stroke: "#AAAAAA", strokeWidth: 2 },
          },
        ]);
        return;
      }

      // Handle resume → resume edge (update parent/child metadata)
      const sourceResume = resumes.find((r) => r.resume_id === source);
      const targetResume = resumes.find((r) => r.resume_id === target);

      if (!sourceResume || !targetResume) return;

      const updatedSource = {
        ...sourceResume,
        metadata: {
          ...sourceResume.metadata,
          branch_info: {
            ...sourceResume.metadata.branch_info,
            children_resume_ids: [
              ...sourceResume.metadata.branch_info.children_resume_ids.filter(
                Boolean
              ),
              target,
            ],
            last_modified: new Date().toISOString(),
          },
        },
      };

      const updatedTarget = {
        ...targetResume,
        metadata: {
          ...targetResume.metadata,
          branch_info: {
            ...targetResume.metadata.branch_info,
            parent_resume_ids: [
              ...targetResume.metadata.branch_info.parent_resume_ids.filter(
                Boolean
              ),
              source,
            ],
            last_modified: new Date().toISOString(),
          },
        },
      };

      try {
        // Update source
        await fetch(`${API_BASE_URL}/resumes/${selectedUserId}/${source}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSource),
        });

        // Update target
        await fetch(`${API_BASE_URL}/resumes/${selectedUserId}/${target}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTarget),
        });

        // Add edge visually
        setEdges((prev) => [
          ...prev,
          {
            id: `e-${source}-${target}`,
            source,
            target,
            type: "default",
            animated: false,
            style: { stroke: "#AAAAAA", strokeWidth: 2 },
          },
        ]);

        // Refresh tree
        await fetchResumes();
      } catch (err) {
        console.error("Connect error:", err);
        window.alert("Failed to connect nodes.");
      }
    },
    [resumes, selectedUserId, fetchResumes]
  );

  const handleCreateCategory = () => {
    const label = newCategoryLabel.trim();
    if (!label) {
      window.alert("Please enter a category name.");
      return;
    }

    const newCatId = `cat-${genId()}`;

    setNodes((prevNodes) => {
      // Only consider nodes whose data indicates a category
      const categoryNodes = prevNodes.filter(
        (node) => node.data && node.data.isCategory
      );

      const yPosition = categoryNodes.length * 120;

      const newNode: Node = {
        id: `cat-${genId()}`,
        type: "custom",
        data: { label: newCategoryLabel, isCategory: true },
        position: { x: 0, y: yPosition },
        draggable: false,
      };

      return [...prevNodes, newNode];
    });

    setNewCategoryLabel("");
    setIsModalOpen(false);
  };

  /* ---------------------- Render --------------------- */
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
      }}
    >
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar with Add / Remove Node */}
        {/* Top bar with Add / Remove Node */}
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
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
            <Plus size={16} /> Add Node
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
            <Trash2 size={16} /> Remove Node
          </button>
        </div>

        {/* ReactFlow canvas */}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onConnect={handleConnect}
          fitView
        >
          <MiniMap nodeStrokeWidth={3} nodeColor={() => "#10B981"} />
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={16} color="#aaa" />
        </ReactFlow>

        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100000,
            }}
            onClick={() => setIsModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "2rem",
                maxWidth: 500,
                width: "90%",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 600,
                    color: "#111827",
                    margin: 0,
                  }}
                >
                  Create new branch
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close modal"
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.25rem",
                    borderRadius: "0.375rem",
                  }}
                >
                  <X size={20} color="#6b7280" />
                </button>
              </div>

              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  marginBottom: "1.5rem",
                }}
              >
                Enter branch name
              </p>
              <textarea
                value={newCategoryLabel}
                onChange={(e) => setNewCategoryLabel(e.target.value)}
                placeholder="Enter branch name"
                style={{
                  width: "100%",
                  minHeight: 50,
                  padding: "0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  fontSize: "0.875rem",
                  resize: "vertical",
                  outline: "none",
                  boxSizing: "border-box",
                  backgroundColor: "#d5f8e2",
                  color: "#064e3b",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#10b981";
                  e.currentTarget.style.backgroundColor = "#dcfce7";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#d1d5db";
                  e.currentTarget.style.backgroundColor = "#f0fdf4";
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  marginTop: "1.5rem",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: "0.625rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    border: "1px solid #d1d5db",
                    backgroundColor: "white",
                    color: "#374151",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCategory}
                  style={{
                    padding: "0.625rem 1.5rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    border: "1px solid #10b981",
                    backgroundColor: "#10b981",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeTreeVisualizer;
