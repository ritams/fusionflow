"use client"

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, User, Sparkles } from 'lucide-react';
import { useSession, signOut } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

export function TopBar() {
    const { data: session } = useSession()
    const [activeTab, setActiveTab] = useState("canvas");

    return (
        <>
            {/* Top Centered Navigation Tabs */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-center z-30 pointer-events-none">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-1.5 flex items-center gap-1 pointer-events-auto h-14">
                    <Button
                        variant="ghost"
                        className={cn(
                            "rounded-xl h-10 px-6 font-medium text-sm transition-all",
                            activeTab === "canvas" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
                        )}
                        onClick={() => setActiveTab("canvas")}
                    >
                        Canvas
                    </Button>
                    <div className="w-[1px] h-4 bg-zinc-200 mx-1" />
                    <Button
                        variant="ghost"
                        className={cn(
                            "rounded-xl h-10 px-6 font-medium text-sm transition-all",
                            activeTab === "assets" ? "bg-zinc-100 text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
                        )}
                        onClick={() => setActiveTab("assets")}
                    >
                        Assets
                    </Button>
                </div>
            </div>

            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-30 pointer-events-none">
                {/* Left Pill: Identity - REMOVED (Moved to Canvas) */}
                <div />

                {/* Right Pill: Actions */}
                <div className="h-14 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 flex items-center gap-2 px-4 pointer-events-auto transition-all hover:shadow-2xl hover:scale-[1.02] duration-300">
                    <Button variant="ghost" size="sm" className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 rounded-lg text-xs font-medium h-9 px-3">
                        <HelpCircle className="w-3.5 h-3.5 mr-2" />
                        Help
                    </Button>

                    <div className="w-[1px] h-6 bg-zinc-200 mx-1" />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="pl-2 pr-1 h-9 rounded-xl hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all gap-2 group">
                                <Avatar className="h-6 w-6 rounded-lg ring-2 ring-white shadow-sm">
                                    {session?.user?.image ? (
                                        <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                                    ) : (
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email || 'user'}`} />
                                    )}
                                    <AvatarFallback className="rounded-lg">{session?.user?.name?.[0] || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs font-semibold text-zinc-700 group-hover:text-zinc-900 max-w-[100px] truncate">
                                    {session?.user?.name || "User"}
                                </span>
                                <ChevronDown className="w-3 h-3 text-zinc-400 transition-transform group-data-[state=open]:rotate-180" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-zinc-100 p-1">
                            <DropdownMenuLabel className="text-xs font-medium text-zinc-400 uppercase tracking-wider px-2 py-1.5">
                                {session?.user?.email || "My Account"}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-50" />
                            <DropdownMenuItem className="rounded-lg text-sm text-zinc-600 focus:text-zinc-900 focus:bg-zinc-50 cursor-pointer px-2 py-1.5">
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg text-sm text-zinc-600 focus:text-zinc-900 focus:bg-zinc-50 cursor-pointer px-2 py-1.5">
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-zinc-50" />
                            <DropdownMenuItem
                                className="rounded-lg text-sm text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer px-2 py-1.5"
                                onClick={() => signOut({ callbackUrl: "/" })}
                            >
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
}
