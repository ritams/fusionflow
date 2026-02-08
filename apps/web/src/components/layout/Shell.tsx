"use client"

import * as React from "react"

import { TopBar } from "./TopBar"
import { RightRail } from "./RightRail"

interface ShellProps {
    children: React.ReactNode
    showRightRail?: boolean
}

export function Shell({ children, showRightRail = false, showTopBar = true, className }: ShellProps & { className?: string; showTopBar?: boolean }) {
    return (
        <div className={`h-screen w-screen bg-background text-foreground overflow-hidden font-sans selection:bg-[#3b82f6] selection:text-white relative ${className || ''}`}>

            {/* Full Screen Canvas Layer */}
            <main className="absolute inset-0 z-0">
                {children}
            </main>

            {/* Floating Top Bar Layer */}
            {showTopBar && <TopBar />}

            {/* Floating Right Rail Layer */}
            {showRightRail && (
                <div className="absolute top-0 bottom-0 right-0 z-20 pointer-events-none">
                    <RightRail />
                </div>
            )}
        </div>
    )
}
