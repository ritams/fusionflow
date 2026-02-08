"use client"

import React from "react"
import { useEditor } from "@/context/EditorContext"

interface EditorToggleProps {
    fixed?: boolean
}

export function EditorToggle({ fixed = true }: EditorToggleProps) {
    const { viewMode, setViewMode } = useEditor()

    const baseClasses = "flex items-center bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden"
    const positionClasses = fixed
        ? "fixed top-4 left-1/2 -translate-x-1/2 z-50"
        : ""

    return (
        <div className={`${baseClasses} ${positionClasses}`}>
            <button
                onClick={() => setViewMode('canvas')}
                className={`px-4 py-2 text-[11px] font-semibold tracking-wider transition-colors ${viewMode === 'canvas'
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
                    }`}
            >
                CANVAS
            </button>
            <button
                onClick={() => setViewMode('editor')}
                className={`px-4 py-2 text-[11px] font-semibold tracking-wider transition-colors ${viewMode === 'editor'
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50'
                    }`}
            >
                EDITOR
            </button>
        </div>
    )
}
