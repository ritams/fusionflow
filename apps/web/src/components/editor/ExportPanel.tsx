"use client"

import React from "react"
import { useEditor } from "@/context/EditorContext"
import { Loader2 } from "lucide-react"

export function ExportPanel() {
    const { exportProgress } = useEditor()

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                    </div>

                    <h2 className="text-lg font-semibold text-zinc-900 mb-2">
                        Exporting Video
                    </h2>

                    <p className="text-sm text-zinc-500 mb-6">
                        Processing your clips. This may take a moment.
                    </p>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                            style={{ width: `${exportProgress}%` }}
                        />
                    </div>

                    <span className="text-xs text-zinc-400 mt-2 font-medium tabular-nums">
                        {exportProgress}%
                    </span>
                </div>
            </div>
        </div>
    )
}
