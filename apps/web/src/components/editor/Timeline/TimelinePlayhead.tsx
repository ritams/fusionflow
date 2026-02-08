"use client"

import React, { useRef, useState } from "react"
import { useEditor } from "@/context/EditorContext"

interface TimelinePlayheadProps {
    pixelsPerSecond: number
}

export function TimelinePlayhead({ pixelsPerSecond }: TimelinePlayheadProps) {
    const { currentTime, setCurrentTime, totalDuration } = useEditor()
    const [isDragging, setIsDragging] = useState(false)
    const headRef = useRef<HTMLDivElement>(null)

    const left = currentTime * pixelsPerSecond

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const parent = headRef.current?.parentElement
            if (!parent) return

            const rect = parent.getBoundingClientRect()
            const x = moveEvent.clientX - rect.left + parent.scrollLeft
            const time = x / pixelsPerSecond

            setCurrentTime(Math.max(0, Math.min(time, totalDuration)))
        }

        const handleMouseUp = () => {
            setIsDragging(false)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    return (
        <div
            ref={headRef}
            className="absolute top-0 bottom-0 z-20 pointer-events-none"
            style={{ left }}
        >
            {/* Line */}
            <div className="absolute top-0 bottom-0 w-px bg-red-500" />

            {/* Head */}
            <div
                className={`absolute -top-0.5 left-1/2 -translate-x-1/2 pointer-events-auto cursor-grab ${isDragging ? 'cursor-grabbing' : ''
                    }`}
                onMouseDown={handleMouseDown}
            >
                <div className="w-3 h-3 bg-red-500 rounded-sm rotate-45 transform" />
            </div>
        </div>
    )
}
