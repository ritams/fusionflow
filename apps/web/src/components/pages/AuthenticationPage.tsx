"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowUpRight, ArrowRight, BoxSelect } from "lucide-react"
import { WavyLine } from "@/components/ui/wavy-line"

export function AuthenticationPage() {
    const [isLoading, setIsLoading] = React.useState(false)

    const handleLogin = async () => {
        setIsLoading(true)
        await signIn("google", { callbackUrl: "/" })
    }

    // Staggered reveal
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
    }

    return (
        <div className="h-screen bg-white text-black flex flex-col font-sans selection:bg-[#3b82f6] selection:text-white overflow-hidden">

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-6 pointer-events-none">
                <div className="flex items-center gap-2 text-sm font-black tracking-tighter pointer-events-auto text-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                    <span>FusionFlow</span>
                </div>

                <div className="pointer-events-auto">
                    <Button
                        className="rounded-lg bg-[#3b82f6] text-white hover:bg-[#2563eb] text-xs font-medium px-4 h-8 transition-all cursor-pointer shadow-sm"
                        onClick={handleLogin}
                    >
                        Log in
                    </Button>
                </div>
            </nav>

            {/* Main Layout Container */}
            <main className="flex-1 w-full grid grid-cols-12 gap-x-4 relative max-w-[95vw] mx-auto overflow-hidden">

                {/* Dynamic Background Grid - Dedicated Fixed Container */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    {/* Horizontal Grid Lines - 6 Equispaced Lines (0-110vh) */}
                    <div className="absolute top-[0vh] left-0 right-0">
                        <WavyLine orientation="horizontal" />
                    </div>
                    <div className="absolute top-[22vh] left-0 right-0">
                        <WavyLine orientation="horizontal" />
                    </div>
                    <div className="absolute top-[44vh] left-0 right-0">
                        <WavyLine orientation="horizontal" />
                    </div>
                    <div className="absolute top-[66vh] left-0 right-0">
                        <WavyLine orientation="horizontal" />
                    </div>
                    <div className="absolute top-[88vh] left-0 right-0">
                        <WavyLine orientation="horizontal" />
                    </div>
                    <div className="absolute top-[110vh] left-0 right-0">
                        <WavyLine orientation="horizontal" />
                    </div>

                    {/* Vertical Wavy Lines - Within Fixed Viewport Constraint */}
                    <div className="absolute inset-0 max-w-[95vw] mx-auto grid grid-cols-12 gap-x-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={`col-span-1 h-full relative ${i > 1 && i < 10 ? 'hidden md:block' : ''}`}>
                                {i < 11 && (
                                    <WavyLine index={i} total={12} orientation="vertical" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Left Column - Hero Type */}
                <div className="col-span-12 lg:col-span-8 flex flex-col justify-center px-4 md:pl-12 py-32 relative z-20 overflow-y-auto scrollbar-hide h-full">
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">

                        {/* Headline */}
                        <div className="overflow-visible">
                            <motion.h1 variants={item} className="text-[10vw] lg:text-[8vw] leading-[0.95] font-bold tracking-tight text-black">
                                Where ideas <br />
                                find their <span className="relative inline-block px-4 ml-2 -rotate-2 bg-[#3b82f6] text-white transform origin-center shadow-[0_4px_20px_-5px_rgba(59,130,246,0.4)]">flow</span>.
                            </motion.h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start pt-16">
                            <div className="overflow-hidden">
                                <motion.p variants={item} className="text-xl text-zinc-500 font-light leading-relaxed tracking-tight">
                                    A workspace designed for your creative rhythm. Storyboard, synthesize, and deploy without the friction.
                                </motion.p>
                            </div>

                            <motion.div variants={item} className="flex flex-col items-start gap-4">
                                <Button
                                    className="relative h-16 px-8 rounded-xl bg-transparent border-2 border-[#3b82f6] text-[#3b82f6] overflow-hidden group hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.3)] transition-all duration-300 active:scale-95 cursor-pointer"
                                    onClick={handleLogin}
                                >
                                    {/* The Curtain (Fill Effect) */}
                                    <div className="absolute inset-0 bg-[#3b82f6] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.23,1,0.32,1]" />

                                    {/* Content */}
                                    <div className="relative z-10 flex items-center gap-4 group-hover:text-white transition-colors duration-300">
                                        <span className="text-xl font-bold tracking-tight">Start Creating</span>
                                        <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
                                    </div>
                                </Button>

                            </motion.div>
                        </div>

                    </motion.div>
                </div>

                {/* Right Column - Community Showcase */}
                <div className="col-span-12 lg:col-span-4 border-t lg:border-t-0 lg:border-l border-zinc-200/60 flex flex-col relative h-screen bg-black overflow-hidden group/showcase text-white">

                    <InfiniteShowcase />

                    {/* Gradient Overlay for Scroll Hint */}

                    {/* Gradient Overlay for Scroll Hint */}
                    <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />

                    {/* Bottom Label & Scroll Hint */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-6 z-30">
                        <div className="flex justify-center">
                            <motion.div
                                animate={{ y: [0, 8, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="flex flex-col items-center gap-1 opacity-60"
                            >
                                <span className="text-[9px] uppercase tracking-[0.4em] text-white font-medium">Scroll to explore</span>
                                <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
                            </motion.div>
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/40 mb-1">Community</span>
                                <span className="text-2xl font-bold text-white tracking-tighter leading-none">Showcase</span>
                            </div>
                            <div className="flex -space-x-2 h-7 font-sans">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-zinc-800" />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}

const SHOWCASE_ITEMS = [
    { src: "/showcase/art5.png", aspect: "aspect-[3/4]" },
    { src: "/showcase/art10.mp4", aspect: "aspect-[3/4]" },
    { src: "/showcase/art6.png", aspect: "aspect-square" },
    { src: "/showcase/art7.png", aspect: "aspect-[2/3]" },
    { src: "/showcase/art9.mp4", aspect: "aspect-square" },
    { src: "/showcase/art8.png", aspect: "aspect-[4/5]" },
    { src: "/showcase/art2.png", aspect: "aspect-[4/5]" },
    { src: "/showcase/art3.png", aspect: "aspect-[3/2]" },
    { src: "/showcase/art4.png", aspect: "aspect-video" }
]

function InfiniteShowcase() {
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [isInitialized, setIsInitialized] = React.useState(false)

    // Triplicate the items to ensure seamless loop
    const tripleItems = [...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS]

    // Split into two columns for true masonry-flex layout
    const col1 = tripleItems.filter((_, i) => i % 2 === 0)
    const col2 = tripleItems.filter((_, i) => i % 2 !== 0)

    React.useEffect(() => {
        if (scrollRef.current && contentRef.current) {
            // Start in the middle of the triple list
            const singleHeight = contentRef.current.scrollHeight / 3
            scrollRef.current.scrollTop = singleHeight
            setIsInitialized(true)
        }
    }, [])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!isInitialized || !contentRef.current) return

        const container = e.currentTarget
        const singleHeight = contentRef.current.scrollHeight / 3

        if (container.scrollTop >= singleHeight * 2) {
            // When reaching the end of the 2nd set, snap back to the start of the 2nd set
            container.scrollTop = container.scrollTop - singleHeight
        } else if (container.scrollTop <= singleHeight * 0.5) {
            // When reaching the start of the 2nd set, snap to the end of the 2nd set
            container.scrollTop = container.scrollTop + singleHeight
        }
    }

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto scrollbar-hide active:cursor-grabbing"
        >
            <div ref={contentRef} className="flex gap-0">
                <div className="flex-1 flex flex-col">
                    {col1.map((item, i) => (
                        <div key={`col1-${i}`} className={`w-full relative overflow-hidden ${item.aspect}`}>
                            <ShowcaseMedia src={item.src} index={i} />
                            <div className="absolute inset-0 border-[0.5px] border-white/10 pointer-events-none" />
                        </div>
                    ))}
                </div>
                <div className="flex-1 flex flex-col">
                    {col2.map((item, i) => (
                        <div key={`col2-${i}`} className={`w-full relative overflow-hidden ${item.aspect}`}>
                            <ShowcaseMedia src={item.src} index={i} />
                            <div className="absolute inset-0 border-[0.5px] border-white/10 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ShowcaseMedia({ src, index }: { src: string, index: number }) {
    const isVideo = src.endsWith('.mp4')
    const [isVideoLoaded, setIsVideoLoaded] = React.useState(false)
    const videoRef = React.useRef<HTMLVideoElement>(null)

    // Attempt to get corresponding image for video poster
    const posterSrc = isVideo ? src.replace('.mp4', '.png') : src

    // Local/cached files can be ready before the first render or event fires
    React.useEffect(() => {
        if (isVideo && videoRef.current && videoRef.current.readyState >= 3) {
            setIsVideoLoaded(true)
        }
    }, [isVideo])

    return (
        <div className="w-full h-full relative">
            {/* The Placeholder/Main Image */}
            <img
                src={posterSrc}
                alt={`Showcase ${index}`}
                className={`w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-opacity duration-700 ${isVideo && isVideoLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
            />

            {/* The Video Layer */}
            {isVideo && (
                <video
                    ref={videoRef}
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    onLoadedData={() => setIsVideoLoaded(true)}
                    onCanPlay={() => setIsVideoLoaded(true)}
                    className={`absolute inset-0 w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-opacity duration-700 ${isVideoLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                />
            )}
        </div>
    )
}
