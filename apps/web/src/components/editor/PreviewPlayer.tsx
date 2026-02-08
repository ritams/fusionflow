"use client"

import React, { useRef, useEffect, useState } from "react"
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from "lucide-react"
import { useEditor } from "@/context/EditorContext"

export function PreviewPlayer() {
    const {
        clips,
        currentTime,
        setCurrentTime,
        isPlaying,
        setIsPlaying,
        totalDuration,
    } = useEditor()

    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [activeClip, setActiveClip] = useState<typeof clips[0] | null>(null)

    // Find the active clip based on current time
    useEffect(() => {
        const clip = clips.find(c =>
            currentTime >= c.startTime && currentTime < c.startTime + c.duration
        )
        setActiveClip(clip || null)
    }, [clips, currentTime])

    // Handle playback
    useEffect(() => {
        if (!videoRef.current || !activeClip || activeClip.type !== 'video') return

        if (isPlaying) {
            videoRef.current.play().catch(() => {
                // Ignore AbortError when play() is interrupted
            })
        } else {
            videoRef.current.pause()
        }
    }, [isPlaying, activeClip])

    // Update video playback position when currentTime changes externally
    useEffect(() => {
        if (!videoRef.current || !activeClip || activeClip.type !== 'video') return

        const clipTime = currentTime - activeClip.startTime
        const videoTime = activeClip.trimStart + clipTime / activeClip.speed

        if (Math.abs(videoRef.current.currentTime - videoTime) > 0.1) {
            videoRef.current.currentTime = videoTime
        }
    }, [currentTime, activeClip])

    // Playback loop
    useEffect(() => {
        if (!isPlaying) return

        const interval = setInterval(() => {
            setCurrentTime((prev: number) => {
                const next = prev + 0.05
                if (next >= totalDuration) {
                    setIsPlaying(false)
                    return 0
                }
                return next
            })
        }, 50)

        return () => clearInterval(interval)
    }, [isPlaying, totalDuration, setCurrentTime, setIsPlaying])

    // Render Ken Burns for images
    useEffect(() => {
        if (!activeClip || activeClip.type !== 'image' || !canvasRef.current) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            const clipProgress = (currentTime - activeClip.startTime) / activeClip.duration

            if (activeClip.kenBurns) {
                const { startZoom, endZoom, panX, panY } = activeClip.kenBurns
                const zoom = startZoom + (endZoom - startZoom) * clipProgress

                ctx.clearRect(0, 0, canvas.width, canvas.height)

                const scale = zoom
                const offsetX = (canvas.width - img.width * scale) / 2 + panX * clipProgress
                const offsetY = (canvas.height - img.height * scale) / 2 + panY * clipProgress

                ctx.drawImage(img, offsetX, offsetY, img.width * scale, img.height * scale)
            } else {
                // Fit to canvas
                const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
                const x = (canvas.width - img.width * scale) / 2
                const y = (canvas.height - img.height * scale) / 2
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
            }
        }
        img.src = activeClip.sourceUrl
    }, [activeClip, currentTime])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        const ms = Math.floor((seconds % 1) * 10)
        return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`
    }

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const handleSkipBack = () => {
        setCurrentTime(0)
    }

    const handleSkipForward = () => {
        setCurrentTime(totalDuration)
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
        }
        setIsMuted(!isMuted)
    }

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const percentage = x / rect.width
        setCurrentTime(percentage * totalDuration)
    }

    const progress = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0

    return (
        <div className="w-full max-w-3xl">
            {/* Preview area */}
            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg relative">
                {clips.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-zinc-500 text-sm">Add clips to start editing</p>
                    </div>
                ) : activeClip ? (
                    activeClip.type === 'video' ? (
                        <video
                            ref={videoRef}
                            src={activeClip.sourceUrl}
                            muted={isMuted}
                            playsInline
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <canvas
                            ref={canvasRef}
                            width={1280}
                            height={720}
                            className="w-full h-full object-contain"
                        />
                    )
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-zinc-500 text-sm">No clip at current time</p>
                    </div>
                )}
            </div>

            {/* Controls */}
            <div className="mt-4 space-y-3">
                {/* Progress bar */}
                <div
                    className="h-1.5 bg-zinc-200 rounded-full cursor-pointer group"
                    onClick={handleProgressClick}
                >
                    <div
                        className="h-full bg-blue-500 rounded-full relative transition-all"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md border border-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>

                {/* Buttons and time */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSkipBack}
                            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            <SkipBack className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handlePlayPause}
                            className="p-2.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 transition-colors"
                        >
                            {isPlaying ? (
                                <Pause className="w-4 h-4" />
                            ) : (
                                <Play className="w-4 h-4 ml-0.5" />
                            )}
                        </button>
                        <button
                            onClick={handleSkipForward}
                            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            <SkipForward className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-zinc-500 font-medium tabular-nums">
                            {formatTime(currentTime)} / {formatTime(totalDuration)}
                        </span>
                        <button
                            onClick={toggleMute}
                            className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                        >
                            {isMuted ? (
                                <VolumeX className="w-4 h-4" />
                            ) : (
                                <Volume2 className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
