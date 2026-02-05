"use client"

import React, { createContext, useContext, useState } from "react"

interface CanvasStateContextType {
    scale: number
    offset: { x: number, y: number }
    setScale: React.Dispatch<React.SetStateAction<number>>
    setOffset: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>
}

const CanvasStateContext = createContext<CanvasStateContextType | undefined>(undefined)

export const useCanvasState = () => {
    const context = useContext(CanvasStateContext)
    if (!context) {
        throw new Error("useCanvasState must be used within a CanvasStateProvider")
    }
    return context
}

export const CanvasStateProvider = ({ children }: { children: React.ReactNode }) => {
    const [scale, setScale] = useState(1)
    const [offset, setOffset] = useState({ x: 0, y: 0 })

    return (
        <CanvasStateContext.Provider value={{ scale, offset, setScale, setOffset }}>
            {children}
        </CanvasStateContext.Provider>
    )
}
