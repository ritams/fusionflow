"use client"

import React from "react"
import { EditorToggle } from "@/components/workspace/EditorToggle"
import { ProfileButton } from "@/components/workspace/ProfileButton"

export function EditorHeader() {
    return (
        <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-4">
            {/* Left - Library label */}
            <div className="w-40">
                <span className="text-[11px] font-semibold tracking-wider text-blue-500">
                    LIBRARY
                </span>
            </div>

            {/* Center - Toggle */}
            <EditorToggle fixed={false} />

            {/* Right - Profile */}
            <div className="w-40 flex justify-end">
                <ProfileButton />
            </div>
        </header>
    )
}
