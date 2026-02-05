"use client"

import * as React from "react"
import { motion } from "framer-motion"

const SHOWCASE_ITEMS = [
    { src: "/showcase/art5.png", aspect: "aspect-[3/4]" },
    { src: "/showcase/art10.mp4", aspect: "aspect-[3/4]" },
    { src: "/showcase/art6.png", aspect: "aspect-square" },
    { src: "/showcase/art7.png", aspect: "aspect-[2/3]" },
    { src: "/showcase/product1.png", aspect: "aspect-square" },
    { src: "/showcase/sports1.png", aspect: "aspect-[4/5]" },
    { src: "/showcase/art9.mp4", aspect: "aspect-square" },
    { src: "/showcase/product2.png", aspect: "aspect-[3/4]" },
    { src: "/showcase/sports2.png", aspect: "aspect-square" },
    { src: "/showcase/art8.png", aspect: "aspect-[4/5]" },
    { src: "/showcase/product3.png", aspect: "aspect-[4/5]" },
    { src: "/showcase/sports3.png", aspect: "aspect-[3/4]" },
]

export function LandingShowcase({ isMobile }: { isMobile: boolean }) {
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
            container.scrollTop = container.scrollTop - singleHeight
        } else if (container.scrollTop <= singleHeight * 0.5) {
            container.scrollTop = container.scrollTop + singleHeight
        }
    }

    return (
        <div className="col-span-12 lg:col-span-4 lg:border-l border-zinc-200/60 flex flex-col relative h-auto lg:h-screen bg-black overflow-visible lg:overflow-hidden group/showcase text-white">

            {/* Header Section */}
            <div className={`${isMobile ? 'relative p-8 border-b border-white/10' : 'absolute bottom-0 left-0 right-0 p-8 flex flex-col gap-6 z-30'}`}>
                <div className="flex justify-center lg:flex">
                    {!isMobile && (
                        <motion.div
                            animate={{ y: [0, 8, 0], opacity: [0.4, 0.8, 0.4] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
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
                    {/* Avatars */}
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

            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 lg:overflow-y-auto scrollbar-hide active:cursor-grabbing"
            >
                <div ref={contentRef} className="flex gap-0">
                    <div className="flex-1 flex flex-col">
                        {col1.map((item, i) => (
                            <ShowcaseItem key={`col1-${i}`} item={item} i={i} />
                        ))}
                    </div>
                    <div className="flex-1 flex flex-col">
                        {col2.map((item, i) => (
                            <ShowcaseItem key={`col2-${i}`} item={item} i={i} delay={0.2} />
                        ))}
                    </div>
                </div>
            </div>

            {!isMobile && (
                <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black via-black/80 to-transparent z-20 pointer-events-none" />
            )}
        </div>
    )
}

function ShowcaseItem({ item, i, delay = 0 }: { item: any, i: number, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: (i % 5) * 0.1 + delay, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full relative overflow-hidden ${item.aspect}`}
        >
            <ShowcaseMedia src={item.src} index={i} />
            <div className="absolute inset-0 border-[0.5px] border-white/10 pointer-events-none" />
        </motion.div>
    )
}

function ShowcaseMedia({ src, index }: { src: string, index: number }) {
    const isVideo = src.endsWith('.mp4')
    const [isVideoLoaded, setIsVideoLoaded] = React.useState(false)
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const posterSrc = isVideo ? src.replace('.mp4', '.png') : src

    React.useEffect(() => {
        if (isVideo && videoRef.current && videoRef.current.readyState >= 3) {
            setIsVideoLoaded(true)
        }
    }, [isVideo])

    return (
        <div className="w-full h-full relative">
            <img
                src={posterSrc}
                alt={`Showcase ${index}`}
                className={`w-full h-full object-cover grayscale-[0.1] hover:grayscale-0 transition-opacity duration-700 ${isVideo && isVideoLoaded ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}
            />
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
