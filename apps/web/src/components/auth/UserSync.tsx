"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function UserSync() {
    const { data: session } = useSession()

    useEffect(() => {
        if (session?.user) {
            fetch('/api/user/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: session.user.email,
                    name: session.user.name,
                    image: session.user.image
                })
            }).catch(err => console.error("Failed to sync user", err))
        }
    }, [session])

    return null
}
