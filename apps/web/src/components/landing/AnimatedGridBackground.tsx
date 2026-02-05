"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { WavyLine } from "@/components/ui/wavy-line"

export function AnimatedGridBackground() {
    const [isMobile, setIsMobile] = React.useState(false)

    // Background interaction logic
    const bgMouseX = useMotionValue(0)
    const bgMouseY = useMotionValue(0)
    const bgSpringX = useSpring(bgMouseX, { damping: 50, stiffness: 200 })
    const bgSpringY = useSpring(bgMouseY, { damping: 50, stiffness: 200 })

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const x = (clientX / window.innerWidth - 0.5) * 40
            const y = (clientY / window.innerHeight - 0.5) * 40
            bgMouseX.set(x)
            bgMouseY.set(y)
        }

        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove)
        }

        return () => {
            window.removeEventListener('resize', checkMobile)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [isMobile, bgMouseX, bgMouseY])

    return (
        <motion.div
            style={{ x: bgSpringX, y: bgSpringY }}
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden scale-110"
        >
            {/* Horizontal Grid Lines */}
            <div className="hidden lg:block">
                {[0, 33, 66, 100].map(top => (
                    <div key={top} className="absolute left-0 right-0" style={{ top: `${top}vh` }}>
                        <WavyLine orientation="horizontal" />
                    </div>
                ))}
            </div>

            {/* Vertical Wavy Lines */}
            <div className="absolute inset-0 max-w-[95vw] mx-auto grid grid-cols-12 gap-x-4">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className={`col-span-1 h-full relative ${i > 1 && i < 10 ? 'hidden md:block' : ''}`}>
                        {i < 11 && (
                            <WavyLine
                                index={i}
                                total={12}
                                orientation="vertical"
                                progression={isMobile ? "position" : "index"}
                            />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    )
}
