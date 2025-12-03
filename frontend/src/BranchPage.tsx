// import Sidebar from './Sidebar';

// import React, { useState, useCallback } from 'react';
// import ReactFlow, {
//   Controls,
//   Background,
//   useNodesState,
//   useEdgesState,
//   MarkerType,
//   Node,
//   Edge,
//   BackgroundVariant,
//   Handle,
//   Position,
//   Connection,
// } from 'reactflow';
// import 'reactflow/dist/style.css';
// import { Plus, Trash2 } from 'lucide-react';

// const lightenColor = (color: string) => {
//   const hex = color.replace('#', '');
//   const r = parseInt(hex.substr(0, 2), 16);
//   const g = parseInt(hex.substr(2, 2), 16);
//   const b = parseInt(hex.substr(4, 2), 16);
//   const lighten = (val: number) => Math.min(255, val + 30);
//   return `#${lighten(r).toString(16).padStart(2, '0')}${lighten(g).toString(16).padStart(2, '0')}${lighten(b).toString(16).padStart(2, '0')}`;
// };

// const CustomNode = React.memo(({ data, isConnectable }: any) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const isCategory = !!data.isCategory;
//   const baseColor = data.color || '#10B981';
//   const backgroundColor = isHovered ? lightenColor(baseColor) : baseColor;

//   return isCategory ? (
//     <div
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         backgroundColor,
//         color: 'white',
//         padding: '12px 24px',
//         borderRadius: '40px',
//         fontSize: '14px',
//         fontWeight: 'bold',
//         textTransform: 'uppercase',
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
//         minWidth: '140px',
//         textAlign: 'center',
//       }}
//     >
//       <Handle
//         type="source"
//         position={Position.Right}
//         isConnectable={isConnectable}
//         style={{ background: '#555', width: 8, height: 8, right: -4 }}
//       />
//       {data.label}
//     </div>
//   ) : (
//     <div
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//       style={{
//         position: 'relative',
//         width: 50,
//         height: 50,
//         borderRadius: '50%',
//         backgroundColor,
//         cursor: 'pointer',
//         transition: 'all 0.2s ease',
//         boxShadow: isHovered ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(16, 185, 129, 0.3)',
//         transform: isHovered ? 'scale(1.1)' : 'scale(1)'
//       }}
//     >
//       <Handle type="target" position={Position.Left} isConnectable={isConnectable} style={{ background: '#555', width: 8, height: 8, left: -4 }} />
//       <Handle type="source" position={Position.Right} isConnectable={isConnectable} style={{ background: '#555', width: 8, height: 8, right: -4 }} />

//       {isHovered && data.label && (
//         <div
//           style={{
//             position: 'absolute',
//             top: -60,
//             left: '50%',
//             transform: 'translateX(-50%)',
//             backgroundColor: '#333',
//             color: 'white',
//             padding: '8px 12px',
//             borderRadius: 6,
//             fontSize: 12,
//             whiteSpace: 'nowrap',
//             zIndex: 1000,
//             pointerEvents: 'none',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
//           }}
//         >
//           {data.label}
//         </div>
//       )}
//     </div>
//   );
// });

// const nodeTypes = { custom: CustomNode };

// const SimplifiedResumeTree: React.FC = () => {
//     const [collapsed, setCollapsed] = useState(false);

//   const initialNodes: Node[] = [
//     // Category 1
//     {
//       id: 'cat-1',
//       type: 'custom',
//       data: { label: 'FULL STACK', isCategory: true, color: '#10B981' },
//       position: { x: 0, y: 0 },
//       draggable: false
//     },
//     // Category 2
//     {
//       id: 'cat-2',
//       type: 'custom',
//       data: { label: 'AI/ML', isCategory: true, color: '#10B981' },
//       position: { x: 0, y: 120 },
//       draggable: false
//     },
//     // Category 1 resumes
//     { id: 'resume-1', type: 'custom', data: { label: 'Resume 1', color: '#10B981' }, position: { x: 250, y: -100 }, draggable: true },
//     { id: 'resume-2', type: 'custom', data: { label: 'Resume 2', color: '#10B981' }, position: { x: 250, y: -30 }, draggable: true },
//     { id: 'resume-3', type: 'custom', data: { label: 'Resume 3', color: '#10B981' }, position: { x: 250, y: 40 }, draggable: true },
//     { id: 'resume-4', type: 'custom', data: { label: 'Resume 4', color: '#10B981' }, position: { x: 250, y: 110 }, draggable: true },
//     { id: 'resume-5', type: 'custom', data: { label: 'Resume 5 (Shared)', color: '#10B981' }, position: { x: 250, y: 180 }, draggable: true },
//     // Category 2 resumes
//     { id: 'resume-6', type: 'custom', data: { label: 'Resume 6', color: '#10B981' }, position: { x: 250, y: 250 }, draggable: true },
//   ];

