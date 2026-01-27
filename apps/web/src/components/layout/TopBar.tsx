"use client"

import { signOut, useSession } from "next-auth/react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"

export function TopBar() {
    const { data: session } = useSession()

    return (
        <div className="h-16 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md flex items-center px-6 lg:px-12 justify-between z-20 sticky top-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 font-black tracking-tighter text-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                    <span>FusionFlow</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-zinc-300" />
                <div className="text-sm font-medium text-zinc-500 hover:text-black cursor-pointer transition-colors">
                    Dashboard
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="h-8 text-xs font-medium hover:bg-zinc-100 rounded-lg">
                    Feedback
                </Button>
                <div className="h-4 w-[1px] bg-zinc-200" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className="h-9 w-9 cursor-pointer border-2 border-white shadow-sm hover:scale-105 transition-transform">
                            {session?.user?.image ? (
                                <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                            ) : (
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.email || 'user'}`} />
                            )}
                            <AvatarFallback className="bg-zinc-100 text-black font-bold">
                                {session?.user?.name?.[0] || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 p-2 rounded-xl border-zinc-200 bg-white/90 backdrop-blur-xl shadow-xl">
                        <div className="px-2 py-1.5 text-xs text-zinc-500 font-medium">
                            {session?.user?.email}
                        </div>
                        <DropdownMenuItem
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="rounded-lg hover:bg-zinc-100 focus:bg-zinc-100 cursor-pointer text-red-500 focus:text-red-500"
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}
