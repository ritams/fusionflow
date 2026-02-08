"use client"

import React, { createContext, useContext, useState, useCallback, SetStateAction, Dispatch } from "react"

// Types
export type TransitionType = 'none' | 'fade' | 'crossfade' | 'fade-black' | 'slide-left' | 'slide-right'
export type FilterType = 'none' | 'grayscale' | 'sepia' | 'vintage' | 'contrast' | 'brightness'

export interface KenBurnsEffect {
    startZoom: number
    endZoom: number
    panX: number
    panY: number
}

export interface EditorClip {
    id: string
    sourceAssetId: string
    sourceUrl: string
    type: 'video' | 'image'
    startTime: number          // Position on timeline (seconds)
    duration: number           // Duration on timeline
    trimStart: number          // Trim start from source (video only)
    trimEnd: number            // Trim end from source (video only)
    speed: number              // Playback speed (0.25-4x)
    transitionIn: TransitionType
    transitionOut: TransitionType
    filterEffect: FilterType
    kenBurns?: KenBurnsEffect
    thumbnailUrl?: string      // Generated thumbnail for timeline
}

export type ViewMode = 'canvas' | 'editor'

interface EditorContextType {
    // View state
    viewMode: ViewMode
    setViewMode: (mode: ViewMode) => void

    // Clips
    clips: EditorClip[]
    addClip: (clip: Omit<EditorClip, 'id' | 'startTime'>) => void
    removeClip: (id: string) => void
    updateClip: (id: string, updates: Partial<EditorClip>) => void
    reorderClips: (fromIndex: number, toIndex: number) => void
    splitClip: (id: string, atTime: number) => void
    clearClips: () => void

    // Playback
    currentTime: number
    setCurrentTime: Dispatch<SetStateAction<number>>
    isPlaying: boolean
    setIsPlaying: (playing: boolean) => void

    // Selection
    selectedClipId: string | null
    setSelectedClipId: (id: string | null) => void

    // Timeline
    timelineZoom: number
    setTimelineZoom: Dispatch<SetStateAction<number>>

    // Computed
    totalDuration: number

    // Export
    isExporting: boolean
    exportProgress: number
    setExportState: (exporting: boolean, progress?: number) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

// Generate unique ID
const generateId = () => `clip_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function EditorProvider({ children }: { children: React.ReactNode }) {
    // View mode
    const [viewMode, setViewMode] = useState<ViewMode>('canvas')

    // Clips state
    const [clips, setClips] = useState<EditorClip[]>([])

    // Playback state
    const [currentTime, setCurrentTime] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)

    // Selection state
    const [selectedClipId, setSelectedClipId] = useState<string | null>(null)

    // Timeline zoom (1 = 100px per second)
    const [timelineZoom, setTimelineZoom] = useState(1)

    // Export state
    const [isExporting, setIsExporting] = useState(false)
    const [exportProgress, setExportProgress] = useState(0)

    // Calculate total duration
    const totalDuration = clips.reduce((max, clip) => {
        return Math.max(max, clip.startTime + clip.duration)
    }, 0)

    // Add a new clip
    const addClip = useCallback((clipData: Omit<EditorClip, 'id' | 'startTime'>) => {
        setClips(prev => {
            // Calculate start time (after all existing clips)
            const startTime = prev.reduce((max, clip) => {
                return Math.max(max, clip.startTime + clip.duration)
            }, 0)

            const newClip: EditorClip = {
                ...clipData,
                id: generateId(),
                startTime,
            }

            return [...prev, newClip]
        })
    }, [])

    // Remove a clip
    const removeClip = useCallback((id: string) => {
        setClips(prev => {
            const filtered = prev.filter(c => c.id !== id)
            // Recalculate start times to close gaps
            let currentStart = 0
            return filtered.map(clip => {
                const updated = { ...clip, startTime: currentStart }
                currentStart += clip.duration
                return updated
            })
        })
        if (selectedClipId === id) {
            setSelectedClipId(null)
        }
    }, [selectedClipId])

    // Update a clip
    const updateClip = useCallback((id: string, updates: Partial<EditorClip>) => {
        setClips(prev => prev.map(clip =>
            clip.id === id ? { ...clip, ...updates } : clip
        ))
    }, [])

    // Reorder clips
    const reorderClips = useCallback((fromIndex: number, toIndex: number) => {
        setClips(prev => {
            const newClips = [...prev]
            const [removed] = newClips.splice(fromIndex, 1)
            newClips.splice(toIndex, 0, removed)

            // Recalculate start times
            let currentStart = 0
            return newClips.map(clip => {
                const updated = { ...clip, startTime: currentStart }
                currentStart += clip.duration
                return updated
            })
        })
    }, [])

    // Split a clip at a specific time
    const splitClip = useCallback((id: string, atTime: number) => {
        setClips(prev => {
            const index = prev.findIndex(c => c.id === id)
            if (index === -1) return prev

            const clip = prev[index]
            const relativeTime = atTime - clip.startTime

            // Don't split if at the very start or end
            if (relativeTime <= 0.1 || relativeTime >= clip.duration - 0.1) {
                return prev
            }

            // Create two new clips
            const firstClip: EditorClip = {
                ...clip,
                duration: relativeTime,
                trimEnd: clip.type === 'video' ? clip.trimStart + relativeTime : clip.trimEnd,
            }

            const secondClip: EditorClip = {
                ...clip,
                id: generateId(),
                startTime: clip.startTime + relativeTime,
                duration: clip.duration - relativeTime,
                trimStart: clip.type === 'video' ? clip.trimStart + relativeTime : clip.trimStart,
            }

            const newClips = [...prev]
            newClips.splice(index, 1, firstClip, secondClip)
            return newClips
        })
    }, [])

    // Clear all clips
    const clearClips = useCallback(() => {
        setClips([])
        setSelectedClipId(null)
        setCurrentTime(0)
        setIsPlaying(false)
    }, [])

    // Export state setter
    const setExportState = useCallback((exporting: boolean, progress: number = 0) => {
        setIsExporting(exporting)
        setExportProgress(progress)
    }, [])

    return (
        <EditorContext.Provider value={{
            viewMode,
            setViewMode,
            clips,
            addClip,
            removeClip,
            updateClip,
            reorderClips,
            splitClip,
            clearClips,
            currentTime,
            setCurrentTime,
            isPlaying,
            setIsPlaying,
            selectedClipId,
            setSelectedClipId,
            timelineZoom,
            setTimelineZoom,
            totalDuration,
            isExporting,
            exportProgress,
            setExportState,
        }}>
            {children}
        </EditorContext.Provider>
    )
}

export function useEditor() {
    const context = useContext(EditorContext)
    if (context === undefined) {
        throw new Error("useEditor must be used within an EditorProvider")
    }
    return context
}
