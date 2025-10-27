const fs = require('fs');
const path = require('path');
const { BranchGraph } = require('./branch');

function demo() {

  const r1 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'resume-generator', 'allenzheng-resume.json'), 'utf8'));
  const r2 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'resume-generator', 'allenzheng-resume2.json'), 'utf8'));
  const r3 = JSON.parse(fs.readFileSync(path.resolve(__dirname, '..', 'resume-generator', 'allenzheng-resume3.json'), 'utf8'));

  const g = BranchGraph.fromResumes([r1, r2, r3]);

  console.log('\nGraph serialized (nodes):');
  console.log(JSON.stringify(g.toJSON(), null, 2));

  console.log('\nNode ids in graph:', Array.from(g.nodes.keys()));

  const startId = r1.metadata.resume_info.resume_id;
  console.log(`\nTraverse forward from ${startId}:`, g.traverseForward(startId).map(n => n.id));

  const endId = r3.metadata.resume_info.resume_id;
  console.log(`\nTraverse backward from ${endId}:`, g.traverseBackward(endId).map(n => n.id));

  console.log('\nFind path between resumes:', g.findPath(startId, endId));

  console.log('\nDetect cycles:' , g.detectCycles());

  const extra = JSON.parse(JSON.stringify(r3));
  extra.metadata.resume_info.resume_id = '000004';
  g.createNode('000004', extra);
  g.link(endId, '000004');
  console.log('\nAfter adding 000004 and linking from', endId, '-> 000004');
  console.log(Array.from(g.nodes.keys()));
  console.log('Path', startId, '->', '000004', ':', g.findPath(startId, '000004'));
}

if (require.main === module) demo();

module.exports = demo;
