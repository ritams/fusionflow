"use client"

import React from "react"
import { useEditor, EditorClip } from "@/context/EditorContext"
import { useAssets } from "@/context/AssetContext"
import { Image as ImageIcon, Film, Plus } from "lucide-react"
import { generateThumbnail, getVideoDuration } from "@/lib/ffmpegService"

export function EditorLibrary() {
    const { assets } = useAssets()
    const { addClip } = useEditor()

    const mediaAssets = assets.filter(a => a.type === 'image' || a.type === 'video')

    const handleAddClip = async (asset: typeof assets[0]) => {
        let duration = 3 // Default for images
        let thumbnailUrl: string | undefined

        if (asset.type === 'video' && asset.url) {
            try {
                duration = await getVideoDuration(asset.url)
                thumbnailUrl = await generateThumbnail(asset.url, 0)
            } catch (e) {
                console.error('Failed to get video info:', e)
                duration = 5 // Fallback
            }
        }

        const clipData: Omit<EditorClip, 'id' | 'startTime'> = {
            sourceAssetId: asset._id,
            sourceUrl: asset.url || '',
            type: asset.type as 'video' | 'image',
            duration,
            trimStart: 0,
            trimEnd: duration,
            speed: 1,
            transitionIn: 'none',
            transitionOut: 'none',
            filterEffect: 'none',
            thumbnailUrl,
            kenBurns: asset.type === 'image' ? {
                startZoom: 1,
                endZoom: 1.2,
                panX: 0,
                panY: 0,
            } : undefined,
        }

        addClip(clipData)
    }

    const handleDragStart = (e: React.DragEvent, asset: typeof assets[0]) => {
        e.dataTransfer.setData('application/json', JSON.stringify({
            type: 'library-asset',
            asset,
        }))
        e.dataTransfer.effectAllowed = 'copy'
    }

    return (
        <div className="w-56 border-r border-zinc-200 bg-white flex flex-col">
            <div className="p-3 border-b border-zinc-100">
                <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Library</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {mediaAssets.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400 text-xs">
                        No media assets
                    </div>
                ) : (
                    mediaAssets.map(asset => (
                        <div
                            key={asset._id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, asset)}
                            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-50 cursor-grab active:cursor-grabbing transition-colors"
                        >
                            {/* Thumbnail */}
                            <div className="w-12 h-12 rounded-md bg-zinc-100 overflow-hidden flex-shrink-0 relative">
                                {asset.url ? (
                                    asset.type === 'video' ? (
                                        <video
                                            src={asset.url}
                                            className="w-full h-full object-cover"
                                            muted
                                        />
                                    ) : (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            src={asset.url}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    )
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {asset.type === 'video' ? (
                                            <Film className="w-4 h-4 text-zinc-300" />
                                        ) : (
                                            <ImageIcon className="w-4 h-4 text-zinc-300" />
                                        )}
                                    </div>
                                )}

                                {/* Type badge */}
                                <div className={`absolute bottom-0.5 right-0.5 px-1 py-0.5 rounded text-[8px] font-bold uppercase ${asset.type === 'video'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-blue-500 text-white'
                                    }`}>
                                    {asset.type === 'video' ? 'VID' : 'IMG'}
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-zinc-700 truncate">
                                    {asset.customTitle || asset.prompt?.slice(0, 20) || 'Untitled'}
                                </p>
                                <p className="text-[10px] text-zinc-400 mt-0.5">
                                    {asset.type}
                                </p>
                            </div>

                            {/* Add button */}
                            <button
                                onClick={() => handleAddClip(asset)}
                                className="p-1.5 rounded-md text-zinc-300 hover:text-blue-500 hover:bg-blue-50 opacity-0 group-hover:opacity-100 transition-all"
                                title="Add to timeline"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
