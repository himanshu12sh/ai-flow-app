import React from 'react';
import { Handle, Position } from 'reactflow';

function InputNode({ data }) {
  return (
    <div className="flow-node input-node">
      <div className="node-label">{data.label}</div>
      <textarea
        className="node-textarea"
        value={data.value}
        onChange={(e) => data.onChange(e.target.value)}
        placeholder="Type your prompt here..."
        rows={5}
      />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default InputNode;