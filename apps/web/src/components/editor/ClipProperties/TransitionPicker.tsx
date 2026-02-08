"use client"

import React from "react"
import { useEditor, EditorClip, TransitionType } from "@/context/EditorContext"
import { ArrowRight, ArrowLeft, Minus } from "lucide-react"

interface TransitionPickerProps {
    clip: EditorClip
}

const TRANSITIONS: { value: TransitionType; label: string; icon: React.ReactNode }[] = [
    { value: 'none', label: 'None', icon: <Minus className="w-3 h-3" /> },
    { value: 'fade', label: 'Fade', icon: <div className="w-3 h-3 bg-gradient-to-r from-transparent to-zinc-400 rounded-sm" /> },
    { value: 'fade-black', label: 'Fade Black', icon: <div className="w-3 h-3 bg-gradient-to-r from-transparent to-black rounded-sm" /> },
    { value: 'crossfade', label: 'Crossfade', icon: <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-sm opacity-50" /> },
    { value: 'slide-left', label: 'Slide Left', icon: <ArrowLeft className="w-3 h-3" /> },
    { value: 'slide-right', label: 'Slide Right', icon: <ArrowRight className="w-3 h-3" /> },
]

export function TransitionPicker({ clip }: TransitionPickerProps) {
    const { updateClip, clips } = useEditor()

    // Find clip index to determine if transitions are applicable
    const clipIndex = clips.findIndex(c => c.id === clip.id)
    const hasPreviousClip = clipIndex > 0
    const hasNextClip = clipIndex < clips.length - 1

    const handleTransitionInChange = (transition: TransitionType) => {
        updateClip(clip.id, { transitionIn: transition })
    }

    const handleTransitionOutChange = (transition: TransitionType) => {
        updateClip(clip.id, { transitionOut: transition })
    }

    return (
        <div className="space-y-4">
            {/* Transition In */}
            {hasPreviousClip && (
                <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-2">
                        Transition In
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                        {TRANSITIONS.map((t) => (
                            <button
                                key={`in-${t.value}`}
                                onClick={() => handleTransitionInChange(t.value)}
                                className={`flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium rounded-md transition-colors ${clip.transitionIn === t.value
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                    }`}
                                title={t.label}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Transition Out */}
            {hasNextClip && (
                <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-2">
                        Transition Out
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                        {TRANSITIONS.map((t) => (
                            <button
                                key={`out-${t.value}`}
                                onClick={() => handleTransitionOutChange(t.value)}
                                className={`flex items-center gap-1.5 px-2 py-1.5 text-[10px] font-medium rounded-md transition-colors ${clip.transitionOut === t.value
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                    }`}
                                title={t.label}
                            >
                                {t.icon}
                                {t.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {!hasPreviousClip && !hasNextClip && (
                <p className="text-xs text-zinc-400 text-center py-2">
                    Add more clips to enable transitions
                </p>
            )}
        </div>
    )
}
