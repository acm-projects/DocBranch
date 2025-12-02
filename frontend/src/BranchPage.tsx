import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';

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
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Trash2, X } from 'lucide-react';

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

interface Profile {
  user_id: string;
  [key: string]: any;
}

const API_BASE_URL = 'http://localhost:3000';
const TEST_USER_ID = '000000';

// Custom Node Component matching the design
const CustomNode = ({ data, isConnectable }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const isCategory = data.isCategory;
  
  const lightenColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const lighten = (val: number) => Math.min(255, val + 30);
    return `#${lighten(r).toString(16).padStart(2, '0')}${lighten(g).toString(16).padStart(2, '0')}${lighten(b).toString(16).padStart(2, '0')}`;
  };

  const baseColor = isCategory ? '#10B981' : '#10B981';
  const backgroundColor = isHovered ? lightenColor(baseColor) : baseColor;

  if (isCategory) {
    return (
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
          // This allows the pseudo “caps” to overflow
          overflow: "visible",

        }}
      >
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{
            background: '#555',
            width: '8px',
            height: '8px',
            right: '-4px',
          }}
        />
        {data.label}

      </div>

      
    );
  }

  // return (
  //   <div
  //     onMouseEnter={() => setIsHovered(true)}
  //     onMouseLeave={() => setIsHovered(false)}
  //     style={{
  //       position: 'relative',
  //       width: '50px',
  //       height: '50px',
  //       borderRadius: '50%',
  //       backgroundColor,
  //       cursor: 'pointer',
  //       transition: 'all 0.2s ease',
  //       boxShadow: isHovered ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 2px 8px rgba(16, 185, 129, 0.3)',
  //       transform: isHovered ? 'scale(1.1)' : 'scale(1)',
  //     }}
      
  //   >
  //     <Handle
  //       type="target"
  //       position={Position.Left}
  //       isConnectable={isConnectable}
  //       style={{
  //         background: '#555',
  //         width: '8px',
  //         height: '8px',
  //         left: '-4px',
  //       }}
  //     />
  //     <Handle
  //       type="source"
  //       position={Position.Right}
  //       isConnectable={isConnectable}
  //       style={{
  //         background: '#555',
  //         width: '8px',
  //         height: '8px',
  //         right: '-4px',
  //       }}
  //     />
      
  //     {isHovered && data.resumeId && (
  //       <div
  //         style={{
  //           position: 'absolute',
  //           top: '-60px',
  //           left: '50%',
  //           transform: 'translateX(-50%)',
  //           backgroundColor: '#333',
  //           color: 'white',
  //           padding: '8px 12px',
  //           borderRadius: '6px',
  //           fontSize: '12px',
  //           whiteSpace: 'nowrap',
  //           zIndex: 1000,
  //           pointerEvents: 'none',
  //           boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  //         }}
  //       >
  //         <div style={{ fontWeight: 'bold' }}>{data.resumeId}</div>
  //         <div style={{ fontSize: '11px', opacity: 0.9 }}>
  //           {data.createdDate || 'No date'}
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );

  return (
  <div
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    style={{
      position: 'relative',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor,
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      boxShadow: isHovered
        ? '0 4px 12px rgba(16, 185, 129, 0.4)'
        : '0 2px 8px rgba(16, 185, 129, 0.3)',
      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    }}
  >
    {/* Handles */}
    <Handle
      type="target"
      position={Position.Left}
      isConnectable={isConnectable}
      style={{
        background: '#555',
        width: '8px',
        height: '8px',
        left: '-4px',
      }}
    />
    <Handle
      type="source"
      position={Position.Right}
      isConnectable={isConnectable}
      style={{
        background: '#555',
        width: '8px',
        height: '8px',
        right: '-4px',
      }}
    />

    {/* Tooltip */}
    {isHovered && data.resumeId && (
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ fontWeight: 'bold' }}>{data.fileName}</div>
        <div style={{ fontSize: '11px', opacity: 0.9 }}>
          {data.createdDate || 'No date'}
        </div>
      </div>
    )}

    {/* DELETE BUTTON (only when hovered) */}
    {isHovered && (
      <button
        // onClick={handleRemoveNode}
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
  </div>
);

};

const nodeTypes = { custom: CustomNode };

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
  const [newCategoryName, setNewCategoryName] = useState('');


  // Check if modal should open on mount
