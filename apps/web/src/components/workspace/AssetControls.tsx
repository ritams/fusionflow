import React, { useState } from "react"
import { X, GripVertical, Pencil, Film, Image as ImageIcon } from "lucide-react"
import { Asset, useAssets } from "@/context/AssetContext"
import { useSession } from "next-auth/react"

interface AssetControlsProps {
    asset: Asset
    title: string
    setTitle: (t: string) => void
    isEditing: boolean
    setIsEditing: (e: boolean) => void
}

export function AssetControls({ asset, title, setTitle, isEditing, setIsEditing }: AssetControlsProps) {
    const { updateAsset, refreshAssets } = useAssets()
    const { data: session } = useSession()
    const [showPromptModal, setShowPromptModal] = useState(false)
    const [promptInput, setPromptInput] = useState("")
    const [actionType, setActionType] = useState<'edit' | 'animate'>('edit')
    const [isLoading, setIsLoading] = useState(false)

    const handleRemove = () => {
        updateAsset(asset._id, { isVisibleOnCanvas: false })
    }

    const handleTitleBlur = () => {
        setIsEditing(false)
        if (title !== asset.customTitle) {
            updateAsset(asset._id, { customTitle: title })
        }
    }

    const handleNativeDragStart = (e: React.DragEvent) => {
        const data = {
            type: asset.type,
            content: asset.type === 'text' ? asset.content : asset.url,
            id: asset._id
        }
        e.dataTransfer.setData("application/json", JSON.stringify(data))
        e.dataTransfer.effectAllowed = "copy"
    }

    const openPromptModal = (type: 'edit' | 'animate') => {
        setActionType(type)
        setPromptInput("")
        setShowPromptModal(true)
    }

    const handleAction = async () => {
        if (!promptInput.trim() || isLoading) return
        setIsLoading(true)

        try {
            // @ts-ignore
            const token = session?.accessToken
            if (!token) {
                console.error("No auth token")
                return
            }

            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
            const endpoint = actionType === 'animate' ? '/api/generate/animate' : '/api/generate/edit'

            const body = actionType === 'animate'
                ? { imageUrl: asset.url, prompt: promptInput }
                : { imageUrls: [asset.url], prompt: promptInput }

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })

            if (response.ok) {
                await refreshAssets()
            } else {
                console.error('Action failed:', await response.text())
            }
        } catch (error) {
            console.error('Action error:', error)
        } finally {
            setIsLoading(false)
            setShowPromptModal(false)
        }
    }

    return (
        <>
            {/* Top Bar - Title + Type Badge */}
            <div className="absolute -top-8 left-0 h-8 flex items-center gap-2 transition-opacity">
                <div
                    className="bg-white/80 backdrop-blur-sm shadow-sm text-zinc-400 p-1 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                    draggable
                    onDragStart={handleNativeDragStart}
                    onPointerDown={(e) => e.stopPropagation()}
                    title="Drag to Chat"
                >
                    <GripVertical className="w-3 h-3" />
                </div>

                {/* Type Badge */}
                {(asset.type === 'image' || asset.type === 'video') && (
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide flex items-center gap-1 ${asset.type === 'video'
                        ? 'bg-purple-100 text-purple-600'
                        : 'bg-blue-100 text-blue-600'
                        }`}>
                        {asset.type === 'video' ? <Film className="w-2.5 h-2.5" /> : <ImageIcon className="w-2.5 h-2.5" />}
                        {asset.type}
                    </div>
                )}

                <div className="flex items-center min-w-[80px] max-w-[280px]">
                    {isEditing ? (
                        <input
                            autoFocus
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onPointerDown={(e) => e.stopPropagation()}
                            onBlur={handleTitleBlur}
                            onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
                            className="bg-white rounded-lg px-3 py-1 outline-none w-full text-sm font-semibold text-zinc-800 shadow-sm border border-zinc-200"
                        />
                    ) : (
                        <span
                            onClick={() => setIsEditing(true)}
                            className="truncate cursor-text px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-semibold text-zinc-700 hover:text-blue-600 transition-colors shadow-sm"
                        >
                            {title}
                        </span>
                    )}
                </div>
            </div>

            {/* Action Buttons - Right side */}
            <div className="absolute -top-8 right-0 h-8 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {asset.type === 'image' && (
                    <>
                        <button
                            onPointerDown={(e) => { e.stopPropagation(); openPromptModal('edit') }}
                            className="bg-white shadow-sm hover:bg-blue-500 hover:text-white text-zinc-400 p-1.5 rounded-lg transition-all hover:scale-105"
                            title="Edit Image"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onPointerDown={(e) => { e.stopPropagation(); openPromptModal('animate') }}
                            className="bg-white shadow-sm hover:bg-purple-500 hover:text-white text-zinc-400 p-1.5 rounded-lg transition-all hover:scale-105"
                            title="Animate to Video"
                        >
                            <Film className="w-3.5 h-3.5" />
                        </button>
                    </>
                )}
                <button
                    onPointerDown={(e) => { e.stopPropagation(); handleRemove() }}
                    className="bg-white shadow-sm hover:bg-red-500 hover:text-white text-zinc-400 p-1.5 rounded-lg transition-all hover:scale-105"
                    title="Remove from canvas"
                >
                    <X className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Inline Prompt Modal - Positioned Below Asset */}
            {showPromptModal && (
                <div
                    className="absolute top-full left-0 right-0 mt-3 z-50"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    <div className={`bg-white rounded-xl shadow-xl border p-3 ${actionType === 'animate' ? 'border-purple-200' : 'border-blue-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`p-1.5 rounded-lg ${actionType === 'animate' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {actionType === 'animate' ? <Film className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
                            </div>
                            <span className="text-sm font-medium text-zinc-700">
                                {actionType === 'animate' ? 'Animate' : 'Edit'}
                            </span>
                            <button
                                onClick={() => setShowPromptModal(false)}
                                className="ml-auto text-zinc-400 hover:text-zinc-600 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                value={promptInput}
                                onChange={(e) => setPromptInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAction()}
                                placeholder={actionType === 'animate' ? "Describe the motion..." : "Describe the edits..."}
                                className="flex-1 bg-zinc-50 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 border border-zinc-200 placeholder:text-zinc-400"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleAction}
                                disabled={!promptInput.trim() || isLoading}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg disabled:opacity-50 transition-all hover:scale-105 ${actionType === 'animate'
                                    ? 'bg-purple-500 hover:bg-purple-600'
                                    : 'bg-blue-500 hover:bg-blue-600'
                                    }`}
                            >
                                {isLoading ? '...' : 'Go'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}


