"use client"

import * as React from "react"
import { Shell } from "@/components/layout/Shell"
import NodeGraph from "@/components/workspace/NodeGraph"
import { CreateProjectModal } from "@/components/modals/CreateProjectModal"

export function ClientHome() {
    const [modalOpen, setModalOpen] = React.useState(false)

    return (
        <div className="flex inset-0 h-screen w-screen flex-col bg-background">
            <Shell>
                <NodeGraph />
                <CreateProjectModal open={modalOpen} onOpenChange={setModalOpen} />
            </Shell>
        </div>
    )
}
