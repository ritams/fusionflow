"use client"

import * as React from "react"
import { Layers, Sparkles, FolderOpen, History, Settings, Database } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface NavItem {
    icon: React.ElementType
    label: string
    id: string
}

const navItems: NavItem[] = [
    { icon: Sparkles, label: "Canvas", id: "canvas" },
    { icon: Database, label: "Assets", id: "assets" },
]

export function LeftRail() {
    const [active, setActive] = React.useState("canvas")

    return (
        <div className="flex flex-col h-full py-6 pl-6 z-20 pointer-events-none">
            <div className="w-16 flex flex-col items-center py-4 gap-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 pointer-events-auto">
                {navItems.map((item) => (
                    <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-10 w-10 rounded-xl transition-all duration-300 relative",
                                    active === item.id
                                        ? "bg-blue-50 text-blue-600 shadow-inner"
                                        : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50"
                                )}
                                onClick={() => setActive(item.id)}
                            >
                                <item.icon className={cn("h-5 w-5 transition-transform duration-300", active === item.id ? "scale-100" : "scale-90")} />
                                <span className="sr-only">{item.label}</span>

                                {active === item.id && (
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-1 rounded-r-full bg-blue-500" />
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium text-xs ml-4">
                            {item.label}
                        </TooltipContent>
                    </Tooltip>
                ))}

                <div className="w-8 h-[1px] bg-zinc-100 mx-auto my-2" />

                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="ml-4">Settings</TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}
