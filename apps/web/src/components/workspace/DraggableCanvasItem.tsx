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
                />

                {/* Resize Handle */}
                <div
                    {...bindResize() as any}
                    className="absolute bottom-0 right-0 w-6 h-6 flex items-center justify-center cursor-nwse opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <div className="w-4 h-4 bg-white shadow-sm rounded-full flex items-center justify-center hover:bg-blue-100 text-zinc-400">
                        <ArrowDownRight className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </div>
    )
}