//   const initialEdges: Edge[] = [
//     // Category 1 edges
//     { id: 'e-cat1-r1', source: 'cat-1', target: 'resume-1', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
//     { id: 'e-cat1-r2', source: 'cat-1', target: 'resume-2', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
//     { id: 'e-cat1-r3', source: 'cat-1', target: 'resume-3', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
//     { id: 'e-cat1-r4', source: 'cat-1', target: 'resume-4', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
//     { id: 'e-cat1-r5', source: 'cat-1', target: 'resume-5', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
//     // Category 2 edges (including shared resume)
//     { id: 'e-cat2-r5', source: 'cat-2', target: 'resume-5', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
//     { id: 'e-cat2-r6', source: 'cat-2', target: 'resume-6', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
//   ];

//   const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
//   const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
//   const [selectedNode, setSelectedNode] = useState<string | null>(null);
//   const [nodeCounter, setNodeCounter] = useState(7);

//   const onNodeClick = useCallback((_: any, node: Node) => {
//     if (!node.data?.isCategory) {
//       setSelectedNode(node.id);
//     }
//   }, []);

//   const handleAddNode = () => {
//     const newNodeId = `resume-${nodeCounter}`;
//     const newNode: Node = {
//       id: newNodeId,
//       type: 'custom',
//       data: { label: `Resume ${nodeCounter}`, color: '#90EE90' }, // Light green
//       position: { x: 500, y: nodeCounter * 70 },
//       draggable: true
//     };
    
//     setNodes(prev => [...prev, newNode]);
//     setNodeCounter(prev => prev + 1);
//     setSelectedNode(newNodeId);
//   };

//   const handleRemoveNode = () => {
//     if (!selectedNode) {
//       alert('Please select a node first by clicking on it');
//       return;
//     }
//     if (selectedNode.startsWith('cat-')) {
//       alert('Cannot remove category nodes');
//       return;
//     }

//     setNodes(prev => prev.filter(node => node.id !== selectedNode));
//     setEdges(prev => prev.filter(edge => edge.source !== selectedNode && edge.target !== selectedNode));
//     setSelectedNode(null);
//   };

//   const handleConnect = useCallback(
//     (connection: Connection) => {
//       const { source, target } = connection;

//       if (!source || !target) return;

//       const sourceIsCategory = source.startsWith('cat-');
//       const targetIsCategory = target.startsWith('cat-');

//       if ((sourceIsCategory && targetIsCategory) || (!sourceIsCategory && targetIsCategory)) {
//         alert("❌ Cannot connect to a category node as target.");
//         return;
//       }

//       // If connecting from category to a light green node, change it to regular green
//       if (sourceIsCategory) {
//         setNodes(prev => prev.map(node => {
//           if (node.id === target && node.data && (node.data as any).color === '#90EE90') {
//             return {
//               ...node,
//               data: { ...node.data, color: '#10B981' }
//             };
//           }
//           return node;
//         }));
//       }

//       setEdges(prev => [
//         ...prev,
//         {
//           id: `e-${source}-${target}`,
//           source,
//           target,
//           type: "default",
//           animated: false,
//           style: { stroke: "#AAAAAA", strokeWidth: 2 }
//         }
//       ]);
//     },
//     [setNodes, setEdges]
//   );

//   return (
//     <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
//     <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

//       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
//         <div
//           style={{
//             padding: '12px 16px',
//             backgroundColor: '#ffffff',
//             borderBottom: '1px solid #e5e7eb',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'flex-end',
//             gap: '12px'
//           }}
//         >
//           <button
//             onClick={handleAddNode}
//             style={{
//               background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
//               color: 'white',
//               border: 'none',
//               padding: '10px 20px',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               fontWeight: '600',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               transition: 'all 0.2s ease',
//               boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'translateY(-2px)';
//               e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'translateY(0)';
//               e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
//             }}
//           >
//             <Plus size={16} /> Add Node
//           </button>

