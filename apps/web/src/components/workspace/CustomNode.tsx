"use client"

import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Sparkles, MoreHorizontal, Settings2, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const CustomNode = ({ data, selected }: any) => {
    return (
        <div className={cn(
            "bg-white rounded-2xl min-w-[320px] transition-all duration-300 group flex flex-col font-sans h-full",
            selected
                ? "shadow-[0_20px_50px_-12px_rgba(59,130,246,0.25)] ring-2 ring-blue-500/50 transform -translate-y-0.5"
                : "shadow-[0_8px_30px_-6px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
        )}>
            {/* Header - Mac OS Style */}
            <div className="h-12 border-b border-zinc-100 bg-zinc-50/50 rounded-t-2xl flex items-center px-4 justify-between backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "p-2 rounded-lg shadow-sm border border-zinc-200/50",
                        data.label.includes("Ref") ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    )}>
                        {data.label.includes("Ref") ? <ImageIcon className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-zinc-800 tracking-tight leading-none">
                            {data.label}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-medium">v1.2.0 • Ready</span>
                    </div>
                </div>
                <button className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-zinc-400 hover:text-zinc-700">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Body / Monitor */}
            <div className="p-3 bg-white flex-1 min-h-[220px]">
                <div className="w-full h-full rounded-xl bg-zinc-50 border border-zinc-100/50 flex items-center justify-center overflow-hidden relative group/image">
                    {data.image ? (
                        <>
                            <img src={data.image} alt="Output" className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/10 transition-colors duration-300" />
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3 text-zinc-300">
                            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 opacity-50" />
                            </div>
                            <p className="text-xs font-medium text-zinc-400">Empty Output</p>
                        </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <div className="bg-white/90 backdrop-blur shadow-sm px-2 py-1 rounded-md text-[10px] font-semibold text-zinc-600 border border-zinc-200/50">
                            25 STEPS
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-white rounded-b-2xl border-t border-zinc-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                    <span className="text-xs font-medium text-zinc-500">Active</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 bg-zinc-50 rounded-md border border-zinc-100">
                    <span className="text-[10px] font-semibold text-zinc-400">MODEL</span>
                    <span className="text-[10px] font-bold text-zinc-700">FLUX.1-PRO</span>
                </div>
            </div>

            {/* Handles - Minimal */}
            <Handle
                type="target"
                position={Position.Left}
                className="w-4 h-4 bg-white border-4 border-zinc-300 rounded-full !-left-2 transition-all hover:border-blue-500 hover:scale-110 shadow-sm"
            />
            <Handle
                type="source"
                position={Position.Right}
                className="w-4 h-4 bg-white border-4 border-zinc-300 rounded-full !-right-2 transition-all hover:border-blue-500 hover:scale-110 shadow-sm"
            />
        </div>
    );
};

export default memo(CustomNode);
