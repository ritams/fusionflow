"use client"

import * as React from "react"
import { Shell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/button"
import { CreateProjectModal } from "@/components/modals/CreateProjectModal"
import { Plus } from "lucide-react"

export function ClientHome() {
    const [modalOpen, setModalOpen] = React.useState(true)

    return (
        <div className="flex min-h-screen flex-col">
            <Shell>
                <div className="p-8 h-full flex flex-col items-center justify-center gap-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Welcome to FusionFlow</h1>
                        <p className="text-muted-foreground">Get started by creating a new creative campaign.</p>
                    </div>
                    <Button size="lg" onClick={() => setModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </div>
                <CreateProjectModal open={modalOpen} onOpenChange={setModalOpen} />
            </Shell>
        </div>
    )
}
