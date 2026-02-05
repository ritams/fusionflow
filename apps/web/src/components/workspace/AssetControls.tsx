import React, { useState } from "react"
import { X, GripVertical } from "lucide-react"
import { Asset, useAssets } from "@/context/AssetContext"

interface AssetControlsProps {
    asset: Asset
    title: string
    setTitle: (t: string) => void
    isEditing: boolean
    setIsEditing: (e: boolean) => void
}

export function AssetControls({ asset, title, setTitle, isEditing, setIsEditing }: AssetControlsProps) {
    const { updateAsset } = useAssets()

    const handleRemove = () => {
        updateAsset(asset._id, { isVisibleOnCanvas: false })
    }

    const handleTitleBlur = () => {
        setIsEditing(false)
        if (title !== asset.customTitle) {
            updateAsset(asset._id, { customTitle: title })
        }
    }

    const handleNativeDragStart = (e: React.DragEvent) => {
        const data = {
            type: asset.type,
            content: asset.type === 'text' ? asset.content : asset.url,
            id: asset._id
        }
        e.dataTransfer.setData("application/json", JSON.stringify(data))
        e.dataTransfer.effectAllowed = "copy"
    }

    return (
        <>
            {/* Top Bar */}
            <div className="absolute -top-7 left-0 h-8 flex items-center gap-1 transition-opacity">
                <div
                    className="bg-black/10 hover:bg-black/20 text-zinc-500 p-1 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                    draggable
                    onDragStart={handleNativeDragStart}
                    onPointerDown={(e) => e.stopPropagation()}
                    title="Drag to Chat"
                >
                    <GripVertical className="w-3.5 h-3.5" />
                </div>

                <div className="px-1 py-0.5 flex items-center min-w-[80px] max-w-[300px]">
                    {isEditing ? (
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onPointerDown={(e) => e.stopPropagation()}
                            onBlur={handleTitleBlur}
                            onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
                            className="bg-transparent outline-none w-full text-xs font-bold text-zinc-500"
                        />
                    ) : (
                        <span
                            onClick={() => setIsEditing(true)}
                            className="truncate cursor-text hover:text-blue-500 w-full text-xs font-bold text-zinc-500"
                        >
                            {title}
                        </span>
                    )}
                </div>
            </div>

            {/* Remove Button */}
            <div className="absolute -top-9 right-0 h-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onPointerDown={(e) => { e.stopPropagation(); handleRemove() }}
                    className="bg-white shadow-md hover:bg-red-500 hover:text-white text-zinc-500 p-1.5 rounded-full transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>
        </>
    )
}
