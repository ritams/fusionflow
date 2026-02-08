"use client"

import * as React from "react"
import { Shell } from "@/components/layout/Shell"
import { WhiteboardCanvas } from "@/components/workspace/WhiteboardCanvas"
import { ChatWidget } from "@/components/workspace/ChatWidget"
import { AssetSidebar } from "@/components/workspace/AssetSidebar"
import { ProfileButton } from "@/components/workspace/ProfileButton"
import { UploadButton } from "@/components/workspace/UploadButton"
import { AssetProvider } from "@/context/AssetContext"
import { UserSync } from "@/components/auth/UserSync"
import { CanvasStateProvider } from "@/context/CanvasStateContext"
import { EditorProvider, useEditor } from "@/context/EditorContext"
import { VideoEditor } from "@/components/editor"
import { EditorToggle } from "@/components/workspace/EditorToggle"

function WorkspaceContent() {
    const { viewMode } = useEditor()

    if (viewMode === 'editor') {
        return <VideoEditor />
    }

    return (
        <Shell showRightRail={false} showTopBar={false} className="border-0">
            <WhiteboardCanvas />

            <ProfileButton />
            <AssetSidebar />
            <UploadButton />
            <ChatWidget />
            <EditorToggle />
        </Shell>
    )
}

export function ClientHome() {
    return (
        <div className="flex inset-0 h-screen w-screen flex-col bg-background relative overflow-hidden">
            <UserSync />
            <AssetProvider>
                <CanvasStateProvider>
                    <EditorProvider>
                        <WorkspaceContent />
                    </EditorProvider>
                </CanvasStateProvider>
            </AssetProvider>
        </div>
    )
}
