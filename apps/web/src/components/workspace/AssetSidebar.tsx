"use client"

import * as React from "react"
import { useAssets } from "@/context/AssetContext"
import { ChevronLeft, ChevronRight, X, Image as ImageIcon, Film } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AssetSidebar() {
    const { assets, updateAsset, deleteAsset } = useAssets()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const handleAddToCanvas = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        updateAsset(id, { isVisibleOnCanvas: true })
    }

    const handleDragStart = (e: React.DragEvent, asset: any) => {
        e.dataTransfer.setData("application/json", JSON.stringify(asset))
        e.dataTransfer.effectAllowed = "copy"
    }

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`fixed top-1/2 -translate-y-1/2 z-50 bg-white border shadow-sm rounded-full w-8 h-8 transition-all duration-300 ${isCollapsed ? 'left-4' : 'left-60'}`}
            >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>

            <div
                className={`fixed left-0 top-0 bottom-0 bg-white/80 backdrop-blur-md border-r border-zinc-200 z-40 pl-4 pt-4 pb-4 pr-1 transition-all duration-300 w-64 flex flex-col ${isCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'}`}
            >
                <h2 className="text-xs font-semibold mb-6 text-[#3b82f6] uppercase tracking-widest pl-1 pr-3">Library</h2>

                <div
                    className="flex-1 overflow-y-auto space-y-4 pr-1"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#93c5fd transparent'
                    }}
                >
                    <style jsx>{`
                        div::-webkit-scrollbar {
                            width: 4px;
                        }
                        div::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        div::-webkit-scrollbar-thumb {
                            background-color: #93c5fd;
                            border-radius: 4px;
                        }
                        div::-webkit-scrollbar-thumb:hover {
                            background-color: #60a5fa;
                        }
                    `}</style>
                    <div className="grid grid-cols-2 gap-3 pr-4">
                        {assets.map((asset) => (
                            <div
                                key={asset._id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, asset)}
                                onClick={(e) => handleAddToCanvas(asset._id, e)}
                                title={asset.customTitle || "Untitled"}
                                className={`aspect-square rounded-xl overflow-hidden bg-zinc-100 relative group cursor-grab active:cursor-grabbing border-2 transition-all duration-200 ${asset.isVisibleOnCanvas ? 'border-[#3b82f6] shadow-sm ring-1 ring-[#3b82f6]/20' : 'border-transparent hover:border-zinc-300 opacity-60 hover:opacity-100'}`}
                            >
                                {asset.type === 'video' ? (
                                    <video src={asset.url || ''} className="w-full h-full object-cover pointer-events-none" />
                                ) : asset.type === 'text' ? (
                                    <div className="w-full h-full p-2 text-[8px] bg-[#fff9c4] overflow-hidden text-zinc-600 leading-tight">
                                        {asset.content || "Empty Note"}
                                    </div>
                                ) : (
                                    /* eslint-disable-next-line @next/next/no-img-element */
                                    <img src={asset.url || ''} alt="Asset" className="w-full h-full object-cover" />
                                )}

                                {/* Type Badge */}
                                {(asset.type === 'image' || asset.type === 'video') && (
                                    <div className={`absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wide flex items-center gap-0.5 ${asset.type === 'video'
                                        ? 'bg-purple-500/90 text-white'
                                        : 'bg-blue-500/90 text-white'
                                        }`}>
                                        {asset.type === 'video' ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                                        {asset.type}
                                    </div>
                                )}

                                {!asset.isVisibleOnCanvas && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">ADD</span>
                                    </div>
                                )}

                                {/* Delete Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (confirm("Delete permanently?")) {
                                            deleteAsset(asset._id)
                                        }
                                    }}
                                    className="absolute top-1 right-1 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all z-10 hover:bg-white shadow-sm"
                                >
                                    <X size={10} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

