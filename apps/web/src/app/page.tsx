import * as React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AuthenticationPage } from "@/components/pages/AuthenticationPage"
import { ClientHome } from "./client-home"

export default async function Home() {
  // If we are building for GH Pages (static export), always show the landing page
  if (process.env.NEXT_PUBLIC_IS_GH_PAGES === "true") {
    return <AuthenticationPage />
  }

  const session = await getServerSession(authOptions)

  if (!session) {
    return <AuthenticationPage />
  }

  return <ClientHome />
}
