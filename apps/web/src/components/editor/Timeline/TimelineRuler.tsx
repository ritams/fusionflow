"use client"

import React from "react"

interface TimelineRulerProps {
    duration: number
    pixelsPerSecond: number
}

export function TimelineRuler({ duration, pixelsPerSecond }: TimelineRulerProps) {
    const markers: number[] = []

    // Generate time markers every second
    for (let i = 0; i <= Math.ceil(duration); i++) {
        markers.push(i)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <div className="h-6 border-b border-zinc-200 bg-white relative select-none">
            {markers.map((time) => (
                <div
                    key={time}
                    className="absolute top-0 flex flex-col items-center"
                    style={{ left: time * pixelsPerSecond }}
                >
                    {/* Major tick */}
                    <div className="w-px h-3 bg-zinc-300" />
                    {/* Time label */}
                    <span className="text-[9px] text-zinc-400 font-medium tabular-nums mt-0.5">
                        {formatTime(time)}
                    </span>
                </div>
            ))}

            {/* Minor ticks (every 0.5s) */}
            {markers.slice(0, -1).map((time) => (
                <div
                    key={`minor-${time}`}
                    className="absolute top-0 w-px h-1.5 bg-zinc-200"
                    style={{ left: (time + 0.5) * pixelsPerSecond }}
                />
            ))}
        </div>
    )
}
