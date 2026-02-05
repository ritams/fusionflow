import React, { useRef, useState, useEffect, createContext, useContext } from "react"
import { useGesture } from "@use-gesture/react"
import { useCanvasState } from "@/context/CanvasStateContext"

interface InfiniteCanvasContextType {
    scale: number
}

// Keeping this for child components (DraggableCanvasItem might use it)
// But ideally they should move to useCanvasState too.
export const InfiniteCanvasContext = createContext<InfiniteCanvasContextType>({ scale: 1 })

export const useCanvas = () => useContext(InfiniteCanvasContext)

interface InfiniteCanvasProps {
    children: React.ReactNode
    onDrop?: (e: React.DragEvent, position: { x: number, y: number }) => void
}

export function InfiniteCanvas({ children, onDrop }: InfiniteCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    // Use Global State
    const { offset, scale, setOffset, setScale } = useCanvasState()

    // Prevent default browser zoom
    useEffect(() => {
        const preventDefault = (e: Event) => e.preventDefault()
        document.addEventListener('gesturestart', preventDefault)
        document.addEventListener('gesturechange', preventDefault)
        return () => {
            document.removeEventListener('gesturestart', preventDefault)
            document.removeEventListener('gesturechange', preventDefault)
        }
    }, [])

    useGesture({
        onDrag: ({ offset: [ox, oy], event }) => {
            if ((event.target as HTMLElement) === containerRef.current) {
                setOffset({ x: ox, y: oy })
            }
        },
        onWheel: ({ delta: [, dy], ctrlKey }) => {
            if (ctrlKey) {
                // Zoom
                // Note: useGesture's internal state management might conflict if we control it externally without setting "from" correctly?
                // setScale...
                // Actually, useGesture handles "offset" internally if we don't control it.
                // But we want to control it.
                // The "drag: { from: ... }" handles re-entry.
                setScale(s => Math.min(Math.max(0.1, s - dy * 0.01), 5))
            } else {
                // Pan
                setOffset(p => ({ x: p.x - 0, y: p.y - dy }))
            }
        },
        onPinch: ({ offset: [d] }) => {
            setScale(d)
        }
    }, {
        target: containerRef,
        drag: { from: () => [offset.x, offset.y] },
        pinch: { scaleBounds: { min: 0.1, max: 5 }, modifierKey: null, from: () => [scale, 0] },
        wheel: { eventOptions: { passive: false } }
    })

    // Custom Wheel handler because useGesture's passive option config is sometimes tricky in React 18+ strict
    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault()
            if (e.ctrlKey || e.metaKey) {
                // Zoom
                const zoomSensitivity = 0.001
                const delta = -e.deltaY * zoomSensitivity
                setScale(s => Math.min(Math.max(0.1, s + delta), 5))
            } else {
                // Pan
                setOffset(p => ({ x: p.x - e.deltaX, y: p.y - e.deltaY }))
            }
        }

        container.addEventListener("wheel", handleWheel, { passive: false })
        return () => container.removeEventListener("wheel", handleWheel)
    }, [setOffset, setScale]) // specific deps


    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        if (!containerRef.current || !onDrop) return

        const rect = containerRef.current.getBoundingClientRect()
        const clientX = e.clientX
        const clientY = e.clientY

        const x = (clientX - rect.left - offset.x - rect.width / 2) / scale
        const y = (clientY - rect.top - offset.y - rect.height / 2) / scale

        onDrop(e, { x, y })
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    // Interaction logic for mouse panning (fallback/desktop)
    const [isPanning, setIsPanning] = useState(false)
    const lastMousePos = useRef({ x: 0, y: 0 })

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0 && e.target === containerRef.current) {
            setIsPanning(true)
            lastMousePos.current = { x: e.clientX, y: e.clientY }
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            const dx = e.clientX - lastMousePos.current.x
            const dy = e.clientY - lastMousePos.current.y
            setOffset(p => ({ x: p.x + dx, y: p.y + dy }))
            lastMousePos.current = { x: e.clientX, y: e.clientY }
        }
    }

    const handleMouseUp = () => {
        setIsPanning(false)
    }

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full overflow-hidden bg-[#f8f9fa] cursor-grab active:cursor-grabbing"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
                touchAction: 'none'
            }}
        >
            <div
                className="absolute left-1/2 top-1/2 origin-center will-change-transform"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`
                }}
            >
                {/* Background Text in World Space */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[-1]">
                    <span className="text-[20vw] font-bold text-black/[0.03] tracking-widest whitespace-nowrap">
                        CANVAS
                    </span>
                </div>
                <InfiniteCanvasContext.Provider value={{ scale }}>
                    {children}
                </InfiniteCanvasContext.Provider>
            </div>

            {/* HUD */}
            <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur border rounded-full px-3 py-1 text-xs font-medium tabular-nums text-zinc-500 shadow-sm pointer-events-none select-none">
                {Math.round(scale * 100)}%
            </div>
        </div>
    )
}
