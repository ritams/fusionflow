"use client"

import * as React from "react"
import { Shell } from "@/components/layout/Shell"
import { Button } from "@/components/ui/button"
import { CreateProjectModal } from "@/components/modals/CreateProjectModal"
import { Plus, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function ClientHome() {
    const [modalOpen, setModalOpen] = React.useState(false)

    // Simplified animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    }

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } }
    }

    return (
        <div className="flex min-h-screen flex-col">
            <Shell>
                <div className="h-full flex flex-col items-center justify-center relative p-8">

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="max-w-3xl w-full flex flex-col items-center text-center gap-8 relative z-10"
                    >
                        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full border border-black/5 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-medium text-zinc-600">System Operational</span>
                        </motion.div>

                        <motion.h1
                            variants={item}
                            className="text-6xl md:text-7xl font-bold tracking-tighter text-black leading-[0.95]"
                        >
                            Welcome back, <br />
                            <span className="text-[#3b82f6]">Creator.</span>
                        </motion.h1>

                        <motion.p variants={item} className="text-xl text-zinc-500 max-w-lg font-light">
                            Your workspace is ready. Start a new campaign or pick up where you left off.
                        </motion.p>

                        <motion.div variants={item} className="pt-4 flex flex-col md:flex-row gap-4">
                            <Button
                                size="lg"
                                className="h-14 px-8 text-lg rounded-xl bg-black hover:bg-zinc-800 text-white shadow-xl shadow-black/20 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                                onClick={() => setModalOpen(true)}
                            >
                                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
                                New Project
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 text-lg rounded-xl border-2 border-zinc-200 hover:border-black hover:bg-transparent text-black transition-all duration-300 group"
                            >
                                Recent Files
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </motion.div>
                    </motion.div>

                </div>
                <CreateProjectModal open={modalOpen} onOpenChange={setModalOpen} />
            </Shell>
        </div>
    )
}
