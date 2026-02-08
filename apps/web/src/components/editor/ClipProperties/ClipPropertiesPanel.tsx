"use client"

import React from "react"
import { useEditor } from "@/context/EditorContext"
import { SpeedControl } from "./SpeedControl"
import { FilterSelector } from "./FilterSelector"
import { TransitionPicker } from "./TransitionPicker"
import { Scissors, Trash2, Image as ImageIcon, Film } from "lucide-react"

export function ClipPropertiesPanel() {
    const { clips, selectedClipId, splitClip, removeClip, currentTime } = useEditor()

    const selectedClip = clips.find(c => c.id === selectedClipId)

    if (!selectedClip) return null

    const handleSplit = () => {
        if (currentTime > selectedClip.startTime && currentTime < selectedClip.startTime + selectedClip.duration) {
            splitClip(selectedClip.id, currentTime)
        }
    }

    const handleDelete = () => {
        removeClip(selectedClip.id)
    }

    const canSplit = currentTime > selectedClip.startTime + 0.1 &&
        currentTime < selectedClip.startTime + selectedClip.duration - 0.1

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-zinc-100">
                <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 rounded-lg ${selectedClip.type === 'video'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                        {selectedClip.type === 'video' ? (
                            <Film className="w-4 h-4" />
                        ) : (
                            <ImageIcon className="w-4 h-4" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-800">
                            {selectedClip.type === 'video' ? 'Video' : 'Image'} Clip
                        </h3>
                        <p className="text-xs text-zinc-400">
                            {selectedClip.duration.toFixed(1)}s
                        </p>
                    </div>
                </div>
            </div>

            {/* Properties */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Speed Control - video only */}
                {selectedClip.type === 'video' && (
                    <SpeedControl clip={selectedClip} />
                )}

                {/* Duration - image only */}
                {selectedClip.type === 'image' && (
                    <DurationControl clip={selectedClip} />
                )}

                {/* Filter */}
                <FilterSelector clip={selectedClip} />

                {/* Transitions */}
                <TransitionPicker clip={selectedClip} />
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-zinc-100 space-y-2">
                <button
                    onClick={handleSplit}
                    disabled={!canSplit}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-zinc-700 bg-zinc-100 rounded-lg hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Scissors className="w-4 h-4" />
                    Split at Playhead
                </button>

                <button
                    onClick={handleDelete}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Clip
                </button>
            </div>
        </div>
    )
}

// Duration control for images
function DurationControl({ clip }: { clip: ReturnType<typeof useEditor>['clips'][0] }) {
    const { updateClip } = useEditor()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value)
        if (!isNaN(value) && value >= 0.5 && value <= 30) {
            updateClip(clip.id, { duration: value })
        }
    }

    return (
        <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
                Duration
            </label>
            <div className="flex items-center gap-2">
                <input
                    type="range"
                    min="0.5"
                    max="30"
                    step="0.5"
                    value={clip.duration}
                    onChange={handleChange}
                    className="flex-1 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-blue-500"
                />
                <input
                    type="number"
                    min="0.5"
                    max="30"
                    step="0.5"
                    value={clip.duration}
                    onChange={handleChange}
                    className="w-16 px-2 py-1 text-xs text-center border border-zinc-200 rounded-md"
                />
                <span className="text-xs text-zinc-400">s</span>
            </div>
        </div>
    )
}
