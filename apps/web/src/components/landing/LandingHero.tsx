"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { signIn } from "next-auth/react"
import { MagneticButton } from "./MagneticButton"

export function LandingHero() {
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
                                flow.
                            </span>

                        </motion.span>
                    </motion.h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start pt-4 lg:pt-8">
                    <div className="overflow-hidden">
                        <motion.p variants={item} className="text-xl text-zinc-500 font-light leading-relaxed tracking-tight">
                            Storyboarding, asset generation, and final production—unified. Craft high-end reels, ads, and films with the precision of AI-native tools.
                        </motion.p>
                    </div>

                    <motion.div variants={item} className="flex flex-col items-start gap-4">
                        <MagneticButton onClick={handleLogin}>
                            <div
                                className="relative h-16 px-8 rounded-xl bg-transparent border-2 border-[#3b82f6] text-[#3b82f6] overflow-hidden group hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.3)] transition-all duration-300 active:scale-95 cursor-pointer flex items-center gap-4"
                            >
                                {/* The Curtain (Fill Effect) */}
                                <div className="absolute inset-0 bg-[#3b82f6] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.23,1,0.32,1]" />

                                {/* Content */}
                                <div className="relative z-10 flex items-center gap-4 group-hover:text-white transition-colors duration-300">
                                    <span className="text-xl font-bold tracking-tight">Start Creating</span>
                                    <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
                                </div>
                            </div>
                        </MagneticButton>
                    </motion.div>
                </div>

            </motion.div>
        </div>
    )
}
