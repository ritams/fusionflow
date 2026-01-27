"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion"
import { ArrowUpRight, ArrowRight, BoxSelect } from "lucide-react"
import { WavyLine } from "@/components/ui/wavy-line"

export function AuthenticationPage() {
    const [isLoading, setIsLoading] = React.useState(false)
    const [isMobile, setIsMobile] = React.useState(false)

    // Magnetic Button Logic
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 }
    const magX = useSpring(mouseX, springConfig)
    const magY = useSpring(mouseY, springConfig)

    // Background interaction logic
    const bgMouseX = useMotionValue(0)
    const bgMouseY = useMotionValue(0)
    const bgSpringX = useSpring(bgMouseX, { damping: 50, stiffness: 200 })
    const bgSpringY = useSpring(bgMouseY, { damping: 50, stiffness: 200 })

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e
            const x = (clientX / window.innerWidth - 0.5) * 40
            const y = (clientY / window.innerHeight - 0.5) * 40
            bgMouseX.set(x)
            bgMouseY.set(y)
        }

        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove)
        }

        return () => {
            window.removeEventListener('resize', checkMobile)
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [isMobile, bgMouseX, bgMouseY])

    const handleMagneticMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, clientY, currentTarget } = e
        const { left, top, width, height } = currentTarget.getBoundingClientRect()
        const center = { x: left + width / 2, y: top + height / 2 }
        mouseX.set(clientX - center.x)
        mouseY.set(clientY - center.y)
    }

    const resetMagnetic = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

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
        <div className="min-h-screen lg:h-screen bg-white text-black flex flex-col font-sans selection:bg-[#3b82f6] selection:text-white lg:overflow-hidden relative">

            {/* Grain Overlay */}
            <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.03] grayscale bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 lg:px-12 lg:py-8 pointer-events-none transition-all duration-300 ${isMobile
                ? "bg-white/80 backdrop-blur-md border-b border-zinc-200/60"
                : "bg-transparent backdrop-blur-none border-none shadow-none"
                }`}>
                <div className="flex items-center gap-2 text-sm font-black tracking-tighter pointer-events-auto text-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
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

                {/* Dynamic Background Grid - Dedicated Fixed Container */}
                <motion.div
                    style={{ x: bgSpringX, y: bgSpringY }}
                    className="fixed inset-0 z-0 pointer-events-none overflow-hidden scale-110"
                >
                    {/* Horizontal Grid Lines - 6 Equispaced Lines (0-110vh) - HIDDEN ON MOBILE */}
                    <div className="hidden lg:block">
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
                    </div>

                    {/* Vertical Wavy Lines - Within Fixed Viewport Constraint */}
                    <div className="absolute inset-0 max-w-[95vw] mx-auto grid grid-cols-12 gap-x-4">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={`col-span-1 h-full relative ${i > 1 && i < 10 ? 'hidden md:block' : ''}`}>
                                {i < 11 && (
                                    <WavyLine
                                        index={i}
                                        total={12}
                                        orientation="vertical"
                                        progression={isMobile ? "position" : "index"}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Left Column - Hero Type */}
                <div className="col-span-12 lg:col-span-8 flex flex-col justify-center px-6 lg:pl-12 py-20 lg:py-32 relative z-20 lg:overflow-y-auto scrollbar-hide h-[100svh] lg:h-full">
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 lg:space-y-10">

                        <div className="overflow-visible min-h-[300px] flex flex-col justify-center">
                            <motion.h1
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="text-[16vw] md:text-[12vw] lg:text-[8vw] leading-[0.9] lg:leading-[0.95] font-bold lg:tracking-tight tracking-tighter text-black"
                            >
                                {["Where", "ideas"].map((word, i) => (
                                    <motion.span
                                        key={i}
                                        variants={item}
                                        className="inline-block mr-[0.2em]"
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                                <br />
                                <motion.span variants={item} className="inline-block mr-[0.2em]">find</motion.span>
                                <motion.span variants={item} className="inline-block mr-[0.2em]">their</motion.span>
                                <motion.span
                                    variants={item}
                                    className="relative inline-flex items-end mt-2 md:mt-4 lg:mt-0 whitespace-nowrap"
                                >
                                    <span
                                        className="relative inline-block px-4 -rotate-2 bg-[#3b82f6] text-white shadow-[0_10px_30px_-5px_rgba(59,130,246,0.4)] transform origin-center text-[22vw] md:text-[16vw] lg:text-[8vw]"
                                    >
                                        flow
                                    </span>
                                    <span className="text-[10vw] md:text-[8vw] lg:text-[4vw] font-bold">.</span>
                                </motion.span>
                            </motion.h1>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start pt-4 lg:pt-8">
                            <div className="overflow-hidden">
                                <motion.p variants={item} className="text-xl text-zinc-500 font-light leading-relaxed tracking-tight">
                                    A space designed for your creative rhythm. Storyboard, synthesize, and export without the friction.
                                </motion.p>
                            </div>

                            <motion.div variants={item} className="flex flex-col items-start gap-4">
                                <motion.div
                                    style={{ x: magX, y: magY }}
                                    onMouseMove={handleMagneticMove}
                                    onMouseLeave={resetMagnetic}
                                    className="relative"
                                >
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
                            </motion.div>
                        </div>

                    </motion.div>
                </div>

                {/* Right Column - Community Showcase */}
                <div className="col-span-12 lg:col-span-4 lg:border-l border-zinc-200/60 flex flex-col relative h-auto lg:h-screen bg-black overflow-visible lg:overflow-hidden group/showcase text-white">

                    {/* Label at Top on Mobile, Bottom on Desktop */}
                    <div className={`${isMobile ? 'relative p-8 border-b border-white/10' : 'absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-6 z-30'}`}>
                        <div className="flex justify-center lg:flex">
                            {!isMobile && (
                                <motion.div
                                    animate={{
                                        y: [0, 8, 0],
                                        opacity: [0.4, 0.8, 0.4]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <span className="text-[10px] uppercase tracking-[0.5em] text-white/70 font-medium">Explore Community</span>
                                    <div className="w-[1px] h-12 bg-gradient-to-b from-white/80 via-white/20 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                                </motion.div>
                            )}
                        </div>

                        <div className="flex justify-between items-end">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-[0.4em] font-black text-white/40 mb-1">Community</span>
                                <span className="text-2xl font-bold text-white tracking-tighter leading-none">Showcase</span>
                            </div>
                            <div className="flex -space-x-2 h-7 font-sans">
                                {[
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
                                    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100&auto=format&fit=crop"
                                ].map((url, i) => (
                                    <div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-zinc-800 overflow-hidden">
                                        <img src={url} alt={`Member ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <InfiniteShowcase isMobile={isMobile} />

                    {/* Gradient Overlay for Scroll Hint - Only on Desktop */}
                    {!isMobile && (
                        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
                    )}
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

