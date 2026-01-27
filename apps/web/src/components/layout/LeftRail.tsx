"use client"

import * as React from "react"
import { Layers, Sparkles, FolderOpen, Mic, History, Settings } from "lucide-react"
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
    { icon: Sparkles, label: "Brand", id: "brand" },
    { icon: FolderOpen, label: "Assets", id: "assets" },
    { icon: Mic, label: "Audio", id: "audio" },
    { icon: History, label: "Versions", id: "versions" },
]

export function LeftRail() {
    const [active, setActive] = React.useState("storyboard")

    return (
        <div className="w-14 border-r bg-background flex flex-col items-center py-4 gap-4 z-20">
            <TooltipProvider delayDuration={0}>
                {navItems.map((item) => (
                    <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "h-10 w-10 rounded-xl transition-all duration-200",
                                    active === item.id
                                        ? "bg-primary text-primary-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                                onClick={() => setActive(item.id)}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="sr-only">{item.label}</span>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="font-medium text-xs">
                            {item.label}
                        </TooltipContent>
                    </Tooltip>
                ))}
            </TooltipProvider>

            <div className="mt-auto">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-foreground">
                            <Settings className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}
