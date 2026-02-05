"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"

export interface Asset {
    _id: string
    url: string
    type: 'image' | 'video' | 'text'
    prompt?: string
    content?: string // For text
    position?: { x: number, y: number }
    dimensions?: { width: number, height: number }
    customTitle?: string
    isVisibleOnCanvas?: boolean
}

interface AssetContextType {
    assets: Asset[]
    refreshAssets: () => Promise<void>
    updateAsset: (id: string, updates: Partial<Asset>) => Promise<void>
    deleteAsset: (id: string) => Promise<void>
}

const AssetContext = createContext<AssetContextType | undefined>(undefined)

export function AssetProvider({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession()
    const [assets, setAssets] = useState<Asset[]>([])

    // Helper to get auth header
    const getAuthHeader = useCallback((): Record<string, string> => {
        // @ts-ignore
        const token = session?.id_token

        if (!token) return {}

        return {
            'Authorization': `Bearer ${token}`
        }
    }, [session])

    const fetchAssets = useCallback(async () => {
        if (!session?.user?.email) return
        try {
            const headers = getAuthHeader()
            if (!headers['Authorization']) return

            const res = await fetch('/api/assets', {
                headers: headers as HeadersInit
            })
            if (res.ok) {
                const data = await res.json()
                setAssets(data)
            }
        } catch (error) {
            console.error("Failed to fetch assets:", error)
        }
    }, [session, getAuthHeader])

    useEffect(() => {
        fetchAssets()
    }, [fetchAssets])

    const updateAsset = async (id: string, updates: Partial<Asset>) => {
        // Optimistic update
        setAssets(prev => prev.map(a => a._id === id ? { ...a, ...updates } : a))

        try {
            await fetch(`/api/assets/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(updates)
            })
        } catch (error) {
            console.error("Failed to update asset", error)
            // Revert on failure
            fetchAssets()
        }
    }

    const deleteAsset = async (id: string) => {
        // Optimistic delete
        setAssets(prev => prev.filter(a => a._id !== id))

        try {
            await fetch(`/api/assets/${id}`, {
                method: 'DELETE',
                headers: getAuthHeader() as HeadersInit
            })
        } catch (error) {
            console.error("Failed to delete asset", error)
            fetchAssets() // Revert
        }
    }

    return (
        <AssetContext.Provider value={{ assets, refreshAssets: fetchAssets, updateAsset, deleteAsset }}>
            {children}
        </AssetContext.Provider>
    )
}

export function useAssets() {
    const context = useContext(AssetContext)
    if (context === undefined) {
        throw new Error("useAssets must be used within an AssetProvider")
    }
    return context
}
