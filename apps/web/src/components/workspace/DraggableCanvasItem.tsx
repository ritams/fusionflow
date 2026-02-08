"use client"

import React, { useState } from "react"
import { ArrowDownRight } from "lucide-react"
import { Asset } from "@/context/AssetContext"
import { useAssetInteractions } from "@/hooks/useAssetInteractions"
import { AssetContent } from "./AssetContent"
import { AssetControls } from "./AssetControls"

interface DraggableCanvasItemProps {
    asset: Asset
}

// Calculate UI scale factor based on viewport size
function calcUIScale(width: number, height: number): number {
    const baseSize = 300
    const minDim = Math.min(width, height)
    return Math.max(0.5, Math.min(10, minDim / baseSize))
}

export function DraggableCanvasItem({ asset }: DraggableCanvasItemProps) {
    const [title, setTitle] = useState(asset.customTitle || "Untitled")
    const [isEditing, setIsEditing] = useState(false)

    const {
        localPos,
        localDim,
        isDragging,
        isResizing,
        bindDrag,
        bindResize
    } = useAssetInteractions(asset)

    const uiScale = calcUIScale(localDim.width, localDim.height)

    if (asset.isVisibleOnCanvas === false) return null

    return (
        <div
            {...bindDrag() as any}
            className={`absolute group touch-none select-none ${isDragging ? 'cursor-grabbing z-50' : 'cursor-grab z-0'} ${isResizing ? 'z-50' : ''}`}
            style={{
                left: localPos.x,
                top: localPos.y,
                width: localDim.width,
                height: localDim.height,
                touchAction: 'none'
            }}
        >
            <div className="relative w-full h-full transition-all rounded-sm bg-black/5 shadow-sm group-hover:ring-1 group-hover:ring-blue-400">
                <AssetContent asset={asset} title={title} />

                <AssetControls
                    asset={asset}
                    title={title}
                    setTitle={setTitle}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    viewportSize={{ width: localDim.width, height: localDim.height }}
                />

                {/* Resize Handle */}
                <div
                    {...bindResize() as any}
                    className="absolute bottom-0 right-0 flex items-center justify-center cursor-nwse opacity-0 group-hover:opacity-100 transition-opacity origin-bottom-right"
                    style={{
                        width: `${24 * uiScale}px`,
                        height: `${24 * uiScale}px`,
                        transform: `scale(${uiScale})`,
                        transformOrigin: 'bottom right'
                    }}
                >
                    <div className="w-4 h-4 bg-white shadow-sm rounded-full flex items-center justify-center hover:bg-blue-100 text-zinc-400">
                        <ArrowDownRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </div>
    )
}
