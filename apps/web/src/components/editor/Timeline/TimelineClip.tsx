"use client"

import React, { useState, useRef } from "react"
import { useEditor, EditorClip } from "@/context/EditorContext"
import { Film, Image as ImageIcon, X } from "lucide-react"

interface TimelineClipProps {
    clip: EditorClip
    index: number
    pixelsPerSecond: number
    onDragStart: (e: React.DragEvent) => void
    onDragOver: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
}

export function TimelineClip({
    clip,
    index,
    pixelsPerSecond,
    onDragStart,
    onDragOver,
    onDrop,
}: TimelineClipProps) {
    const { updateClip, removeClip, selectedClipId, setSelectedClipId } = useEditor()

    const [isDraggingTrim, setIsDraggingTrim] = useState<'start' | 'end' | null>(null)
    const startXRef = useRef(0)
    const startDurationRef = useRef(0)
    const startTrimRef = useRef(0)

    const width = clip.duration * pixelsPerSecond
    const left = clip.startTime * pixelsPerSecond

    const isSelected = selectedClipId === clip.id

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedClipId(clip.id)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        removeClip(clip.id)
    }

    // Trim handle mouse events
    const handleTrimMouseDown = (e: React.MouseEvent, side: 'start' | 'end') => {
        e.stopPropagation()
        e.preventDefault()
        setIsDraggingTrim(side)
        startXRef.current = e.clientX
        startDurationRef.current = clip.duration
        startTrimRef.current = side === 'start' ? clip.trimStart : clip.trimEnd

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startXRef.current
            const deltaTime = deltaX / pixelsPerSecond

            if (side === 'start') {
                // Adjust trim start and duration
                const newTrimStart = Math.max(0, startTrimRef.current + deltaTime)
                const newDuration = Math.max(0.5, startDurationRef.current - deltaTime)

                if (clip.type === 'video') {
                    updateClip(clip.id, {
                        trimStart: newTrimStart,
                        duration: newDuration,
                    })
                } else {
                    updateClip(clip.id, { duration: newDuration })
                }
            } else {
                // Adjust duration and trim end
                const newDuration = Math.max(0.5, startDurationRef.current + deltaTime)

                if (clip.type === 'video') {
                    const maxDuration = (clip.trimEnd - clip.trimStart) / clip.speed
                    updateClip(clip.id, {
                        duration: Math.min(newDuration, maxDuration),
                    })
                } else {
                    updateClip(clip.id, { duration: newDuration })
                }
            }
        }

        const handleMouseUp = () => {
            setIsDraggingTrim(null)
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }

        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
    }

    const bgColor = clip.type === 'video'
        ? 'bg-gradient-to-b from-purple-500 to-purple-600'
        : 'bg-gradient-to-b from-blue-500 to-blue-600'

    const borderColor = isSelected
        ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-100'
        : ''

    return (
        <div
            className={`absolute top-1 bottom-1 rounded-lg overflow-hidden cursor-pointer transition-shadow ${bgColor} ${borderColor}`}
            style={{
                left,
                width: Math.max(width, 40),
            }}
            onClick={handleClick}
            draggable
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
        >
            {/* Thumbnail background */}
            {clip.thumbnailUrl ? (
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `url(${clip.thumbnailUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            ) : clip.type === 'image' && clip.sourceUrl ? (
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `url(${clip.sourceUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            ) : null}

            {/* Content overlay */}
            <div className="relative h-full flex flex-col justify-between p-2">
                {/* Top - Icon and duration */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        {clip.type === 'video' ? (
                            <Film className="w-3 h-3 text-white/80" />
                        ) : (
                            <ImageIcon className="w-3 h-3 text-white/80" />
                        )}
                        <span className="text-[10px] text-white/80 font-medium">
                            {clip.duration.toFixed(1)}s
                        </span>
                    </div>

                    {isSelected && (
                        <button
                            onClick={handleRemove}
                            className="p-0.5 rounded bg-black/30 hover:bg-red-500 text-white/80 hover:text-white transition-colors"
                        >
                            <X className="w-2.5 h-2.5" />
                        </button>
                    )}
                </div>

                {/* Bottom - Speed if modified */}
                {clip.speed !== 1 && (
                    <div className="text-[9px] text-white/70 font-medium">
                        {clip.speed}x
                    </div>
                )}
            </div>

            {/* Trim handles */}
            {isSelected && (
                <>
                    {/* Left handle */}
                    <div
                        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize group hover:bg-white/20"
                        onMouseDown={(e) => handleTrimMouseDown(e, 'start')}
                    >
                        <div className="absolute left-0.5 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100" />
                    </div>

                    {/* Right handle */}
                    <div
                        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize group hover:bg-white/20"
                        onMouseDown={(e) => handleTrimMouseDown(e, 'end')}
                    >
                        <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100" />
                    </div>
                </>
            )}

            {/* Transition indicator */}
            {clip.transitionIn !== 'none' && (
                <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-white/30 to-transparent" />
            )}
            {clip.transitionOut !== 'none' && (
                <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-white/30 to-transparent" />
            )}
        </div>
    )
}
