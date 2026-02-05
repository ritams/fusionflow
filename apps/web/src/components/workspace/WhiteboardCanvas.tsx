"use client"

import * as React from "react"
import { useAssets } from "@/context/AssetContext"
import { DraggableCanvasItem } from "./DraggableCanvasItem"
import { InfiniteCanvas } from "./InfiniteCanvas"

interface WhiteboardCanvasProps {
    children?: React.ReactNode
}

export function WhiteboardCanvas({ children }: WhiteboardCanvasProps) {
    const { assets, updateAsset } = useAssets()

    const handleDrop = (e: React.DragEvent, position: { x: number, y: number }) => {
        try {
            const data = e.dataTransfer.getData("application/json")
            if (data) {
                const asset = JSON.parse(data)
                // Update asset with new position and ensure visibility
                updateAsset(asset._id, {
                    position,
                    isVisibleOnCanvas: true
                })
            }
        } catch (err) {
            console.error("Failed to parse drag data", err)
        }
    }

    return (
        <div className="absolute inset-0 z-0 bg-background overflow-hidden">

            <InfiniteCanvas onDrop={handleDrop}>
                {/* Background Text in World Space */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[-1]">
                    <span className="text-[20vw] font-bold text-black/[0.03] tracking-widest whitespace-nowrap">
                        CANVAS
                    </span>
                </div>

                {assets
                    .filter(asset => asset.type !== 'text' && asset.isVisibleOnCanvas)
                    .map((asset) => (
                        <DraggableCanvasItem key={asset._id} asset={asset} />
                    ))}
            </InfiniteCanvas>

            {/* Overlay UI if needed */}
            <div className="absolute inset-0 pointer-events-none">
                {children}
            </div>
        </div>
    )
}
