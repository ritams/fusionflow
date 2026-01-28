"use client"

import * as React from "react"
import { useMemo, useEffect, useState } from "react"

interface WavyLineProps {
    index?: number
    total?: number
    orientation?: 'vertical' | 'horizontal'
    progression?: 'index' | 'position'
}

export function WavyLine({
    index = 0,
    total = 12,
    orientation = 'vertical',
    progression
}: WavyLineProps) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const pathD = useMemo(() => {
        if (!isMounted) return ""

        // FLUID NOISE GENERATOR with HIGH TURBULENCE
        const fluidNoise = (input: number, intensity: number) => {
            if (intensity <= 0) return 0
            const layer1 = Math.sin(input * 0.002) * 50
            const layer2 = Math.sin(input * 0.008 + index) * 25
            const layer3 = Math.sin(input * 0.015 + index * 2) * 15
            const turbulence = Math.sin(input * 0.02 - index) * Math.sin(input * 0.005 + index) * 40
            return (layer1 + layer2 + layer3 + (turbulence * intensity)) * intensity
        }

        // Helper to convert points to a smooth Quadratic Spline path
        const getSmoothPath = (points: { x: number, y: number }[]) => {
            if (points.length === 0) return ""
            let d = `M ${points[0].x} ${points[0].y}`

            for (let i = 1; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2
                const yc = (points[i].y + points[i + 1].y) / 2
                d += ` Q ${points[i].x} ${points[i].y} ${xc} ${yc}`
            }

            // Connect to final point
            const last = points[points.length - 1]
            d += ` L ${last.x} ${last.y}`
            return d
        }

        if (orientation === 'vertical') {
            const height = 2000
            const segments = 200 // More anchor points for vertical
            const step = height / segments
            const effectiveProgression = progression || 'index'

            const points = []
            for (let i = 0; i <= segments; i++) {
                const y = i * step

                let progress = 0
                if (effectiveProgression === 'index') {
                    progress = index / (total - 1)
                } else {
                    progress = Math.min(1, y / 1600)
                }

                let lineIntensity = 0
                const threshold = 0.1
                if (progress < threshold) {
                    lineIntensity = 0
                } else {
                    const t = (progress - threshold) / (1 - threshold)
                    lineIntensity = t * t
                }

                if (lineIntensity <= 0.01) {
                    points.push({ x: 0, y })
                    continue
                }

                let x = Math.sin((y * 0.003) + (index * 0.5)) * (lineIntensity * 80)
                x += fluidNoise(y, lineIntensity * 2.5)
                if (lineIntensity > 0.8) {
                    x += Math.sin(y * 0.002) * (lineIntensity * 150)
                }
                points.push({ x, y })
            }
            return getSmoothPath(points)

        } else {
            // HORIZONTAL
            const width = 3000
            const segments = 300 // More anchor points for horizontal
            const step = width / segments

            const points = []
            for (let i = 0; i <= segments; i++) {
                const x = i * step
                const effectiveProgression = progression || 'position'

                let progress = 0
                if (effectiveProgression === 'position') {
                    progress = Math.min(1, x / 1600)
                } else {
                    progress = index / (total - 1)
                }

                let pointIntensity = 0
                const threshold = 0.05
                if (progress < threshold) {
                    pointIntensity = 0
                } else {
                    const t = (progress - threshold) / (1 - threshold)
                    pointIntensity = t * t
                }

                let y = 0
                if (pointIntensity > 0.01) {
                    y = Math.sin((x * 0.003)) * (pointIntensity * 50)
                    y += fluidNoise(x, pointIntensity * 2.0)
                    if (pointIntensity > 0.8) {
                        y += Math.sin(x * 0.002) * (pointIntensity * 120)
                    }
                }
                points.push({ x, y })
            }
            return getSmoothPath(points)
        }
    }, [index, total, orientation, isMounted])

    if (orientation === 'vertical') {
        return (
            <div className="absolute top-0 bottom-0 right-0 w-0 flex flex-col items-center justify-center pointer-events-none">
                <svg
                    className="h-full w-[400px] overflow-visible text-zinc-200"
                    style={{ height: '100%' }}
                    preserveAspectRatio="none"
                >
                    <path
                        d={pathD}
                        stroke="currentColor"
                        strokeWidth="1.1"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        )
    } else {
        return (
            <div className="absolute left-0 right-0 h-0 flex flex-row items-center justify-start pointer-events-none">
                <svg
                    className="w-full h-[400px] overflow-visible text-zinc-200"
                    style={{ width: '100%' }}
                    preserveAspectRatio="none"
                >
                    <path
                        d={pathD}
                        stroke="currentColor"
                        strokeWidth="1.1"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        )
    }
}
