import { useState, useRef } from "react"
import { useGesture } from "@use-gesture/react"
import { useAssets, Asset } from "@/context/AssetContext"
import { useCanvas } from "@/components/workspace/InfiniteCanvas"

export function useAssetInteractions(asset: Asset) {
    const { updateAsset } = useAssets()
    const { scale } = useCanvas()

    const [localPos, setLocalPos] = useState({ x: asset.position?.x || 0, y: asset.position?.y || 0 })
    const [localDim, setLocalDim] = useState({ width: asset.dimensions?.width || 300, height: asset.dimensions?.height || 300 })
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const aspectRatioRef = useRef(1)

    const bindDrag = useGesture({
        onDragStart: () => setIsDragging(true),
        onDrag: ({ delta: [dx, dy] }) => {
            setLocalPos(prev => ({
                x: prev.x + dx / scale,
                y: prev.y + dy / scale
            }))
        },
        onDragEnd: () => {
            setIsDragging(false)
            updateAsset(asset._id, { position: localPos })
        }
    })

    const bindResize = useGesture({
        onDragStart: (e) => {
            e.event.stopPropagation()
            setIsResizing(true)
            aspectRatioRef.current = localDim.width / localDim.height
        },
        onDrag: ({ delta: [dx, dy], event }) => {
            event.stopPropagation()
            const shiftKey = event.shiftKey

            setLocalDim(prev => {
                let newWidth = Math.max(100, prev.width + dx / scale)
                let newHeight = Math.max(100, prev.height + dy / scale)

                if (shiftKey) {
                    newHeight = newWidth / aspectRatioRef.current
                }
                return { width: newWidth, height: newHeight }
            })
        },
        onDragEnd: (e) => {
            e.event.stopPropagation()
            setIsResizing(false)
            updateAsset(asset._id, { dimensions: localDim })
        }
    })

    return {
        localPos,
        localDim,
        isDragging,
        isResizing,
        bindDrag,
        bindResize
    }
}
