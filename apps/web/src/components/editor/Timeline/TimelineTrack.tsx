"use client"

import React from "react"
import { useEditor } from "@/context/EditorContext"
import { TimelineClip } from "./TimelineClip"

interface TimelineTrackProps {
    pixelsPerSecond: number
}

export function TimelineTrack({ pixelsPerSecond }: TimelineTrackProps) {
    const { clips, reorderClips } = useEditor()

    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.setData('text/plain', String(index))
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, toIndex: number) => {
        e.preventDefault()
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10)
        if (!isNaN(fromIndex) && fromIndex !== toIndex) {
            reorderClips(fromIndex, toIndex)
        }
    }

    return (
        <div className="h-20 mt-2 mx-2 relative">
            {/* Track background */}
            <div className="absolute inset-0 bg-zinc-100 rounded-lg border border-dashed border-zinc-200" />

            {/* Clips */}
            {clips.map((clip, index) => (
                <TimelineClip
                    key={clip.id}
                    clip={clip}
                    index={index}
                    pixelsPerSecond={pixelsPerSecond}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                />
            ))}
        </div>
    )
}
