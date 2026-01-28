"use client"

import * as React from "react"
import { Sliders, ChevronRight, ChevronLeft } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function RightRail() {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
        <div className="flex flex-col z-20 pointer-events-none absolute top-24 bottom-6 right-6 transition-all duration-300">
            <div className={cn(
                "bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 h-full flex flex-col overflow-hidden pointer-events-auto transition-all duration-500 ease-in-out relative",
                isCollapsed ? "w-16 h-auto max-h-[300px]" : "w-[320px]"
            )}>
                {/* Header */}
                <div className={cn(
                    "flex items-center justify-between bg-zinc-50/30 px-3 shrink-0 transition-all duration-300",
                    isCollapsed ? "h-14 flex-col justify-center gap-2 py-4" : "h-14 border-b border-zinc-100/50"
                )}>
                    {!isCollapsed && (
                        <span className="text-xs font-bold text-zinc-400 font-mono tracking-widest uppercase ml-1 animate-in fade-in duration-300 whitespace-nowrap">
                            Properties
                        </span>
                    )}

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-all",
                            isCollapsed ? "h-10 w-10 bg-zinc-50 border border-zinc-100/50 shadow-sm" : "h-8 w-8 ml-auto"
                        )}
                    >
                        {isCollapsed ? <Sliders className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </Button>
                </div>

                {/* Content - Hidden when collapsed */}
                <div className={cn(
                    "flex-1 overflow-hidden transition-opacity duration-300",
                    isCollapsed ? "opacity-0 invisible h-0" : "opacity-100 visible"
                )}>
                    <ScrollArea className="h-full p-4">
                        <div className="flex flex-col gap-6 w-[288px]">
                            {/* Placeholder for Node Parameters */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-zinc-700 flex items-center gap-2">
                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    Global Settings
                                </label>
                                <div className="p-6 rounded-xl bg-zinc-50/50 border border-zinc-100 flex flex-col items-center justify-center gap-2 text-center">
                                    <Sliders className="w-8 h-8 text-zinc-200" />
                                    <p className="text-xs text-zinc-400 font-medium">Select a node to edit properties</p>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
