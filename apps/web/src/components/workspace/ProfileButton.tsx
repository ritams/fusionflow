"use client"

import React from "react"
import { useSession, signOut } from "next-auth/react"
import { ChevronDown } from "lucide-react"
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

export function ProfileButton() {
    const { data: session } = useSession()

    return (
        <div className="absolute top-6 right-6 z-50">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="pl-2 pr-1 h-10 rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/90 border border-transparent hover:border-[#3b82f6]/20 hover:shadow-[0_4px_20px_-2px_rgba(59,130,246,0.1)] transition-all gap-2 group shadow-sm">
                        <Avatar className="h-7 w-7 rounded-full ring-2 ring-white/50 group-hover:ring-[#3b82f6]/20 transition-all">
                            {session?.user?.image ? (
                                <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                            ) : (
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email || 'user'}`} />
                            )}
                            <AvatarFallback className="rounded-full">{session?.user?.name?.[0] || "U"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900 max-w-[100px] truncate hidden sm:block">
                            {session?.user?.name || "User"}
                        </span>
                        <ChevronDown className="w-4 h-4 text-zinc-400 group-hover:text-[#3b82f6] transition-colors group-data-[state=open]:rotate-180" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl border-zinc-100 p-1">
                    <DropdownMenuLabel className="text-xs font-medium text-zinc-400 uppercase tracking-wider px-2 py-1.5">
                        {session?.user?.email || "My Account"}
                    </DropdownMenuLabel>
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
    )
}
