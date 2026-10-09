"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"

type SessionData = {
  user: { id: string; name: string; email: string; role?: string | null } | null
  loading: boolean
}

/**
 * Next.js-compatible replacement for TMS-project's useAuth() hook.
 * Returns the current Better Auth session.
 */
export function useAuth(): SessionData {
  const [data, setData] = useState<SessionData>({ user: null, loading: true })

  useEffect(() => {
    let mounted = true
    authClient
      .getSession()
      .then(({ data: session }) => {
        if (!mounted) return
        setData({
          user: session?.user
            ? {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: (session.user as any).role ?? null,
              }
            : null,
          loading: false,
        })
      })
      .catch(() => {
        if (!mounted) return
        setData({ user: null, loading: false })
      })
    return () => {
      mounted = false
    }
  }, [])

  return data
}
