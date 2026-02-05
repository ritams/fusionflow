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

export function ClientHome() {
    return (
        <div className="flex inset-0 h-screen w-screen flex-col bg-background relative overflow-hidden">
            <UserSync />
            <AssetProvider>
                <CanvasStateProvider>
                    <Shell showRightRail={false} showTopBar={false} className="border-0">
                        <WhiteboardCanvas />

                        <ProfileButton />
                        <AssetSidebar />
                        <UploadButton />
                        <ChatWidget />
                    </Shell>
                </CanvasStateProvider>
            </AssetProvider>
        </div>
    )
}