//           <button
//             onClick={handleRemoveNode}
//             style={{
//               background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
//               color: 'white',
//               border: 'none',
//               padding: '10px 20px',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontSize: '14px',
//               fontWeight: '600',
//               display: 'flex',
//               alignItems: 'center',
//               gap: '8px',
//               transition: 'all 0.2s ease',
//               boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.transform = 'translateY(-2px)';
//               e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.transform = 'translateY(0)';
//               e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
//             }}
//           >
//             <Trash2 size={16} /> Remove Node
//           </button>
//         </div>

//         <ReactFlow
//           nodes={nodes}
//           edges={edges}
//           nodeTypes={nodeTypes}
//           onNodesChange={onNodesChange}
//           onEdgesChange={onEdgesChange}
//           onNodeClick={onNodeClick}
//           onConnect={handleConnect}
//           fitView
//         >
//           <Controls />
//           <Background variant={BackgroundVariant.Dots} gap={16} color="#aaa" />
//         </ReactFlow>
//       </div>
//     </div>
//   );
// };

// export default SimplifiedResumeTree;

import Sidebar from "./Sidebar";

import React, { useState, useCallback, useEffect } from 'react';

import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
  MiniMap,
  Controls,
  Background,
} from 'reactflow';
import type{
    Node,
  Edge,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, X, Trash2, Menu } from 'lucide-react';

