"use client"

import React, { useCallback } from 'react';

import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import { WavyLine } from '../ui/wavy-line';

const nodeTypes = {
    custom: CustomNode,
};

const initialNodes = [
    { id: '1', position: { x: 100, y: 100 }, data: { label: 'Character Ref' }, type: 'custom' },
    { id: '2', position: { x: 500, y: 100 }, data: { label: 'Image Gen' }, type: 'custom' },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }];

export default function NodeGraph() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3b82f6', strokeWidth: 2 } }, eds)),
        [setEdges],
    );

    return (
        <div className="w-full h-full bg-background relative overflow-hidden font-sans selection:bg-blue-500 selection:text-white">
            <style jsx global>{`
                .react-flow__attribution {
                    display: none !important;
                }
            `}</style>

            {/* Wavy Gradient Background */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Top Horizontal Wave */}
                <div className="absolute top-0 left-0 right-0 h-[400px] opacity-20">
                    <WavyLine orientation="horizontal" index={1} total={5} />
                </div>

                {/* Right Vertical Wave */}
                <div className="absolute top-0 bottom-0 right-0 w-[400px] opacity-20">
                    <WavyLine orientation="vertical" index={2} total={5} />
                </div>

                {/* Bottom Accent Wave */}
                <div className="absolute bottom-[-100px] left-0 right-0 h-[400px] opacity-10 rotate-180">
                    <WavyLine orientation="horizontal" index={3} total={5} />
                </div>
            </div>

            {/* Branding on Canvas */}
            <div className="absolute top-8 left-8 z-10 flex items-center gap-2 select-none pointer-events-none opacity-80 mix-blend-multiply">
                <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                <span className="text-sm font-black text-zinc-900 tracking-tighter font-sans">FusionFlow</span>
            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-transparent"
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: '#e4e4e7', strokeWidth: 2 },
                }}
                proOptions={{ hideAttribution: true }}
                minZoom={0.1}
            />
        </div>
    );
}
