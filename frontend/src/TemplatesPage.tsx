import { Link } from 'react-router-dom';


import { useState } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Background,
  Controls,
  MiniMap,
} from "reactflow";

import type {
  Connection,
  Edge,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";


function TemplatesPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-purple-600 mb-4">Templates Page!</h2>
      <p>This is ur template content</p>
      {/* Add your actual compare functionality here */}

      <Link
          to="/"
        >
          Go back to Home Page
        </Link>
    </div>
  );
}

export default TemplatesPage;