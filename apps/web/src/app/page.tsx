import * as React from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AuthenticationPage } from "@/components/pages/AuthenticationPage"
import { ClientHome } from "./client-home"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return <AuthenticationPage />
  }

  return <ClientHome />
}
