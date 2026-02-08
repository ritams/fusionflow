"use client"

import React from "react"
import { useEditor, EditorClip } from "@/context/EditorContext"

interface SpeedControlProps {
    clip: EditorClip
}

const SPEED_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4]

export function SpeedControl({ clip }: SpeedControlProps) {
    const { updateClip } = useEditor()

    const handleSpeedChange = (speed: number) => {
        // Adjust duration based on new speed
        const currentActualDuration = clip.duration * clip.speed
        const newDuration = currentActualDuration / speed

        updateClip(clip.id, {
            speed,
            duration: newDuration,
        })
    }

    return (
        <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
                Playback Speed
            </label>

            <div className="flex flex-wrap gap-1.5">
                {SPEED_PRESETS.map((speed) => (
                    <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${clip.speed === speed
                                ? 'bg-purple-500 text-white'
                                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                            }`}
                    >
                        {speed}x
                    </button>
                ))}
            </div>

            <p className="mt-2 text-[10px] text-zinc-400">
                Duration after speed: {clip.duration.toFixed(1)}s
            </p>
        </div>
    )
}
