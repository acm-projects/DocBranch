import Sidebar from './Sidebar';

import React, { useState, useCallback } from 'react';
import ReactFlow, {
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Trash2 } from 'lucide-react';

const lightenColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const lighten = (val: number) => Math.min(255, val + 30);
  return `#${lighten(r).toString(16).padStart(2, '0')}${lighten(g).toString(16).padStart(2, '0')}${lighten(b).toString(16).padStart(2, '0')}`;
};

const CustomNode = React.memo(({ data, isConnectable }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCategory = !!data.isCategory;
  const baseColor = data.color || '#10B981';
  const backgroundColor = isHovered ? lightenColor(baseColor) : baseColor;
  const [collapsed, setCollapsed] = useState(false);

  return isCategory ? (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor,
        color: 'white',
        padding: '12px 24px',
        borderRadius: '40px',
        fontSize: '14px',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
        minWidth: '140px',
        textAlign: 'center',
      }}
    >
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        style={{ background: '#555', width: 8, height: 8, right: -4 }}
      />
      {data.label}
    </div>
  ) : (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: 50,
        height: 50,
        borderRadius: '50%',
        backgroundColor,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isHovered ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(16, 185, 129, 0.3)',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
      }}
    >
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} style={{ background: '#555', width: 8, height: 8, left: -4 }} />
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} style={{ background: '#555', width: 8, height: 8, right: -4 }} />

      {isHovered && data.label && (
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: 6,
            fontSize: 12,
            whiteSpace: 'nowrap',
            zIndex: 1000,
            pointerEvents: 'none',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {data.label}
        </div>
      )}
    </div>
  );
});

const nodeTypes = { custom: CustomNode };

const SimplifiedResumeTree: React.FC = () => {
  const initialNodes: Node[] = [
    // Category 1
    {
      id: 'cat-1',
      type: 'custom',
      data: { label: 'FULL STACK', isCategory: true, color: '#10B981' },
      position: { x: 0, y: 0 },
      draggable: false
    },
    // Category 2
    {
      id: 'cat-2',
      type: 'custom',
      data: { label: 'AI/ML', isCategory: true, color: '#10B981' },
      position: { x: 0, y: 120 },
      draggable: false
    },
    // Category 1 resumes
    { id: 'resume-1', type: 'custom', data: { label: 'Resume 1', color: '#10B981' }, position: { x: 250, y: -100 }, draggable: true },
    { id: 'resume-2', type: 'custom', data: { label: 'Resume 2', color: '#10B981' }, position: { x: 250, y: -30 }, draggable: true },
    { id: 'resume-3', type: 'custom', data: { label: 'Resume 3', color: '#10B981' }, position: { x: 250, y: 40 }, draggable: true },
    { id: 'resume-4', type: 'custom', data: { label: 'Resume 4', color: '#10B981' }, position: { x: 250, y: 110 }, draggable: true },
    { id: 'resume-5', type: 'custom', data: { label: 'Resume 5 (Shared)', color: '#10B981' }, position: { x: 250, y: 180 }, draggable: true },
    // Category 2 resumes
    { id: 'resume-6', type: 'custom', data: { label: 'Resume 6', color: '#10B981' }, position: { x: 250, y: 250 }, draggable: true },
  ];

  const initialEdges: Edge[] = [
    // Category 1 edges
    { id: 'e-cat1-r1', source: 'cat-1', target: 'resume-1', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
    { id: 'e-cat1-r2', source: 'cat-1', target: 'resume-2', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
    { id: 'e-cat1-r3', source: 'cat-1', target: 'resume-3', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
    { id: 'e-cat1-r4', source: 'cat-1', target: 'resume-4', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
    { id: 'e-cat1-r5', source: 'cat-1', target: 'resume-5', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
    // Category 2 edges (including shared resume)
    { id: 'e-cat2-r5', source: 'cat-2', target: 'resume-5', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
    { id: 'e-cat2-r6', source: 'cat-2', target: 'resume-6', type: 'default', style: { stroke: '#AAAAAA', strokeWidth: 2 } },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeCounter, setNodeCounter] = useState(7);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (!node.data?.isCategory) {
      setSelectedNode(node.id);
    }
  }, []);

  const handleAddNode = () => {
    const newNodeId = `resume-${nodeCounter}`;
    const newNode: Node = {
      id: newNodeId,
      type: 'custom',
      data: { label: `Resume ${nodeCounter}`, color: '#90EE90' }, // Light green
      position: { x: 500, y: nodeCounter * 70 },
      draggable: true
    };
    
    setNodes(prev => [...prev, newNode]);
    setNodeCounter(prev => prev + 1);
    setSelectedNode(newNodeId);
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

    setNodes(prev => prev.filter(node => node.id !== selectedNode));
    setEdges(prev => prev.filter(edge => edge.source !== selectedNode && edge.target !== selectedNode));
    setSelectedNode(null);
  };

  const handleConnect = useCallback(
    (connection: Connection) => {
      const { source, target } = connection;

      if (!source || !target) return;

      const sourceIsCategory = source.startsWith('cat-');
      const targetIsCategory = target.startsWith('cat-');

      if ((sourceIsCategory && targetIsCategory) || (!sourceIsCategory && targetIsCategory)) {
        alert("❌ Cannot connect to a category node as target.");
        return;
      }

      // If connecting from category to a light green node, change it to regular green
      if (sourceIsCategory) {
        setNodes(prev => prev.map(node => {
          if (node.id === target && node.data && (node.data as any).color === '#90EE90') {
            return {
              ...node,
              data: { ...node.data, color: '#10B981' }
            };
          }
          return node;
        }));
      }

      setEdges(prev => [
        ...prev,
        {
          id: `e-${source}-${target}`,
          source,
          target,
          type: "default",
          animated: false,
          style: { stroke: "#AAAAAA", strokeWidth: 2 }
        }
      ]);
    },
    [setNodes, setEdges]
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
    {/* <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} /> */}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div
          style={{
            padding: '12px 16px',
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px'
          }}
        >
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
            <Plus size={16} /> Add Node
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
            <Trash2 size={16} /> Remove Node
          </button>
        </div>

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
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={16} color="#aaa" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default SimplifiedResumeTree;
