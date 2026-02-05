"use client"

import React, { useRef } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAssets } from "@/context/AssetContext"
import { useSession } from "next-auth/react"

export function UploadButton() {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { refreshAssets } = useAssets()
    const { data: session } = useSession()

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !session?.user?.email) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('http://localhost:3001/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.user.email}`
                },
                body: formData
            })

            if (res.ok) {
                console.log("File uploaded successfully")
                await refreshAssets()
            } else {
                const errorText = await res.text()
                console.error("Upload failed", res.status, errorText)
            }
        } catch (error) {
            console.error("Error uploading file:", error)
        }
    }

    const handleAddText = () => {
        // Calculate center of the viewport in canvas coordinates
        // InfiniteCanvas centers the origin at screen center + offset
        // So Center = -offset.x / scale, -offset.y / scale
        const centerX = -offset.x / scale
        const centerY = -offset.y / scale

        addTextAsset("New Text", { x: centerX, y: centerY })
    }

    return (
        <div className="fixed bottom-8 left-8 z-50 flex items-center gap-4">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,video/*"
                onChange={handleFileChange}
            />

            {/* Main Upload Button */}
            <Button
                onClick={handleClick}
                className="h-14 w-14 rounded-full bg-[#3b82f6] hover:bg-[#2563eb] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="Upload Media"
            >
                <Plus className="h-8 w-8" />
            </Button>
        </div>
    )
}
