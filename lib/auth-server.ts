// Server-side auth helpers (use only in Server Components, Server Actions, Route Handlers, and proxy)
import "server-only"
import { headers } from "next/headers"
import { auth } from "./auth"

export async function getSession() {
  const headersList = await headers()
  return auth.api.getSession({ headers: headersList })
}

export async function getActiveOrganizationId(): Promise<string | null> {
  const session = await getSession()
  return session?.session?.activeOrganizationId ?? null
}

export async function getCurrentUser() {
  const session = await getSession()
  return session?.user ?? null
}
