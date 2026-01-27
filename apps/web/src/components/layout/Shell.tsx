"use client"

import * as React from "react"
import { LeftRail } from "./LeftRail"
import { TopBar } from "./TopBar"
import { WavyLine } from "@/components/ui/wavy-line"
import { motion, useSpring, useMotionValue } from "framer-motion"

interface ShellProps {
    children: React.ReactNode
    rightRail?: React.ReactNode
}

export function Shell({ children, rightRail }: ShellProps) {
    const isMobile = typeof window !== 'undefined' ? window.innerWidth < 1024 : false

    // Background interaction logic (simplified for Shell)
    const bgMouseX = useMotionValue(0)
    const bgMouseY = useMotionValue(0)
    const bgSpringX = useSpring(bgMouseX, { damping: 50, stiffness: 200 })
    const bgSpringY = useSpring(bgMouseY, { damping: 50, stiffness: 200 })

    React.useEffect(() => {
        if (typeof window === 'undefined') return

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const x = (clientX / window.innerWidth - 0.5) * 20
            const y = (clientY / window.innerHeight - 0.5) * 20
            bgMouseX.set(x)
            bgMouseY.set(y)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [bgMouseX, bgMouseY])

    return (
        <div className="h-screen w-screen flex flex-col bg-white text-black overflow-hidden font-sans selection:bg-[#3b82f6] selection:text-white relative">

            {/* Grain Overlay */}
            <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] grayscale bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

            {/* Dynamic Background Grid */}
            <motion.div
                style={{ x: bgSpringX, y: bgSpringY }}
                className="fixed inset-0 z-0 pointer-events-none overflow-hidden scale-110"
            >
                {/* Horizontal Grid Lines */}
                <div className="hidden lg:block opacity-60">
                    <div className="absolute top-[0vh] left-0 right-0"><WavyLine orientation="horizontal" /></div>
                    <div className="absolute top-[22vh] left-0 right-0"><WavyLine orientation="horizontal" /></div>
                    <div className="absolute top-[44vh] left-0 right-0"><WavyLine orientation="horizontal" /></div>
                    <div className="absolute top-[66vh] left-0 right-0"><WavyLine orientation="horizontal" /></div>
                    <div className="absolute top-[88vh] left-0 right-0"><WavyLine orientation="horizontal" /></div>
                    <div className="absolute top-[110vh] left-0 right-0"><WavyLine orientation="horizontal" /></div>
                </div>

                {/* Vertical Wavy Lines */}
                <div className="absolute inset-0 max-w-[95vw] mx-auto grid grid-cols-12 gap-x-4 opacity-60">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className={`col-span-1 h-full relative ${i > 1 && i < 10 ? 'hidden md:block' : ''}`}>
                            {i < 11 && (
                                <WavyLine
                                    index={i}
                                    total={12}
                                    orientation="vertical"
                                    progression={"index"}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            <TopBar />

            <div className="flex flex-1 overflow-hidden z-10 relative">
                <LeftRail />
                <main className="flex-1 overflow-auto bg-transparent relative">
                    {children}
                </main>
                {rightRail && (
                    <aside className="w-80 border-l border-zinc-200/60 bg-white/50 backdrop-blur-sm overflow-y-auto hidden lg:block">
                        {rightRail}
                    </aside>
                )}
            </div>
        </div>
    )
}