function InfiniteShowcase({ isMobile }: { isMobile: boolean }) {
    const scrollRef = React.useRef<HTMLDivElement>(null)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [isInitialized, setIsInitialized] = React.useState(false)

    // Only triplicate if not mobile
    const displayItems = isMobile ? SHOWCASE_ITEMS : [...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS]

    const col1 = displayItems.filter((_, i) => i % 2 === 0)
    const col2 = displayItems.filter((_, i) => i % 2 !== 0)

    React.useEffect(() => {
        if (!isMobile && scrollRef.current && contentRef.current) {
            // Start in the middle of the triple list
            const singleHeight = contentRef.current.scrollHeight / 3
            scrollRef.current.scrollTop = singleHeight
            setIsInitialized(true)
        }
    }, [isMobile])

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (isMobile || !isInitialized || !contentRef.current) return

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
            className="flex-1 lg:overflow-y-auto scrollbar-hide active:cursor-grabbing"
        >
            <div ref={contentRef} className="flex gap-0">
                {/* Column 1 */}
                <div className="flex-1 flex flex-col">
                    {col1.map((item, i) => (
                        <motion.div
                            key={`col1-${i}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: (i % 5) * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            className={`w-full relative overflow-hidden ${item.aspect}`}
                        >
                            <ShowcaseMedia src={item.src} index={i} />
                            <div className="absolute inset-0 border-[0.5px] border-white/10 pointer-events-none" />
                        </motion.div>
                    ))}
                </div>
                {/* Column 2 */}
                <div className="flex-1 flex flex-col">
                    {col2.map((item, i) => (
                        <motion.div
                            key={`col2-${i}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: (i % 5) * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className={`w-full relative overflow-hidden ${item.aspect}`}
                        >
                            <ShowcaseMedia src={item.src} index={i} />
                            <div className="absolute inset-0 border-[0.5px] border-white/10 pointer-events-none" />
                        </motion.div>
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
