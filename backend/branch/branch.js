// Branch graph implementation - nodes can have multiple previous and next nodes.
// Designed like a doubly-linked list but generalized to allow multiple parents/children.
// Provides safe linking, unlinking, traversal, and serialization utilities.

class BranchNode {
  // Each node stores the full resume object (the parsed JSON).
  // id should be the resume's top-level `resume_id` (legacy: metadata.resume_info.resume_id)
  constructor(id, resume = {}) {
    if (!id) throw new Error('BranchNode requires an id');
    this.id = id;
    this.resume = resume;
    this.prev = new Set();
    this.next = new Set();
  }

  toJSON() {
    return {
      resume: this.resume,
    };
  }
}

class BranchGraph {
  constructor() {
    this.nodes = new Map();
  }

  createNode(id, resume = {}) {
    if (this.nodes.has(id)) throw new Error(`Node with id ${id} already exists`);
    const node = new BranchNode(id, resume);
    this.nodes.set(id, node);
    return node;
  }

  getNode(id) {
    return this.nodes.get(id) || null;
  }

  hasNode(id) {
    return this.nodes.has(id);
  }

  link(prevId, nextId) {
    const prev = this.getNode(prevId);
    const next = this.getNode(nextId);
    if (!prev) throw new Error(`prev node ${prevId} not found`);
    if (!next) throw new Error(`next node ${nextId} not found`);
    prev.next.add(nextId);
    next.prev.add(prevId);
    return true;
  }

  unlink(prevId, nextId) {
    const prev = this.getNode(prevId);
    const next = this.getNode(nextId);
    if (!prev || !next) return false;
    prev.next.delete(nextId);
    next.prev.delete(prevId);
    return true;
  }

  removeNode(id) {
    const node = this.getNode(id);
    if (!node) return false;
    // unlink from prevs
    for (const p of node.prev) {
      const pn = this.getNode(p);
      if (pn) pn.next.delete(id);
    }
    // unlink from nexts
    for (const n of node.next) {
      const nn = this.getNode(n);
      if (nn) nn.prev.delete(id);
    }
    this.nodes.delete(id);
    return true;
  }

  // traverse forward from a start node id (BFS), optional maxDepth to avoid runaway loops
  traverseForward(startId, { visited = new Set(), maxDepth = 1000 } = {}) {
    const results = [];
    const queue = [{ id: startId, depth: 0 }];
    while (queue.length) {
      const { id, depth } = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      const node = this.getNode(id);
      if (!node) continue;
      results.push(node);
      if (depth >= maxDepth) continue;
      for (const nxt of node.next) queue.push({ id: nxt, depth: depth + 1 });
    }
    return results;
  }

  // traverse backward from a start node id (BFS)
  traverseBackward(startId, { visited = new Set(), maxDepth = 1000 } = {}) {
    const results = [];
    const queue = [{ id: startId, depth: 0 }];
    while (queue.length) {
      const { id, depth } = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      const node = this.getNode(id);
      if (!node) continue;
      results.push(node);
      if (depth >= maxDepth) continue;
      for (const prv of node.prev) queue.push({ id: prv, depth: depth + 1 });
    }
    return results;
  }

  // find path from source to target (BFS), returns array of node ids
  findPath(sourceId, targetId, { maxDepth = 1000 } = {}) {
    if (sourceId === targetId) return [sourceId];
    const queue = [[sourceId]];
    const visited = new Set([sourceId]);
    while (queue.length) {
      const path = queue.shift();
      if (path.length > maxDepth) continue;
      const last = path[path.length - 1];
      const node = this.getNode(last);
      if (!node) continue;
      for (const nxt of node.next) {
        if (visited.has(nxt)) continue;
        if (nxt === targetId) return [...path, nxt];
        visited.add(nxt);
        queue.push([...path, nxt]);
      }
    }
    return null; // no path
  }

  // detect cycles using DFS
  detectCycles() {
    const white = new Set(this.nodes.keys());
    const gray = new Set();
    const black = new Set();

    const cycles = [];

    const dfs = (id, stack = []) => {
      white.delete(id);
      gray.add(id);
      stack.push(id);
      const node = this.getNode(id);
      if (node) {
        for (const nxt of node.next) {
          if (black.has(nxt)) continue;
          if (gray.has(nxt)) {
            // found cycle
            const idx = stack.indexOf(nxt);
            cycles.push(stack.slice(idx).concat(nxt));
          } else if (white.has(nxt)) {
            dfs(nxt, stack.slice());
          }
        }
      }
      gray.delete(id);
      black.add(id);
    };

    while (white.size) dfs(white.values().next().value);
    return cycles; // empty if no cycles
  }

  // serialize graph
  toJSON() {
    return {
      nodes: Array.from(this.nodes.values()).map(n => n.toJSON()),
    };
  }

  // load from serialized structure
  static fromJSON(obj) {
    const g = new BranchGraph();
    if (!obj || !Array.isArray(obj.nodes)) return g;
    for (const n of obj.nodes) {
      const node = new BranchNode(n.id, n.resume || {});
      g.nodes.set(node.id, node);
    }
    for (const n of obj.nodes) {
      const node = g.getNode(n.id);
      for (const p of (n.prev || [])) node.prev.add(p);
      for (const nx of (n.next || [])) node.next.add(nx);
    }
    return g;
  }

  // Build graph from one or more resume JSON objects. Each resume object should contain
  // a top-level resume_id and metadata.branch_info.parent_resume_id / children_resume_ids
  static fromResumes(resumeObjs = []) {
    const g = new BranchGraph();
    // First pass: create nodes
    for (const r of resumeObjs) {
      try {
        const id = r.resume_id;
        if (!id) continue;
        g.createNode(id, r);
      } catch (e) {
        // skip duplicates or invalid
      }
    }
    // Second pass: connect edges using branch_info
    for (const r of resumeObjs) {
      const id = r.resume_id;
      if (!id) continue;
      const branchInfo = r.metadata && r.metadata.branch_info;
      if (!branchInfo) continue;
      // parent_resume_id may be array
      const parents = Array.isArray(branchInfo.parent_resume_id) ? branchInfo.parent_resume_id : [branchInfo.parent_resume_id];
      const children = Array.isArray(branchInfo.children_resume_ids) ? branchInfo.children_resume_ids : [branchInfo.children_resume_ids];
      for (const p of parents) {
        if (p && g.hasNode(p)) {
          g.link(p, id);
        }
      }
      for (const c of children) {
        if (c && g.hasNode(c)) {
          g.link(id, c);
        }
      }
    }
    return g;
  }
}

module.exports = { BranchGraph, BranchNode };
