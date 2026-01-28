"use client"

import * as React from "react"

import { TopBar } from "./TopBar"
import { RightRail } from "./RightRail"

interface ShellProps {
    children: React.ReactNode
    showRightRail?: boolean
}

export function Shell({ children, showRightRail = true }: ShellProps) {
    return (
        <div className="h-screen w-screen bg-background text-foreground overflow-hidden font-sans selection:bg-blue-500 selection:text-white relative">

            {/* Full Screen Canvas Layer */}
            <main className="absolute inset-0 z-0">
                {children}
            </main>

            {/* Floating Top Bar Layer */}
            <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none">
                <TopBar />
            </div>

            {/* Floating Right Rail Layer */}
            {showRightRail && (
                <div className="absolute top-0 bottom-0 right-0 z-20 pointer-events-none">
                    <RightRail />
                </div>
            )}
        </div>
    )
}
