"use client"

import React from "react"
import { useEditor } from "@/context/EditorContext"
import { EditorHeader } from "./EditorHeader"
import { PreviewPlayer } from "./PreviewPlayer"
import { Timeline } from "./Timeline/Timeline"
import { ClipPropertiesPanel } from "./ClipProperties/ClipPropertiesPanel"
import { ExportPanel } from "./ExportPanel"
import { EditorLibrary } from "./EditorLibrary"

export function VideoEditor() {
    const { selectedClipId, isExporting } = useEditor()

    return (
        <div className="flex flex-col h-full w-full bg-[#f8f9fa]">
            {/* Header */}
            <EditorHeader />

            {/* Main Content */}
            <div className="flex flex-1 min-h-0">
                {/* Left sidebar - Library */}
                <EditorLibrary />

                {/* Center - Preview */}
                <div className="flex-1 flex flex-col min-w-0 p-6">
                    <div className="flex-1 flex items-center justify-center">
                        <PreviewPlayer />
                    </div>
                </div>

                {/* Right sidebar - Properties */}
                {selectedClipId && (
                    <div className="w-72 border-l border-zinc-200 bg-white">
                        <ClipPropertiesPanel />
                    </div>
                )}
            </div>

            {/* Timeline */}
            <div className="border-t border-zinc-200 bg-white">
                <Timeline />
            </div>

            {/* Export overlay */}
            {isExporting && <ExportPanel />}
        </div>
    )
}
