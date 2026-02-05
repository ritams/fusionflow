import React, { useRef, useState } from "react"
import { Play, Pause } from "lucide-react"
import { Asset } from "@/context/AssetContext"

interface AssetContentProps {
    asset: Asset
    title: string
}

export function AssetContent({ asset, title }: AssetContentProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const togglePlay = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    if (asset.type === 'video') {
        return (
            <div className="w-full h-full relative group/video">
                <video
                    ref={videoRef}
                    src={asset.url || ''}
                    className="w-full h-full block object-contain rounded-sm select-none pointer-events-none"
                    draggable={false}
                    onEnded={() => setIsPlaying(false)}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity">
                    <button
                        onClick={togglePlay}
                        onPointerDown={e => e.stopPropagation()}
                        className="bg-black/50 text-white rounded-full p-2 hover:bg-black/70 hover:scale-110 transition-all backdrop-blur-sm"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <img
            src={asset.url || ''}
            alt={title}
            className="w-full h-full block object-cover rounded-sm select-none pointer-events-none"
            draggable={false}
        />
    )
}
