"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { useAuthStore } from "@/lib/stores/auth-store"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Truck,
  Map,
  Users,
  FileText,
  Receipt,
  Banknote,
  ClipboardList,
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
  Building2,
  Bell,
  Search,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"

type NavItem = {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[] // If set, only these roles see this item
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Loads", href: "/loads", icon: Truck },
  { label: "Trips", href: "/trips", icon: Map },
  { label: "Fleet", href: "/fleet", icon: Users },
  { label: "Drivers", href: "/drivers", icon: Users },
  { label: "Invoices", href: "/invoices", icon: FileText },
  { label: "Accounts Payable", href: "/accounts-payable", icon: Receipt },
  { label: "Carrier Pay", href: "/carrier-pay", icon: Banknote },
  { label: "Payroll", href: "/payroll", icon: ClipboardList },
  { label: "Reports", href: "/reports", icon: TrendingUp, roles: ["owner", "admin", "accounting", "operations_manager"] },
  { label: "Settings", href: "/settings", icon: Settings },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, activeOrganization, setUser, setActiveOrganization, reset } = useAuthStore()
  const [orgSwitcherOpen, setOrgSwitcherOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Fetch orgs for switcher
  const { data: orgsData } = useQuery({
    queryKey: ["orgs-list"],
    queryFn: async () => {
      const r = await authClient.organization.list()
      return r.data?.organizations ?? []
    },
  })

  // Hydrate session on mount
  useEffect(() => {
    const hydrate = async () => {
      const { data: session } = await authClient.getSession()
      if (!session?.user) {
        router.push("/login")
        return
      }
      setUser({
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image,
        phone: (session.user as any).phone ?? null,
        role: (session.user as any).role ?? null,
      })

      // Get active org
      if (session.session.activeOrganizationId) {
        const { data: org } = await authClient.organization.getOrganization({
          organizationId: session.session.activeOrganizationId,
        })
        if (org) {
          setActiveOrganization({
            id: org.id,
            name: org.name,
            slug: org.slug,
            logo: org.logo,
            metadata: org.metadata,
          })
        }
      } else {
        // No active org - check if user has any
        const { data: orgs } = await authClient.organization.list()
        const list = orgs?.organizations ?? []
        if (list.length === 0) {
          router.push("/onboarding")
        } else if (list.length === 1) {
          await authClient.organization.setActive({ organizationId: list[0].id })
        } else {
          router.push("/select-org")
        }
      }
    }
    hydrate()
  }, [router, setUser, setActiveOrganization])

  const handleSwitchOrg = async (orgId: string) => {
    setOrgSwitcherOpen(false)
    await authClient.organization.setActive({ organizationId: orgId })
    window.location.reload()
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    reset()
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#f7f3ec" }}>
        <div className="text-sm" style={{ color: "#8a8b8f" }}>Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen" style={{ background: "#f5f2ec" }}>
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-col border-r border-[#e4ddd3] bg-[#fffefb]">
        {/* Brand + org switcher */}
        <div className="border-b border-[#e4ddd3] p-4">
          <Link href="/dashboard" className="flex items-center mb-3">
            <span className="font-serif text-[22px] font-medium tracking-[-0.015em]" style={{ color: "#16181d" }}>
              Muvx<span style={{ color: "#e8602b" }}>TMS</span>
            </span>
          </Link>

          {/* Org switcher */}
          <div className="relative">
            <button
              onClick={() => setOrgSwitcherOpen(!orgSwitcherOpen)}
              className="w-full flex items-center gap-2.5 rounded-lg border border-[#e4ddd3] bg-[#fffdf9] p-2.5 hover:bg-[#fbf8f3] transition-colors text-left"
            >
              <div className="flex size-8 items-center justify-center rounded-md bg-[#fff0e6] text-[#d9622b] flex-shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate" style={{ color: "#16181d" }}>
                  {activeOrganization?.name || "No workspace"}
                </p>
                <p className="text-[11px] font-geist-mono tracking-[0.04em]" style={{ color: "#8a8b8f" }}>
                  /{activeOrganization?.slug || "—"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-[#8a8b8f]" />
            </button>

            {orgSwitcherOpen && orgsData && orgsData.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-[#e4ddd3] bg-[#fffdf9] shadow-lg z-10 overflow-hidden">
                {orgsData.map((org: any) => (
                  <button
                    key={org.id}
                    onClick={() => handleSwitchOrg(org.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 p-2.5 hover:bg-[#fbf8f3] transition-colors text-left",
                      org.id === activeOrganization?.id && "bg-[#fff0e6]"
                    )}
                  >
                    <Building2 className="h-4 w-4 text-[#8a8b8f] flex-shrink-0" />
                    <span className="text-sm truncate" style={{ color: "#16181d" }}>{org.name}</span>
                  </button>
                ))}
                <Link
                  href="/onboarding"
                  onClick={() => setOrgSwitcherOpen(false)}
                  className="flex items-center gap-2.5 p-2.5 border-t border-[#e4ddd3] hover:bg-[#fbf8f3] text-sm"
                  style={{ color: "#d9622b" }}
                >
                  <Plus className="h-4 w-4" />
                  New workspace
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-geist transition-colors",
                  isActive
                    ? "bg-[#16181d] text-[#f5f2ec]"
                    : "text-[#4a4e57] hover:bg-[#f5f2ec] hover:text-[#16181d]"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User menu */}
        <div className="border-t border-[#e4ddd3] p-3 relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="w-full flex items-center gap-2.5 rounded-lg p-2 hover:bg-[#f5f2ec] transition-colors text-left"
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-[#d9622b] text-white text-xs font-semibold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate" style={{ color: "#16181d" }}>
                {user.name}
              </p>
              <p className="text-[11px] truncate" style={{ color: "#8a8b8f" }}>
                {user.email}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-[#8a8b8f]" />
          </button>

          {userMenuOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1 rounded-lg border border-[#e4ddd3] bg-[#fffdf9] shadow-lg overflow-hidden">
              <Link
                href="/settings"
                onClick={() => setUserMenuOpen(false)}
                className="flex items-center gap-2.5 p-2.5 hover:bg-[#fbf8f3] text-sm"
                style={{ color: "#16181d" }}
              >
                <Settings className="h-4 w-4 text-[#8a8b8f]" />
                Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2.5 p-2.5 hover:bg-[#fef2f2] text-sm border-t border-[#e4ddd3]"
                style={{ color: "#d9622b" }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="border-b border-[#e4ddd3] bg-[#fffefb] px-4 lg:px-8 py-3 flex items-center gap-4">
          <div className="lg:hidden">
            <Link href="/dashboard" className="flex items-center">
              <span className="font-serif text-[20px] font-medium" style={{ color: "#16181d" }}>
                Muvx<span style={{ color: "#e8602b" }}>TMS</span>
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-[480px] hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8a8b8f]" />
              <input
                type="search"
                placeholder="Search loads, drivers, trips…"
                className="h-9 w-full rounded-lg border border-[#e4ddd3] bg-[#fffdf9] pl-9 pr-3 text-sm outline-none focus:border-[#d9622b] focus:ring-2 focus:ring-[#d9622b]/20"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg hover:bg-[#f5f2ec] text-[#4a4e57]">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#d9622b]" />
            </button>
            <div className="lg:hidden flex size-8 items-center justify-center rounded-full bg-[#d9622b] text-white text-xs font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