const CustomNode = ({ data, style }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const baseColor = style?.backgroundColor || '#10B981';
  const onRemove = data.onRemove;

  // Lighten color for hover
  const lightenColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const lighten = (val: number) => Math.min(255, val + 60);
    return `#${lighten(r).toString(16).padStart(2, '0')}${lighten(g).toString(16).padStart(2, '0')}${lighten(b).toString(16).padStart(2, '0')}`;
  };

  const isCategory = data.isCategory || (data.branchId && data.branchId.startsWith('cat-'));

  const handleDelete = (e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent node selection when clicking delete
  if (onRemove && data.branchId) {
    onRemove(data.branchId);
  }
};

  const nodeStyle = {
    position: 'relative' as const,
    backgroundColor: isHovered ? lightenColor(baseColor) : baseColor,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: style?.color || 'white',
    padding: style?.padding,
    borderRadius: isCategory ? '20px' : '50%',
    width: isCategory ? (style?.width || '150px') : (style?.width || '50px'),
    height: isCategory ? (style?.height || '50px') : (style?.height || '50px'),
    fontWeight: isCategory ? 'bold' : 'normal',
    textAlign: 'center' as const,
    whiteSpace: 'pre-wrap' as const,
    wordBreak: 'break-word' as const

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
            position: 'absolute',
            top: '-8px',
            right: '-8px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#ef4444',
            color: 'white',
            border: '2px solid white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            zIndex: 1001,
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          ×
        </button>
      )}
      {/* Tooltip for branch nodes
      {!isCategory && isHovered && data.branchId && (
        <div
          style={{
            position: 'absolute',
            top: '-25px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
          }}
        >
          {data.branchId}
          <br />
          {"Date created: "}
        </div>
      )} */}
      {/* Tooltip for branch nodes */}
      {!isCategory && isHovered && data.branchId && (
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '6px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            zIndex: 999,
            pointerEvents: 'none',
          }}
        >
          {data.branchId}
          <br />
          {data.categoryParents && data.categoryParents.length > 1 && (
            <>Categories: {data.categoryParents.join(', ')}<br /></>
          )}
          {"Date created: 11/12/2025"}
        </div>
      )}

      {/* Handles for connectivity */}
      {isCategory ? (
        // Category nodes: Only source handle (connections start from them)
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: '#555',
            borderRadius: '50%',
            transform: 'translate(50%, -50%)',
          }}
          isConnectable={true}
        />
      ) : (
        // Branch nodes: Both source and target handles
        <>
          <Handle
            type="target"
            position={Position.Left}
            style={{
              background: '#555',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            isConnectable={true}
          />
          <Handle
            type="source"
            position={Position.Right}
            style={{
              background: '#555',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
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

// type BranchNode = {
//   branch_info: {
//     branch_id: string;
//     parent_branch_id: (string | null)[];
//     children_branch_ids: (string | null)[];
//   };
//   categoryId: string;
// };

type BranchNode = {
  branch_info: {
    branch_id: string;
    parent_branch_id: (string | null)[];
    children_branch_ids: (string | null)[];
  };
  categoryId: string;
  categoryParents?: string[]; // Track multiple category parents
};

type GraphData = {
  categories: Array<{ id: string; label: string; color: string }>;
  nodes: BranchNode[];
};

const sampleData: GraphData = {
  categories: [
    { id: 'cat-1', label: 'Data Analyst', color: '#2D5016' },
    { id: 'cat-2', label: 'Summer 2026 intern', color: '#2D5016' },
    // { id: 'cat-3', label: 'INTERNSHIP', color: '#2D5016' },
    // { id: 'cat-4', label: 'LEADERSHIP', color: '#2D5016' }
  ],
  nodes: [
    {
      branch_info: {
        branch_id: 'branch_001',
        parent_branch_id: [null],
        children_branch_ids: ['branch_002', 'branch_005']
      },
      categoryId: 'cat-1'
    },
    {
      branch_info: {
        branch_id: 'branch_002',
        parent_branch_id: ['branch_001'],
        children_branch_ids: ['branch_006']
      },
      categoryId: 'cat-1'
    },
    {
      branch_info: {
        branch_id: 'branch_003',
        parent_branch_id: [null],
        children_branch_ids: ['branch_004', 'branch_007']
      },
      categoryId: 'cat-2'
    },
    {
      branch_info: {
        branch_id: 'branch_004',
        parent_branch_id: ['branch_003'],
        children_branch_ids: ['branch_008']
      },
      categoryId: 'cat-2'
    },
    {
      branch_info: {
        branch_id: 'branch_005',
        parent_branch_id: ['branch_002'],
        children_branch_ids: ['branch_009']
      },
      categoryId: 'cat-1'
    },
    {
      branch_info: {
        branch_id: 'branch_006',
        parent_branch_id: ['branch_002'],
        children_branch_ids: ['branch_010']
      },
      categoryId: 'cat-1'
    },
    {
      branch_info: {
        branch_id: 'branch_007',
        parent_branch_id: ['branch_003'],
        children_branch_ids: ['branch_010']
      },
      categoryId: 'cat-2'
    },
    {
      branch_info: {
        branch_id: 'branch_008',
        parent_branch_id: ['branch_004'],
        children_branch_ids: ['branch_final']
      },
      categoryId: 'cat-2'
    },
    {
      branch_info: {
        branch_id: 'branch_009',
        parent_branch_id: ['branch_005'],
        children_branch_ids: ['branch_final']
      },
      categoryId: 'cat-1'
    },
    {
      branch_info: {
        branch_id: 'branch_010',
        parent_branch_id: ['branch_006', 'branch_007'],
        children_branch_ids: ['branch_final']
      },
      categoryId: 'cat-1'
    },
    {
      branch_info: {
        branch_id: 'branch_final',
        parent_branch_id: ['branch_008', 'branch_009', 'branch_010'],
        children_branch_ids: [null]
      },
      categoryId: 'cat-1'
    }
  ]
};

function generateLayout(data: GraphData, onRemoveNode?: (nodeId: string) => void) {
  const { categories, nodes: dataNodes } = data;
  
  const nodeMap = new Map(dataNodes.map(n => [n.branch_info.branch_id, n]));
  const inDegree = new Map<string, number>();
  
  dataNodes.forEach(node => {
    inDegree.set(node.branch_info.branch_id, 0);
  });
  
  dataNodes.forEach(node => {
    const children = node.branch_info.children_branch_ids.filter(c => c !== null);
    children.forEach(childId => {
      inDegree.set(childId, (inDegree.get(childId) || 0) + 1);
    });
  });
  
  const roots = dataNodes.filter(n => 
    n.branch_info.parent_branch_id.length === 0 || 
    n.branch_info.parent_branch_id.every(p => p === null)
  );
  
  const levels: string[][] = [];
  const nodeLevel = new Map<string, number>();
  const queue: { id: string; level: number }[] = roots.map(r => ({ 
    id: r.branch_info.branch_id, 
    level: 0 
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
      const children = node.branch_info.children_branch_ids.filter(c => c !== null);
      children.forEach(childId => {
        queue.push({ id: childId, level: level + 1 });
      });
    }
  }
  
  const categoryColors = new Map(categories.map(c => [c.id, c.color]));
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
      type: 'custom',
      data: { label: cat.label, branchId: cat.id, isCategory: true},
      position: { x: 0, y: idx * CATEGORY_SPACING },
      style: {
        backgroundColor: cat.color,
        color: 'white',
        padding: '10px',
        borderRadius: '50% / 50%',
        width: CATEGORY_WIDTH,
        height: CATEGORY_HEIGHT,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
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
      
      // const color = categoryColors.get(node.categoryId) || '#999';
      const color = node.categoryId === '' 
  ? '#90EE90'  // Light green for unconnected nodes
  : (categoryColors.get(node.categoryId) || '#999');

      const x = CATEGORY_WIDTH + 100 + (levelIdx * LEVEL_SPACING);
      const y = nodeIdx * NODE_SPACING + 25;
      
      // reactFlowNodes.push({
      //   id: nodeId,
      //   type: 'custom',
      //   data: { label: '', isCircle: true, branchId: nodeId },
      //   position: { x, y },
      //   style: {
      //     backgroundColor: color,
      //     width: DOC_SIZE,
      //     height: DOC_SIZE,
      //     borderRadius: '50%',
      //     display: 'flex',
      //     alignItems: 'center',
      //     justifyContent: 'center'
      //   }
      // });

      reactFlowNodes.push({
        id: nodeId,
        type: 'custom',
        data: { 
          label: '', 
          isCircle: true, 
          branchId: nodeId,
          categoryParents: node.categoryParents,
          onRemove: onRemoveNode
        },
        position: { x, y },
        style: {
          backgroundColor: color,
          width: DOC_SIZE,
          height: DOC_SIZE,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      });
        
      // if (levelIdx === 0) {
      //   reactFlowEdges.push({
      //     id: `e-${node.categoryId}-${nodeId}`,
      //     source: node.categoryId,
      //     target: nodeId,
      //     type: 'default',
      //     style: { stroke: '#AAAAAA', strokeWidth: 2 }
      //   });
      // }

      // Create edges from all category parents
if (levelIdx === 0) {
  // For root nodes, create edges from all their category parents
  if (node.categoryParents && node.categoryParents.length > 0) {
    node.categoryParents.forEach(catId => {
      reactFlowEdges.push({
        id: `e-${catId}-${nodeId}`,
        source: catId,
        target: nodeId,
        type: 'default',
        style: { stroke: '#AAAAAA', strokeWidth: 2 }
      });
    });
  } else {
    // Fallback to single category if categoryParents not set
    reactFlowEdges.push({
      id: `e-${node.categoryId}-${nodeId}`,
      source: node.categoryId,
      target: nodeId,
      type: 'default',
      style: { stroke: '#AAAAAA', strokeWidth: 2 }
    });
  }
}
      
      const children = node.branch_info.children_branch_ids.filter(c => c !== null);
      children.forEach(childId => {
        reactFlowEdges.push({
          id: `e-${nodeId}-${childId}`,
          source: nodeId,
          target: childId,
          type: 'default',
          style: { stroke: '#AAAAAA', strokeWidth: 2 }
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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);



  const handleRemoveNodeFromDiagram = (nodeId: string) => {
    if (nodeId.startsWith('cat-')) {
      alert('Cannot remove category nodes');
      return;
    }
    
    const updatedData: GraphData = {
      ...graphData,
      nodes: graphData.nodes.filter(n => n.branch_info.branch_id !== nodeId)
    };
    
    updatedData.nodes.forEach(node => {
      node.branch_info.parent_branch_id = node.branch_info.parent_branch_id.filter(
        p => p !== nodeId
      ) as (string | null)[];
      node.branch_info.children_branch_ids = node.branch_info.children_branch_ids.filter(
        c => c !== nodeId
      ) as (string | null)[];
    });
    
    setGraphData(updatedData);
    if (selectedNode === nodeId) {
      setSelectedNode(null);
    }
    
    syncToBackend('REMOVE_NODE', {
      nodeId: nodeId,
      timestamp: new Date().toISOString()
    });
  };

  // Backend sync function
  const syncToBackend = async (action: string, payload: any) => {
    console.log(`Syncing to backend - Action: ${action}`, payload);
    
    try {
      console.log('Backend sync successful');
    } catch (error) {
      console.error('Backend sync failed:', error);
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('New connection established:', params);
      setEdges((eds) => addEdge(params, eds));

      const toast = document.createElement('div');
      toast.textContent = `✅ New connection created between ${params.source} → ${params.target}`;
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.right = '20px';
      toast.style.background = '#333';
      toast.style.color = 'white';
      toast.style.padding = '10px 15px';
      toast.style.borderRadius = '6px';
      toast.style.fontSize = '14px';
      toast.style.opacity = '0.95';
      toast.style.zIndex = '9999';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);

      
      
      // Sync new connection to backend
      syncToBackend('ADD_CONNECTION', {
        source: params.source,
        target: params.target,
        timestamp: new Date().toISOString()
      });
      
      // Update graph data
      setGraphData(prevData => {
        const newData: GraphData = { ...prevData, nodes: [...prevData.nodes] };
        
        // Check if source is a category node
        const isSourceCategory = params.source?.startsWith('cat-');
        
        // Only update branch node relationships if source is not a category
        if (!isSourceCategory) {
          const sourceNode = newData.nodes.find(n => n.branch_info.branch_id === params.source);
          if (sourceNode && params.target) {
            const childrenIds = sourceNode.branch_info.children_branch_ids.filter(
              (id): id is string => id !== null
            );
            if (!childrenIds.includes(params.target)) {
              sourceNode.branch_info.children_branch_ids = [...childrenIds, params.target];
            }
          }
        }
        
        // // Update target node's parent
        // const targetNode = newData.nodes.find(n => n.branch_info.branch_id === params.target);
        // if (targetNode && params.source) {
        //   // If source is a category, set parent to null (root node)
        //   if (isSourceCategory) {
        //     // Also update the category of the target node
        //     targetNode.categoryId = params.source;
        //     // Make sure it's a root node (parent = null)
        //     if (!targetNode.branch_info.parent_branch_id.includes(null)) {
        //       targetNode.branch_info.parent_branch_id = [null];
        //     }
        //   } else {
        //     const parentIds = targetNode.branch_info.parent_branch_id.filter(
        //       (id): id is string => id !== null
        //     );
        //     if (!parentIds.includes(params.source)) {
        //       targetNode.branch_info.parent_branch_id = [...parentIds, params.source];
        //     }
        //   }
        // }

        // Update target node's parent
      const targetNode = newData.nodes.find(n => n.branch_info.branch_id === params.target);
      if (targetNode && params.source) {
        // If source is a category, add it as a parent category (allow multiple)
if (isSourceCategory) {
  // Initialize categoryParents if this is a new unconnected node
  if (!targetNode.categoryParents || targetNode.categoryId === '') {
    targetNode.categoryParents = [];  // Start fresh for unconnected nodes
  }
  if (!targetNode.categoryParents.includes(params.source)) {
    targetNode.categoryParents.push(params.source);
  }
  // Set primary category (changes color from light green)
  targetNode.categoryId = params.source;
          
          // Keep parent_branch_id as null for category connections
          if (!targetNode.branch_info.parent_branch_id.includes(null)) {
            targetNode.branch_info.parent_branch_id = [null];
          }
        } else {
          const parentIds = targetNode.branch_info.parent_branch_id.filter(
            (id): id is string => id !== null
          );
          if (!parentIds.includes(params.source)) {
            targetNode.branch_info.parent_branch_id = [...parentIds, params.source];
          }
        }
      }
        
        return newData;
      });
    },

    
    [setEdges, setGraphData]
  );

  // const getDescendants = (nodeId: string, data: GraphData): Set<string> => {
  //   const descendants = new Set<string>();
  //   const nodeMap = new Map(data.nodes.map(n => [n.branch_info.branch_id, n]));
    
  //   // If it's a category, get all nodes of that category
  //   const category = data.categories.find(c => c.id === nodeId);
  //   if (category) {
  //     data.nodes
  //       .filter(n => n.categoryId === nodeId)
  //       .forEach(n => {
  //         const nodeDescendants = getDescendants(n.branch_info.branch_id, data);
  //         nodeDescendants.forEach(d => descendants.add(d));
  //       });
  //     return descendants;
  //   }
    
  //   const queue = [nodeId];
    
  //   while (queue.length > 0) {
  //     const currentId = queue.shift()!;
  //     descendants.add(currentId);
      
  //     const node = nodeMap.get(currentId);
  //     if (node) {
  //       const children = node.branch_info.children_branch_ids.filter(c => c !== null);
  //       children.forEach(childId => {
  //         if (!descendants.has(childId)) {
  //           queue.push(childId);
  //         }
  //       });
  //     }
  //   }
    
  //   return descendants;
  // };

const getDescendants = (nodeId: string, data: GraphData): Set<string> => {
  const descendants = new Set<string>();
  const nodeMap = new Map(data.nodes.map(n => [n.branch_info.branch_id, n]));
  
  // If it's a category, get all nodes of that category and their descendants
  const category = data.categories.find(c => c.id === nodeId);
  if (category) {
    const categoryNodes = data.nodes.filter(n => {
      // Check if node belongs to this category (either as primary or in categoryParents)
      return n.categoryId === nodeId || 
             (n.categoryParents && n.categoryParents.includes(nodeId));
    });
    
    categoryNodes.forEach(n => {
      descendants.add(n.branch_info.branch_id);
      const nodeDescendants = getDescendantsHelper(n.branch_info.branch_id, nodeMap);
      nodeDescendants.forEach(d => descendants.add(d));
    });
    
    return descendants;
  }
  
  // For regular nodes, get all descendants
  const nodeDescendants = getDescendantsHelper(nodeId, nodeMap);
  nodeDescendants.forEach(d => descendants.add(d));
  
  return descendants;
};

// const getDescendantsHelper = (nodeId: string, nodeMap: Map<string, BranchNode>): Set<string> => {
//   const descendants = new Set<string>();
//   const queue = [nodeId];
  
//   while (queue.length > 0) {
//     const currentId = queue.shift()!;
//     descendants.add(currentId);
    
//     const node = nodeMap.get(currentId);
//     if (node) {
//       const children = node.branch_info.children_branch_ids.filter(c => c !== null);
//       children.forEach(childId => {
//         if (!descendants.has(childId)) {
//           queue.push(childId);
//         }
//       });
//     }
//   }
  
//   return descendants;
// };

const getDescendantsHelper = (nodeId: string, nodeMap: Map<string, BranchNode>): Set<string> => {
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
      children.forEach(childId => {
        if (!visited.has(childId)) {
          queue.push(childId);
        }
      });
    }
  }
  
  return descendants;
};

//   const handleGenerate = (filterFromNode?: string) => {
//     let filteredData = graphData;
//     if (filterFromNode) {
//       const descendants = getDescendants(filterFromNode, graphData);
//       filteredData = {
//         ...graphData,
//         nodes: graphData.nodes.filter((n: any) => descendants.has(n.branch_info.branch_id))
//       };
//     }
    
// const { nodes: newNodes, edges: newEdges } = generateLayout(filteredData, handleRemoveNodeFromDiagram);    setNodes(newNodes);
//     setEdges(newEdges);
//     setFilteredFrom(filterFromNode || null);
//   };

const handleGenerate = (filterFromNode?: string) => {
  let filteredData = graphData;
  let shouldIncludeCategories = false;
  
  if (filterFromNode) {
    const descendants = getDescendants(filterFromNode, graphData);
    
    // Check if filterFromNode is a category
    const isCategory = graphData.categories.find(c => c.id === filterFromNode);
    
    if (isCategory) {
      // When filtering by category, include the category itself
      shouldIncludeCategories = true;
      filteredData = {
        categories: graphData.categories.filter(c => c.id === filterFromNode),
        nodes: graphData.nodes.filter((n: any) => descendants.has(n.branch_info.branch_id))
      };
    } else {
      // For regular nodes, filter nodes and keep all categories
      filteredData = {
        ...graphData,
        nodes: graphData.nodes.filter((n: any) => descendants.has(n.branch_info.branch_id))
      };
    }
  }
  
  const { nodes: newNodes, edges: newEdges } = generateLayout(filteredData, handleRemoveNodeFromDiagram);
  setNodes(newNodes);
  setEdges(newEdges);
  setFilteredFrom(filterFromNode || null);
};

  const onNodeClick = useCallback((_: any, node: Node) => {
    setSelectedNode(node.id);
    handleGenerate(node.id);
  }, [graphData]);

useEffect(() => {
    handleGenerate(filteredFrom || undefined);
  }, [graphData, filteredFrom]);
  
  
  return (
    <div style={{ width: '100%', height: '100vh', background: '#F5F5F5' }}>
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
          nodeColor={(n) => n.style?.backgroundColor as string || '#5D9A5D'}
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
      console.log('Backend sync successful');
    } catch (error) {
      console.error('Backend sync failed:', error);
    }
  };

  // const handleAddNode = () => {
  //   const newBranchId = `branch_${Date.now()}`;
    
  //   // Determine categoryId based on selected node
  //   let categoryId = 'cat-1'; // default
  //   let parentBranchId: (string | null)[] = [null];
    
  //   if (selectedNode) {
  //     // Check if selected node is a category
  //     const isCategory = selectedNode.startsWith('cat-');
      
  //     if (isCategory) {
  //       // If category is selected, use that category
  //       categoryId = selectedNode;
  //       parentBranchId = [null]; // Category nodes start with null parent
  //     } else {
  //       // If regular node is selected, inherit its category and set as parent
  //       const selectedNodeData = graphData.nodes.find(n => n.branch_info.branch_id === selectedNode);
  //       if (selectedNodeData) {
  //         categoryId = selectedNodeData.categoryId;
  //         parentBranchId = [selectedNode];
          
  //         // Also update the selected node's children
  //         selectedNodeData.branch_info.children_branch_ids = [
  //           ...selectedNodeData.branch_info.children_branch_ids.filter(c => c !== null),
  //           newBranchId
  //         ];
  //       }
  //     }
  //   }
    
  //   const newNode: BranchNode = {
  //     branch_info: {
  //       branch_id: newBranchId,
  //       parent_branch_id: parentBranchId,
  //       children_branch_ids: [null]
  //     },
  //     categoryId: categoryId
  //   };
    
  //   const updatedData: GraphData = {
  //     ...graphData,
  //     nodes: [...graphData.nodes, newNode]
  //   };
    
  //   setGraphData(updatedData);
    
  //   syncToBackend('ADD_NODE', {
  //     node: newNode,
  //     timestamp: new Date().toISOString()
  //   });
  // };

  const handleAddNode = () => {
    const newBranchId = `branch_${Date.now()}`;
    
    // Create new node with no category (will be light green until connected to a category)
    const newNode: BranchNode = {
      branch_info: {
        branch_id: newBranchId,
        parent_branch_id: [],
        children_branch_ids: []
      },
      categoryId: '' // Empty categoryId for unconnected nodes
    };
    
    const updatedData: GraphData = {
      ...graphData,
      nodes: [...graphData.nodes, newNode]
    };
    
    setGraphData(updatedData);
    
    syncToBackend('ADD_NODE', {
      node: newNode,
      timestamp: new Date().toISOString()
    });
  };

  const handleRemoveNode = () => {
    if (!selectedNode) {
      alert('Please select a node first by clicking on it');
      return;
    }
    
    if (selectedNode.startsWith('cat-')) {
      alert('Cannot remove category nodes');
      return;
    }
    
    const updatedData: GraphData = {
      ...graphData,
      nodes: graphData.nodes.filter(n => n.branch_info.branch_id !== selectedNode)
    };
    
    updatedData.nodes.forEach(node => {
      node.branch_info.parent_branch_id = node.branch_info.parent_branch_id.filter(
        p => p !== selectedNode
      ) as (string | null)[];
      node.branch_info.children_branch_ids = node.branch_info.children_branch_ids.filter(
        c => c !== selectedNode
      ) as (string | null)[];
    });
    
    setGraphData(updatedData);
    setSelectedNode(null);
    
    syncToBackend('REMOVE_NODE', {
      nodeId: selectedNode,
      timestamp: new Date().toISOString()
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
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
      }}
    >
      {/* Sidebar on the left */}
       <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
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
            {/* <a
              href="/"
              style={{
                color: "#9333EA",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              Go back to Home Page
            </a> */}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {filteredFrom && (
              <button 
                onClick={handleResetView}
                style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                }}
                onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
                }}
              >
                Reset View
              </button>
            )}

            <button 
              onClick={handleAddNode}
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
              }}
            >
              <Plus size={18} />
              Add Node
            </button>
            
            <button 
              onClick={handleRemoveNode}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
              }}
            >
              <Trash2 size={18} />
              Remove Node
            </button>

            {selectedNode && (
              <div style={{
                fontSize: '13px',
                color: '#666',
                marginLeft: '8px',
                padding: '8px 12px',
                background: '#F3F4F6',
                borderRadius: '6px',
              }}>
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
