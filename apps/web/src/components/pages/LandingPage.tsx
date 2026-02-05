"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { AnimatedGridBackground } from "@/components/landing/AnimatedGridBackground"
import { LandingHero } from "@/components/landing/LandingHero"
import { LandingShowcase } from "@/components/landing/LandingShowcase"

export function LandingPage() {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const handleLogin = async () => {
        await signIn("google", { callbackUrl: "/" })
    }

    return (
        <div className="min-h-screen lg:h-screen bg-white text-black flex flex-col font-sans selection:bg-[#3b82f6] selection:text-white lg:overflow-hidden relative">

            {/* Grain Overlay */}
            <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] grayscale bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 lg:px-12 lg:py-8 pointer-events-none transition-all duration-300 ${isMobile
                ? "bg-white/80 backdrop-blur-md border-b border-zinc-200/60"
                : "bg-transparent backdrop-blur-none border-none shadow-none"
                }`}>
                <div className="flex items-center gap-2 text-sm font-black tracking-tighter pointer-events-auto text-black">
                    <div className="w-2 h-3 rounded-none -skew-x-12 bg-[#3b82f6]" />
                    <span>FusionFlow</span>
                </div>

                <div className="pointer-events-auto">
                    <Button
                        className="rounded-lg bg-[#3b82f6] text-white hover:bg-[#2563eb] text-xs lg:text-xs font-medium px-4 lg:px-4 h-9 lg:h-8 transition-all cursor-pointer shadow-sm"
                        onClick={handleLogin}
                    >
                        Log in
                    </Button>
                </div>
            </nav>

            {/* Main Layout Container */}
            <main className="flex-1 w-full grid grid-cols-12 gap-x-0 lg:gap-x-4 relative max-w-full lg:max-w-[95vw] mx-auto lg:overflow-hidden">

                {/* Dynamic Background Grid */}
                <AnimatedGridBackground />

                {/* Left Column - Hero Type */}
                <LandingHero />

                {/* Right Column - Community Showcase */}
                <LandingShowcase isMobile={isMobile} />

            </main>
        </div>
    )
}