useEffect(() => {
  if (location.state?.openModal) {
    setIsModalOpen(true);

    // prevent modal re-opening when refreshing
    window.history.replaceState(
      { ...location.state, openModal: false },
      ""
    );
  }
}, [location.state]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  
  const createFlowElements = (resumes: Resume[]): { nodes: Node[]; edges: Edge[] } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map<string, Resume>();

    if (!Array.isArray(resumes) || resumes.length === 0) {
      return { nodes: [], edges: [] };
    }

    console.log('Creating flow elements for', resumes.length, 'resumes');

    resumes.forEach((resume: Resume) => {
      if (!resume || !resume.resume_id) return;
      console.log('Resume:', resume.resume_id, {
        parents: resume.metadata?.branch_info?.parent_resume_ids,
        children: resume.metadata?.branch_info?.children_resume_ids
      });
      nodeMap.set(resume.resume_id, resume);
    });

    // Create category nodes
    const categories = [
      { id: 'cat-fullstack', label: 'FULL STACK', color: '#10B981' },
      { id: 'cat-aiml', label: 'AI/ML', color: '#10B981' },
      { id: 'cat-internship', label: 'INTERNSHIP', color: '#10B981' },
      { id: 'cat-leadership', label: 'LEADERSHIP', color: '#10B981' }
    ];

    const CATEGORY_SPACING = 120;
    categories.forEach((cat, idx) => {
      nodes.push({
        id: cat.id,
        type: 'custom',
        data: { label: cat.label, isCategory: true },
        position: { x: 0, y: idx * CATEGORY_SPACING },
        draggable: false,
      });
    });

    // Build hierarchy - fix inconsistencies by building from both directions
    const childrenMap = new Map<string, string[]>();
    const parentsMap = new Map<string, string[]>();
    
    resumes.forEach((resume: Resume) => {
      const resumeId = resume.resume_id;
      const childIds = resume.metadata?.branch_info?.children_resume_ids || [];
      const validChildren = childIds.filter((id): id is string => id !== null);
      childrenMap.set(resumeId, validChildren);
      
      const parentIds = resume.metadata?.branch_info?.parent_resume_ids || [];
      const validParents = parentIds.filter((id): id is string => id !== null);
      parentsMap.set(resumeId, validParents);
    });

    // Fix inconsistencies: if a node claims X as parent, make sure X has this node as child
    resumes.forEach((resume: Resume) => {
      const resumeId = resume.resume_id;
      const parents = parentsMap.get(resumeId) || [];
      
      parents.forEach(parentId => {
        const parentChildren = childrenMap.get(parentId) || [];
        if (!parentChildren.includes(resumeId)) {
          console.log(`Fixing: Adding ${resumeId} as child of ${parentId}`);
          childrenMap.set(parentId, [...parentChildren, resumeId]);
        }
      });
    });

    console.log('Children map (fixed):', Object.fromEntries(childrenMap));
    console.log('Parents map:', Object.fromEntries(parentsMap));

    // Find root nodes (nodes with no parents)
    const roots = resumes.filter((resume: Resume) => {
      const parents = parentsMap.get(resume.resume_id) || [];
      return parents.length === 0;
    });

    console.log('Found', roots.length, 'root nodes');

    // Layout algorithm
    const positioned = new Set<string>();
    const levelWidth = 150;
    const levelHeight = 80;
    let categoryOffset = 0;

    const positionSubtree = (nodeId: string, x: number, y: number, level: number): number => {
      const resume = nodeMap.get(nodeId);
      if (!resume) {
        console.warn('Resume not found for nodeId:', nodeId);
        return 0;
      }
      
      if (positioned.has(nodeId)) {
        console.log('Node already positioned:', nodeId);
        return 0;
      }

      const resumeId = resume.resume_id;
      const createdDate = resume.metadata?.branch_info?.created_date 
        ? new Date(resume.metadata.branch_info.created_date).toLocaleDateString()
        : '';
      const fileName = resume.metadata?.resume_info?.filename

      nodes.push({
        id: resumeId,
        type: 'custom',
        data: { 
          resumeId,
          createdDate,
          isCategory: false,
          fileName,
        },
        position: { x, y },
        draggable: true,
      });

      positioned.add(nodeId);
      console.log('Positioned node:', nodeId, 'at level', level);

      // Connect to category for root nodes
      if (level === 0) {
        const categoryId = categories[Math.min(categoryOffset, categories.length - 1)].id;
        edges.push({
          id: `e-${categoryId}-${resumeId}`,
          source: categoryId,
          target: resumeId,
          type: 'default',
          animated: false,
          style: { stroke: '#AAAAAA', strokeWidth: 2 }
        });
      }

      const children = childrenMap.get(nodeId) || [];
      console.log('Node', nodeId, 'has', children.length, 'children:', children);
      
      if (children.length === 0) return 1;

      let currentY = y - (children.length - 1) * levelHeight / 2;
      let totalHeight = 0;
      
      children.forEach((childId: string) => {
        const childHeight = positionSubtree(childId, x + levelWidth, currentY, level + 1);
        currentY += childHeight * levelHeight;
        totalHeight += childHeight;

        edges.push({
          id: `e-${nodeId}-${childId}`,
          source: nodeId,
          target: childId,
          type: 'default',
          animated: false,
          style: { stroke: '#AAAAAA', strokeWidth: 2 }
        });
      });

      return Math.max(totalHeight, 1);
    };

    // Position each root tree
    let startY = 50;
    roots.forEach((root: Resume) => {
      const treeHeight = positionSubtree(root.resume_id, 250, startY, 0);
      startY += treeHeight * levelHeight + 50; // Add spacing between trees
      categoryOffset++;
    });

    console.log('Total nodes positioned:', positioned.size);
    console.log('Total nodes created:', nodes.length - categories.length, '(excluding categories)');
    console.log('Total edges created:', edges.length);

    return { nodes, edges };
  };

  const fetchResumes = async (): Promise<void> => {
    if (!selectedUserId) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/resumes/${selectedUserId}`);
      if (!response.ok) throw new Error('Failed to fetch resumes');
      
      const data = await response.json();
      
      if (data.err) {
        throw new Error(data.err);
      }
      
      // Handle DynamoDB response format
      let fetchedResumes: Resume[] = [];
      if (data.Items && Array.isArray(data.Items)) {
        fetchedResumes = data.Items;
      } else if (Array.isArray(data)) {
        fetchedResumes = data;
      } else if (data) {
        fetchedResumes = [data];
      }
      
      // Filter valid resumes
      fetchedResumes = fetchedResumes.filter((resume: Resume) => {
        const hasValidUserId = resume.user_id && 
                               resume.user_id !== '' && 
                               resume.user_id !== 'string';
        const hasValidResumeId = resume.resume_id && 
                                 resume.resume_id !== '' && 
                                 resume.resume_id !== 'string';
        return hasValidUserId && hasValidResumeId;
      });
      
      if (fetchedResumes.length === 0) {
        setError('No valid resumes found for this user');
        setNodes([]);
        setEdges([]);
        setResumes([]);
        return;
      }
      
      setResumes(fetchedResumes);
      const { nodes: flowNodes, edges: flowEdges } = createFlowElements(fetchedResumes);
      setNodes(flowNodes);
      setEdges(flowEdges);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [selectedUserId, setNodes, setEdges]);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (!node.data.isCategory) {
      setSelectedNode(node.id);
    }
  }, []);


    const handleAddCategory = () => {
  if (!newCategoryName.trim()) {
    alert("Please enter a category name");
    return;
  }

  // Generate a unique ID for the category
  const categoryId = `cat-${newCategoryName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

  const newCategoryNode: Node = {
    id: categoryId,
    type: 'custom',
    data: { label: newCategoryName, isCategory: true },
    position: { x: 0, y: nodes.length * 120 }, // simple vertical stacking
    draggable: false,
  };

  setNodes((prev) => [...prev, newCategoryNode]);
  setIsModalOpen(false);
  setNewCategoryName('');
};


  const handleAddNode = async () => {
    if (!selectedNode) {
      alert('Please select a node first by clicking on it');
      return;
    }

    if (selectedNode.startsWith('cat-')) {
      alert('Cannot add children to category nodes. Please select a resume node.');
      return;
    }

    try {
      // Generate new resume ID
      const newResumeId = `${String(resumes.length + 1).padStart(6, '0')}`;
      
      // Create new resume object
      const newResume: Resume = {
        user_id: selectedUserId,
        resume_id: newResumeId,
        resume: {
          personal_information: {
            name: '',
            phone: '',
            email: '',
            location: '',
            links: []
          },
          projects: [],
          education: [],
          leadership_experience: [],
          skills: {
            programming_languages: [],
            frameworks: [],
            developer_tools: [],
            languages: []
          }
        },
        metadata: {
          resume_info: {
            resume_creation_date: new Date().toISOString().split('T')[0],
            filename: `Resume_${newResumeId}.pdf`,
            template_used: 'jakes_resume',
            section_order: ['education', 'projects', 'skills']
          },
          branch_info: {
            parent_resume_ids: [selectedNode],
            children_resume_ids: [],
            created_date: new Date().toISOString(),
            last_modified: new Date().toISOString()
          }
        }
      };

      console.log('Creating new resume:', newResume);

      // POST new resume to backend
      const response = await fetch(`${API_BASE_URL}/resumes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResume)
      });

      if (!response.ok) {
        throw new Error('Failed to create resume');
      }

      const result = await response.json();
      console.log('Resume created:', result);

      // Update parent's children_resume_ids
      const parentResume = resumes.find(r => r.resume_id === selectedNode);
      if (parentResume) {
        const updatedParent = {
          ...parentResume,
          metadata: {
            ...parentResume.metadata,
            branch_info: {
              ...parentResume.metadata.branch_info,
              children_resume_ids: [
                ...parentResume.metadata.branch_info.children_resume_ids.filter(id => id !== null),
                newResumeId
              ],
              last_modified: new Date().toISOString()
            }
          }
        };

        console.log('Updating parent resume:', updatedParent);

        const updateResponse = await fetch(`${API_BASE_URL}/resumes/${selectedUserId}/${selectedNode}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedParent)
        });

        if (!updateResponse.ok) {
          console.error('Failed to update parent resume');
        }
      }

      // Refresh the view
      alert(`✅ New resume ${newResumeId} created as child of ${selectedNode}`);
      await fetchResumes();
      setSelectedNode(newResumeId);

    } catch (err) {
      console.error('Error adding node:', err);
      alert(`Failed to add node: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleRemoveNode = async () => {
    if (!selectedNode) {
      alert('Please select a node first by clicking on it');
      return;
    }

    if (selectedNode.startsWith('cat-')) {
      alert('Cannot remove category nodes');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete resume ${selectedNode}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      console.log('Starting delete process for:', selectedNode);
      
      const resumeToDelete = resumes.find(r => r.resume_id === selectedNode);
      if (!resumeToDelete) {
        throw new Error('Resume not found');
      }

      console.log('Resume to delete:', resumeToDelete);

      // Update parent's children_resume_ids (remove this node)
      const parentIds = resumeToDelete.metadata.branch_info.parent_resume_ids.filter(
        (id): id is string => id !== null
      );

      console.log('Parent IDs to update:', parentIds);

      for (const parentId of parentIds) {
        const parentResume = resumes.find(r => r.resume_id === parentId);
        if (parentResume) {
          const updatedParent = {
            ...parentResume,
            metadata: {
              ...parentResume.metadata,
              branch_info: {
                ...parentResume.metadata.branch_info,
                children_resume_ids: parentResume.metadata.branch_info.children_resume_ids.filter(
                  id => id !== selectedNode
                ),
                last_modified: new Date().toISOString()
              }
            }
          };

          console.log('Updating parent:', parentId);
          const parentResponse = await fetch(`${API_BASE_URL}/resumes/${selectedUserId}/${parentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedParent)
          });

          console.log('Parent update response:', parentResponse.status, await parentResponse.text());
        }
      }

      // Update children's parent_resume_ids (remove this node)
      const childIds = resumeToDelete.metadata.branch_info.children_resume_ids.filter(
        (id): id is string => id !== null
      );

      console.log('Child IDs to update:', childIds);

      for (const childId of childIds) {
        const childResume = resumes.find(r => r.resume_id === childId);
        if (childResume) {
          const updatedChild = {
            ...childResume,
            metadata: {
              ...childResume.metadata,
              branch_info: {
                ...childResume.metadata.branch_info,
                parent_resume_ids: childResume.metadata.branch_info.parent_resume_ids.filter(
                  id => id !== selectedNode
                ),
                last_modified: new Date().toISOString()
              }
            }
          };

          console.log('Updating child:', childId);
          const childResponse = await fetch(`${API_BASE_URL}/resumes/${selectedUserId}/${childId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedChild)
          });

          console.log('Child update response:', childResponse.status, await childResponse.text());
        }
      }

      // DELETE the resume
      console.log('Deleting resume:', selectedNode);
      console.log('DELETE URL:', `${API_BASE_URL}/resumes/${selectedUserId}/${selectedNode}`);
      
      const deleteResponse = await fetch(`${API_BASE_URL}/resumes/${selectedUserId}/${selectedNode}`, {
        method: 'DELETE'
      });

      console.log('Delete response status:', deleteResponse.status);
      const deleteResult = await deleteResponse.text();
      console.log('Delete response body:', deleteResult);

      if (!deleteResponse.ok) {
        throw new Error(`Failed to delete resume: ${deleteResponse.status} - ${deleteResult}`);
      }

      // Refresh the view
      alert(`✅ Resume ${selectedNode} deleted successfully`);
      setSelectedNode(null);
      await fetchResumes();

    } catch (err) {
      console.error('Error removing node:', err);
      alert(`Failed to remove node: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px', color: '#10B981' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' }}>
        <div style={{ textAlign: 'center', color: '#ef4444' }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>Error</div>
          <div>{error}</div>
        </div>
      </div>
    );
  }



  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F3F4F6' }}>
      {/*Sidebar*/}
       <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderBottom: '1px solid #E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#10B981',
              margin: 0,
            }}>
              Branch View
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={handleAddNode}
              disabled={!selectedNode || selectedNode.startsWith('cat-')}
              style={{
                background: selectedNode && !selectedNode.startsWith('cat-') 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : '#d1d5db',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: selectedNode && !selectedNode.startsWith('cat-') ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: selectedNode && !selectedNode.startsWith('cat-') 
                  ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                  : 'none',
                transition: 'all 0.2s ease',
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
              disabled={!selectedNode || selectedNode.startsWith('cat-')}
              style={{
                background: selectedNode && !selectedNode.startsWith('cat-')
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : '#d1d5db',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                cursor: selectedNode && !selectedNode.startsWith('cat-') ? 'pointer' : 'not-allowed',
                fontSize: '14px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: selectedNode && !selectedNode.startsWith('cat-')
                  ? '0 2px 8px rgba(239, 68, 68, 0.3)'
                  : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Trash2 size={18} />
              Remove Node
            </button>

            {selectedNode && (
              <div style={{
                fontSize: '13px',
                color: '#666',
                padding: '8px 12px',
                background: '#F3F4F6',
                borderRadius: '6px',
              }}>
                Selected: <strong>{selectedNode}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Flow Diagram */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          flex: 1,
          margin: '20px',
          overflow: 'hidden',
        }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            minZoom={0.2}
            maxZoom={4}
          >
            <MiniMap
              nodeStrokeWidth={3}
              nodeColor={(n) => '#10B981'}
            />
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={16} color="#aaa" />
          </ReactFlow>
        </div>

        {/* Modal */}
       {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "1rem",
              padding: "2rem",
              maxWidth: "500px",
              width: "90%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
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
                  fontWeight: "600",
                  color: "#111827",
                  margin: 0,
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
              >
                Create new branch
              </h3>
              <button
                onClick={handleCloseModal}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.25rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "0.375rem",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <X size={20} color="#6b7280" />
              </button>
            </div>

            <p
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginBottom: "1.5rem",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              }}
            >
              Enter branch name 
            </p>

            <textarea
              placeholder="Enter branch name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={{
                width: "100%",
                minHeight: "50px",
                padding: "0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #d1d5db",
                fontSize: "0.875rem",
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
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
                onClick={handleCloseModal}
                style={{
                  padding: "0.625rem 1.5rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "1px solid #d1d5db",
                  backgroundColor: "white",
                  color: "#374151",
                  cursor: "pointer",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f9fafb")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "white")
                }
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                style={{
                  padding: "0.625rem 1.5rem",
                  borderRadius: "0.5rem",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  border: "1px solid #10b981",
                  backgroundColor: "#10b981",
                  color: "white",
                  cursor: "pointer",
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#059669")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#10b981")
                }
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