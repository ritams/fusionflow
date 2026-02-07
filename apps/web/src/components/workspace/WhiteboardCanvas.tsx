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
