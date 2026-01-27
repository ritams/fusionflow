"use client"

import * as React from "react"
import { LeftRail } from "./LeftRail"
import { TopBar } from "./TopBar"

interface ShellProps {
    children: React.ReactNode
    rightRail?: React.ReactNode
}

export function Shell({ children, rightRail }: ShellProps) {
    return (
        <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden font-sans selection:bg-purple-100 selection:text-purple-900">
            <TopBar />
            <div className="flex flex-1 overflow-hidden">
                <LeftRail />
                <main className="flex-1 overflow-auto bg-muted/10 relative">
                    {children}
                </main>
                {rightRail && (
                    <aside className="w-80 border-l bg-background overflow-y-auto z-20 hidden lg:block">
                        {rightRail}
                    </aside>
                )}
            </div>
        </div>
    )
}
