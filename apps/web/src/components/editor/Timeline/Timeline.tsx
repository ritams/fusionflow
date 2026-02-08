"use client"

import React, { useRef, useEffect, useState } from "react"
import { useEditor, EditorClip } from "@/context/EditorContext"
import { TimelineRuler } from "./TimelineRuler"
import { TimelineTrack } from "./TimelineTrack"
import { TimelinePlayhead } from "./TimelinePlayhead"
import { Download, Plus, ZoomIn, ZoomOut } from "lucide-react"
import { exportTimeline } from "@/lib/ffmpegService"
import { useSession } from "next-auth/react"
import { useAssets } from "@/context/AssetContext"
import { generateThumbnail, getVideoDuration } from "@/lib/ffmpegService"

const PIXELS_PER_SECOND = 100

export function Timeline() {
    const {
        clips,
        addClip,
        totalDuration,
        timelineZoom,
        setTimelineZoom,
        currentTime,
        setCurrentTime,
        setExportState,
        setViewMode,
    } = useEditor()

    const { data: session } = useSession()
    const { refreshAssets } = useAssets()
    const containerRef = useRef<HTMLDivElement>(null)
    const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false)

    const timelineWidth = Math.max((totalDuration + 5) * PIXELS_PER_SECOND * timelineZoom, 800)

    const handleZoomIn = () => {
        setTimelineZoom(z => Math.min(z * 1.25, 4))
    }

    const handleZoomOut = () => {
        setTimelineZoom(z => Math.max(z / 1.25, 0.25))
    }

    const handleTimelineClick = (e: React.MouseEvent) => {
        if (e.target !== e.currentTarget && !isDraggingPlayhead) return

        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left + (containerRef.current?.scrollLeft || 0)
        const time = x / (PIXELS_PER_SECOND * timelineZoom)
        setCurrentTime(Math.max(0, Math.min(time, totalDuration)))
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        try {
            const data = JSON.parse(e.dataTransfer.getData('application/json'))
            if (data.type === 'library-asset' && data.asset) {
                const asset = data.asset
                let duration = 3

                if (asset.type === 'video' && asset.url) {
                    try {
                        duration = await getVideoDuration(asset.url)
                    } catch {
                        duration = 5
                    }
                }

                const clipData: Omit<EditorClip, 'id' | 'startTime'> = {
                    sourceAssetId: asset._id,
                    sourceUrl: asset.url || '',
                    type: asset.type as 'video' | 'image',
                    duration,
                    trimStart: 0,
                    trimEnd: duration,
                    speed: 1,
                    transitionIn: 'none',
                    transitionOut: 'none',
                    filterEffect: 'none',
                    kenBurns: asset.type === 'image' ? {
                        startZoom: 1,
                        endZoom: 1.2,
                        panX: 0,
                        panY: 0,
                    } : undefined,
                }

                addClip(clipData)
            }
        } catch (err) {
            console.error('Drop error:', err)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleExport = async () => {
        if (clips.length === 0) return

        setExportState(true, 0)

        try {
            const blob = await exportTimeline(clips, (progress) => {
                setExportState(true, progress)
            })

            // Upload to backend
            // @ts-ignore
            const token = session?.accessToken
            if (!token) {
                throw new Error('No auth token')
            }

            const formData = new FormData()
            formData.append('file', blob, 'edited_video.mp4')

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            // Refresh assets and go back to canvas
            await refreshAssets()
            setExportState(false, 0)
            setViewMode('canvas')
        } catch (error) {
            console.error('Export failed:', error)
            setExportState(false, 0)
        }
    }

    return (
        <div className="flex flex-col">
            {/* Toolbar */}
            <div className="h-10 flex items-center justify-between px-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-zinc-500">Timeline</span>
                </div>

                <div className="flex items-center gap-1">
                    <button
                        onClick={handleZoomOut}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
                        title="Zoom out"
                    >
                        <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs text-zinc-400 font-medium tabular-nums w-12 text-center">
                        {Math.round(timelineZoom * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-md transition-colors"
                        title="Zoom in"
                    >
                        <ZoomIn className="w-3.5 h-3.5" />
                    </button>

                    <div className="w-px h-4 bg-zinc-200 mx-2" />

                    <button
                        onClick={handleExport}
                        disabled={clips.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Export
                    </button>
                </div>
            </div>

            {/* Timeline area */}
            <div
                ref={containerRef}
                className="h-40 overflow-x-auto overflow-y-hidden relative bg-zinc-50"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={handleTimelineClick}
            >
                <div style={{ width: timelineWidth, minHeight: '100%' }} className="relative">
                    {/* Ruler */}
                    <TimelineRuler
                        duration={totalDuration + 5}
                        pixelsPerSecond={PIXELS_PER_SECOND * timelineZoom}
                    />

                    {/* Track */}
                    <TimelineTrack
                        pixelsPerSecond={PIXELS_PER_SECOND * timelineZoom}
                    />

                    {/* Playhead */}
                    <TimelinePlayhead
                        pixelsPerSecond={PIXELS_PER_SECOND * timelineZoom}
                    />
                </div>

                {/* Empty state */}
                {clips.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                            <Plus className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
                            <p className="text-xs text-zinc-400">
                                Drag clips here or add from library
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
