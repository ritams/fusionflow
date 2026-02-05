"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { Button } from "@/components/ui/button"

export function MagneticButton({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
    const magX = useSpring(mouseX, springConfig)
    const magY = useSpring(mouseY, springConfig)

    const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY, currentTarget } = e
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        const center = { x: left + width / 2, y: top + height / 2 }
        mouseX.set(clientX - center.x)
        mouseY.set(clientY - center.y)
    }

    const resetMagnetic = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    return (
        <motion.div
            style={{ x: magX, y: magY }}
            onMouseMove={handleMagneticMove}
            onMouseLeave={resetMagnetic}
            className="relative"
        >
            <Button
                className={className}
                onClick={onClick}
            >
                {children}
            </Button>
        </motion.div>
    )
}
