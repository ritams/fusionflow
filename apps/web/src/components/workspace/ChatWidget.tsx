"use client"

import * as React from "react"
import { useState } from "react"
import { Send, Image as ImageIcon, Video, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useAssets } from "@/context/AssetContext"

export function ChatWidget() {
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [outputMode, setOutputMode] = useState<'image' | 'video'>('image')
    const [attachments, setAttachments] = useState<{ id: string, url: string, type: 'image' | 'video' }[]>([])
    const { data: session } = useSession()
    const { refreshAssets } = useAssets()

    const handleSend = async () => {
        if ((!input.trim() && attachments.length === 0) || loading) return
        setLoading(true)

        try {
            // @ts-ignore
            const token = session?.accessToken
            if (!token) {
                console.error("No auth token available")
                return
            }

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }

            let response
            const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

            if (attachments.length > 0) {
                if (outputMode === 'video') {
                    // Animate mode: image-to-video
                    response = await fetch(`${API_URL}/api/generate/animate`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            imageUrl: attachments[0].url,
                            prompt: input
                        })
                    })
                } else {
                    // Edit mode: send all attached images
                    response = await fetch(`${API_URL}/api/generate/edit`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({
                            imageUrls: attachments.map(a => a.url),
                            prompt: input
                        })
                    })
                }
            } else {
                if (outputMode === 'video') {
                    // Text-to-video
                    response = await fetch(`${API_URL}/api/generate/video`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ prompt: input })
                    })
                } else {
                    // Text-to-image
                    response = await fetch(`${API_URL}/api/generate`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify({ prompt: input })
                    })
                }
            }

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.error || 'Generation failed')
            }

            const result = await response.json()
            console.log("Generated:", result)

            // Refresh assets to show the new content on canvas
            await refreshAssets()

        } catch (error) {
            console.error("Error generating:", error)
        } finally {
            setLoading(false)
            setInput("")
            setAttachments([])
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        try {
            const jsonData = e.dataTransfer.getData("application/json")
            if (jsonData) {
                const data = JSON.parse(jsonData)
                if (data.type && data.type !== 'text') {
                    setAttachments(prev => {
                        const assetId = data._id || data.id;
                        if (prev.find(a => a.id === assetId)) return prev
                        return [...prev, { id: assetId, url: data.content || data.url, type: data.type }]
                    })
                }
            }
        } catch (err) {
            console.error("Drop error", err)
        }
    }

    const handleRemoveAttachment = (id: string) => {
        setAttachments(prev => prev.filter(a => a.id !== id))
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const toggleMode = () => {
        setOutputMode(m => m === 'image' ? 'video' : 'image')
    }

    const getPlaceholder = () => {
        if (attachments.length > 0) {
            return outputMode === 'video'
                ? "Describe how to animate this..."
                : "Describe edits to make..."
        }
        return outputMode === 'video'
            ? "Describe a video to generate..."
            : "Describe an image to generate..."
    }

    return (
        <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg group"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
        >
            <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[28px] shadow-2xl p-2 flex flex-wrap items-center gap-2 px-3 transition-all duration-300 group-hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] group-hover:border-[#3b82f6]/20">
                {/* Mode Toggle Button */}
                <button
                    onClick={toggleMode}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all font-medium text-sm ${outputMode === 'video'
                            ? 'bg-purple-100 text-purple-600 border-purple-200 hover:bg-purple-200'
                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                        }`}
                    title={`Click to switch to ${outputMode === 'image' ? 'video' : 'image'} mode`}
                >
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : outputMode === 'video' ? (
                        <Video className="h-4 w-4" />
                    ) : (
                        <ImageIcon className="h-4 w-4" />
                    )}
                    <span className="uppercase text-[10px] tracking-wide font-semibold">
                        {outputMode}
                    </span>
                </button>

                {/* Attachments Preview */}
                {attachments.map(att => (
                    <div key={att.id} className="relative w-10 h-10 rounded-lg overflow-hidden border border-zinc-200 group/att shrink-0">
                        {att.type === 'video' ? (
                            <video src={att.url} className="w-full h-full object-cover" />
                        ) : (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img src={att.url} alt="attachment" className="w-full h-full object-cover" />
                        )}
                        <button
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/att:opacity-100 transition-opacity text-white"
                        >
                            <div className="bg-black/50 rounded-full p-0.5"><span className="sr-only">Remove</span>&times;</div>
                        </button>
                    </div>
                ))}

                <input
                    className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-800 placeholder:text-zinc-400 h-10 min-w-[50px]"
                    placeholder={getPlaceholder()}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={loading}
                />
                <button
                    onClick={handleSend}
                    disabled={loading || (!input.trim() && attachments.length === 0)}
                    className="p-2 rounded-full bg-[#3b82f6] text-white hover:bg-[#2563eb] disabled:opacity-50 disabled:hover:bg-[#3b82f6] transition-all shadow-md hover:shadow-lg active:scale-95 self-end"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    )
}
