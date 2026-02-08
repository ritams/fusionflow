import { useState, useRef, useEffect } from "react"
import { useGesture } from "@use-gesture/react"
import { useAssets, Asset } from "@/context/AssetContext"
import { useCanvas } from "@/components/workspace/InfiniteCanvas"

// Default display size that fits well on canvas
const DEFAULT_DISPLAY_WIDTH = 400

export function useAssetInteractions(asset: Asset) {
    const { updateAsset } = useAssets()
    const { scale } = useCanvas()

    const [localPos, setLocalPos] = useState({ x: asset.position?.x || 0, y: asset.position?.y || 0 })
    const [localDim, setLocalDim] = useState({
        width: asset.dimensions?.width || DEFAULT_DISPLAY_WIDTH,
        height: asset.dimensions?.height || DEFAULT_DISPLAY_WIDTH
    })
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const aspectRatioRef = useRef(1)
    const hasLoadedDimensions = useRef(!!asset.dimensions)

    // Load original dimensions from image/video source if not stored
    useEffect(() => {
        if (hasLoadedDimensions.current || !asset.url) return

        if (asset.type === 'image') {
            const img = new Image()
            img.onload = () => {
                const aspectRatio = img.naturalWidth / img.naturalHeight
                const newWidth = DEFAULT_DISPLAY_WIDTH
                const newHeight = newWidth / aspectRatio
                setLocalDim({ width: newWidth, height: newHeight })
                updateAsset(asset._id, { dimensions: { width: newWidth, height: newHeight } })
                hasLoadedDimensions.current = true
            }
            img.src = asset.url
        } else if (asset.type === 'video') {
            const video = document.createElement('video')
            video.onloadedmetadata = () => {
                const aspectRatio = video.videoWidth / video.videoHeight
                const newWidth = DEFAULT_DISPLAY_WIDTH
                const newHeight = newWidth / aspectRatio
                setLocalDim({ width: newWidth, height: newHeight })
                updateAsset(asset._id, { dimensions: { width: newWidth, height: newHeight } })
                hasLoadedDimensions.current = true
            }
            video.src = asset.url
        }
    }, [asset._id, asset.url, asset.type, updateAsset])

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
