"use client"

import * as React from "react"
import { Layers, Sparkles, FolderOpen, Mic, History, Settings, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface NavItem {
    icon: React.ElementType
    label: string
    id: string
}

const navItems: NavItem[] = [
    { icon: Layers, label: "Storyboard", id: "storyboard" },
    { icon: Sparkles, label: "Generative", id: "brand" },
    { icon: FolderOpen, label: "Assets", id: "assets" },
    { icon: Zap, label: "Actions", id: "actions" },
    { icon: History, label: "History", id: "versions" },
]

export function LeftRail() {
    const [active, setActive] = React.useState("storyboard")

    return (
        <div className="w-16 lg:w-20 border-r border-zinc-200/60 bg-white/50 backdrop-blur-sm flex flex-col items-center py-8 gap-6 z-20 h-full">
            <TooltipProvider delayDuration={0}>
                {navItems.map((item) => (
                    <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-10 w-10 lg:h-12 lg:w-12 rounded-xl transition-all duration-300 group relative",
                                    active === item.id
                                        ? "bg-black text-white shadow-lg shadow-black/20"
                                        : "text-zinc-400 hover:text-black hover:bg-zinc-100"
                                )}
                                onClick={() => setActive(item.id)}
                            >
                                <item.icon className={cn("h-5 w-5 transition-transform duration-300", active === item.id ? "scale-100" : "group-hover:scale-110")} />
                                <span className="sr-only">{item.label}</span>

                                {active === item.id && (
                                    <span className="absolute -right-1 top-1 flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3b82f6] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3b82f6]"></span>
                                    </span>
                                )}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium text-xs bg-black text-white border-none ml-2">
                            {item.label}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>

            <div className="mt-auto flex flex-col gap-4">
                <div className="w-8 h-[1px] bg-zinc-200 mx-auto" />
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-xl">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="bg-black text-white border-none ml-2">Settings</TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}
