import React from 'react';
import { Handle, Position } from 'reactflow';

function ResultNode({ data }) {
  return (
    <div className="flow-node result-node">
      <Handle type="target" position={Position.Left} />
      <div className="node-label">{data.label}</div>
      <div className="node-result">{data.value}</div>
    </div>
  );
}

export default ResultNode;