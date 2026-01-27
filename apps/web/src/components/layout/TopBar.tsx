"use client"

import { signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export function TopBar() {
    return (
        <div className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-4 justify-between z-10 sticky top-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 font-semibold text-lg tracking-tight">
                    <div className="h-8 w-8 bg-black text-white rounded-lg flex items-center justify-center">
                        <span className="font-bold">F</span>
                    </div>
                    <span>FusionFlow</span>
                </div>
                <Separator orientation="vertical" className="h-6" />
                <div className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                    Summer Campaign 2024
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/40 rounded-full border border-border/50 text-xs font-medium cursor-pointer hover:bg-muted/60 transition-colors">
                    <span className="text-foreground">IG Reels</span>
                    <Separator orientation="vertical" className="h-3" />
                    <span>15s</span>
                    <Separator orientation="vertical" className="h-3" />
                    <span>Awareness</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Adapt
                </Button>
                <Button variant="ghost" size="sm" className="h-8 text-xs">
                    Variants
                </Button>
                <Button size="sm" className="h-8 text-xs rounded-full px-4">
                    Export
                </Button>
                <Separator orientation="vertical" className="h-6 mx-2" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => signOut()}>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
