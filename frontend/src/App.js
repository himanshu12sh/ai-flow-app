import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import StorePage from './StorePage';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from 'axios';
import './App.css';
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

function ResultNode({ data }) {
  return (
    <div className="flow-node result-node">
      <Handle type="target" position={Position.Left} />
      <div className="node-label">{data.label}</div>
      <div className="node-result">{data.value}</div>
    </div>
  );
}

const nodeTypes = { inputNode: InputNode, resultNode: ResultNode };
const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true }];

function App() {
  const [inputValue, setInputValue] = useState('');
  const [resultValue, setResultValue] = useState('Response will appear here...');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const handleInputChange = (val) => {
    setInputValue(val);
    setNodes((nds) =>
      nds.map((n) =>
        n.id === '1'
          ? { ...n, data: { ...n.data, value: val, onChange: handleInputChange } }
          : n
      )
    );
  };

  const makeNodes = (inputVal, resultVal) => [
    {
      id: '1',
      type: 'inputNode',
      position: { x: 100, y: 200 },
      data: { label: 'Your Prompt', value: inputVal, onChange: handleInputChange },
    },
    {
      id: '2',
      type: 'resultNode',
      position: { x: 500, y: 200 },
      data: { label: 'AI Response', value: resultVal },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(
    makeNodes('', 'Response will appear here...')
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const updateResult = useCallback((val) => {
    setResultValue(val);
    setNodes((nds) =>
      nds.map((n) =>
        n.id === '2' ? { ...n, data: { ...n.data, value: val } } : n
      )
    );
  }, [setNodes]);

  const runFlow = async () => {
    if (!inputValue.trim()) { alert('Please enter a prompt!'); return; }
    setLoading(true);
    setSaveStatus('');
    updateResult('Thinking...');
    try {
      const res = await axios.post('http://localhost:5000/api/ask-ai', { prompt: inputValue });
      updateResult(res.data.response);
    } catch {
      updateResult('Error: Could not get a response. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async () => {
    if (
      !inputValue ||
      !resultValue ||
      resultValue.includes('appear here') ||
      resultValue === 'Thinking...'
    ) {
      alert('Run the flow first!');
      return;
    }
    try {
      setSaveStatus('Saving...');
      await axios.post('http://localhost:5000/api/save', {
        prompt: inputValue,
        response: resultValue,
      });
      setSaveStatus('✓ Saved!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch {
      setSaveStatus('Save failed');
    }
  };

  return (
 <BrowserRouter>
    <Routes>
      <Route path="/store" element={<StorePage />} />
      <Route path="/" element={
        <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <div className="toolbar">
            <span className="app-title">AI Flow</span>
            <Link to="/store" style={{ color: '#a5b4fc', fontSize: '13px', textDecoration: 'none' }}>
              🏪 View Store
            </Link>
            <button className="btn btn-run" onClick={runFlow} disabled={loading}>
              {loading ? 'Running...' : '▶ Run Flow'}
            </button>
            <button className="btn btn-save" onClick={saveToDatabase}>
              💾 Save to DB
            </button>
            {saveStatus && <span className="save-status">{saveStatus}</span>}
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background color="#aaa" gap={16} />
          </ReactFlow>
        </div>
      } />
    </Routes>
  </BrowserRouter>
  );
}

export default App;