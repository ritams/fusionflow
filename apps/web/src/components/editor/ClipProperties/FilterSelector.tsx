"use client"

import React from "react"
import { useEditor, EditorClip, FilterType } from "@/context/EditorContext"

interface FilterSelectorProps {
    clip: EditorClip
}

const FILTERS: { value: FilterType; label: string; preview: string }[] = [
    { value: 'none', label: 'None', preview: 'bg-zinc-200' },
    { value: 'grayscale', label: 'B&W', preview: 'bg-gradient-to-br from-gray-400 to-gray-600' },
    { value: 'sepia', label: 'Sepia', preview: 'bg-gradient-to-br from-amber-300 to-amber-600' },
    { value: 'vintage', label: 'Vintage', preview: 'bg-gradient-to-br from-orange-200 to-yellow-400' },
    { value: 'contrast', label: 'Contrast', preview: 'bg-gradient-to-br from-zinc-900 to-zinc-400' },
    { value: 'brightness', label: 'Bright', preview: 'bg-gradient-to-br from-yellow-100 to-white' },
]

export function FilterSelector({ clip }: FilterSelectorProps) {
    const { updateClip } = useEditor()

    const handleFilterChange = (filter: FilterType) => {
        updateClip(clip.id, { filterEffect: filter })
    }

    return (
        <div>
            <label className="block text-xs font-medium text-zinc-500 mb-2">
                Filter Effect
            </label>

            <div className="grid grid-cols-3 gap-2">
                {FILTERS.map((filter) => (
                    <button
                        key={filter.value}
                        onClick={() => handleFilterChange(filter.value)}
                        className={`flex flex-col items-center p-2 rounded-lg border transition-all ${clip.filterEffect === filter.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
                            }`}
                    >
                        <div
                            className={`w-8 h-8 rounded-md mb-1.5 ${filter.preview}`}
                        />
                        <span className="text-[10px] font-medium text-zinc-600">
                            {filter.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
