import { redirect } from "next/navigation"
import Link from "next/link"
import {
  Truck,
  MapPin,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
  Plus,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  getActiveLoadsCount,
  getOnTimePercent,
  getMonthlyRevenue,
  getActiveDriversCount,
  getLoadsForOrg,
  getSession,
} from "@/lib/dal"

export default async function DashboardHomePage() {
  // Server-side: get session and tenant
  const session = await getSession()
  if (!session?.user) {
    redirect("/login")
  }
  const tenantId = session.session.activeOrganizationId
  if (!tenantId) {
    redirect("/onboarding")
  }

  // Fetch KPIs in parallel
  const [activeLoadsCount, monthlyRevenue, activeDriversCount, recentLoads] = await Promise.all([
    getActiveLoadsCount(tenantId),
    getMonthlyRevenue(tenantId),
    getActiveDriversCount(tenantId),
    getLoadsForOrg(tenantId),
  ])

  const greeting =
    new Date().getHours() < 12 ? "Good morning" :
    new Date().getHours() < 18 ? "Good afternoon" :
    "Good evening"

  const formatCurrency = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(1)}k` : `$${n}`

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="font-serif text-3xl tracking-tight" style={{ color: "#16181d" }}>
          {greeting}, {session.user.name?.split(" ")[0] || "there"}.
        </h1>
        <p className="mt-1 font-geist text-sm" style={{ color: "#4a4e57" }}>
          Here&apos;s what&apos;s happening with your fleet today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard
          label="Active loads"
          value={String(activeLoadsCount)}
          icon={Truck}
        />
        <KpiCard
          label="On-time %"
          value="—"
          icon={CheckCircle2}
        />
        <KpiCard
          label="Revenue MTD"
          value={formatCurrency(monthlyRevenue)}
          icon={DollarSign}
        />
        <KpiCard
          label="Drivers on road"
          value={String(activeDriversCount)}
          icon={MapPin}
        />
      </div>

      {/* Active loads + Sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active loads table */}
        <Card className="lg:col-span-2 border-[#e4ddd3] bg-[#fffefb] overflow-hidden">
          <div className="border-b border-[#e4ddd3] p-5 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl" style={{ color: "#16181d" }}>
                Recent loads
              </h2>
              <p className="text-xs font-geist mt-0.5" style={{ color: "#8a8b8f" }}>
                {recentLoads.length} total · {activeLoadsCount} active
              </p>
            </div>
            <Link
              href="/loads"
              className="h-9 px-4 inline-flex items-center justify-center rounded-full bg-[#16181d] hover:bg-[#2a2d35] text-[#f5f2ec] font-geist text-sm transition-colors"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </div>

          {recentLoads.length === 0 ? (
            <EmptyActiveLoads />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e4ddd3]" style={{ background: "#fbf8f3" }}>
                    <th className="text-left font-geist-mono text-[10px] font-medium tracking-[0.04em] uppercase px-5 py-3" style={{ color: "#8a8b8f" }}>
                      Load
                    </th>
                    <th className="text-left font-geist-mono text-[10px] font-medium tracking-[0.04em] uppercase px-5 py-3" style={{ color: "#8a8b8f" }}>
                      Customer
                    </th>
                    <th className="text-left font-geist-mono text-[10px] font-medium tracking-[0.04em] uppercase px-5 py-3" style={{ color: "#8a8b8f" }}>
                      Route
                    </th>
                    <th className="text-left font-geist-mono text-[10px] font-medium tracking-[0.04em] uppercase px-5 py-3" style={{ color: "#8a8b8f" }}>
                      Status
                    </th>
                    <th className="text-right font-geist-mono text-[10px] font-medium tracking-[0.04em] uppercase px-5 py-3" style={{ color: "#8a8b8f" }}>
                      Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentLoads.slice(0, 8).map((ld: any) => (
                    <tr key={ld.id} className="border-b border-[#e4ddd3] last:border-0 hover:bg-[#fbf8f3]">
                      <td className="px-5 py-3 font-mono text-[13px]" style={{ color: "#16181d" }}>
                        {ld.loadNumber}
                      </td>
                      <td className="px-5 py-3" style={{ color: "#4a4e57" }}>
                        {ld.customerName || "—"}
                      </td>
                      <td className="px-5 py-3" style={{ color: "#4a4e57" }}>
                        {ld.originCity && ld.destCity
                          ? `${ld.originCity}, ${ld.originState} → ${ld.destCity}, ${ld.destState}`
                          : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={ld.status} />
                      </td>
                      <td className="px-5 py-3 text-right font-mono text-[13px]" style={{ color: "#16181d" }}>
                        {ld.rate ? `$${ld.rate}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Quick actions + alerts */}
        <div className="space-y-4">
          <Card className="border-[#e4ddd3] bg-[#fffefb] p-5">
            <h3 className="font-geist-mono text-[10px] font-medium tracking-[0.04em] uppercase mb-3" style={{ color: "#8a8b8f" }}>
              Quick actions
            </h3>
            <div className="space-y-2">
              <QuickAction
                href="/loads/new"
                icon={Plus}
                label="Create new load"
                hint="Dispatch a load in under 60 seconds"
              />
              <QuickAction
                href="/trips"
                icon={MapPin}
                label="View trips"
                hint="See all active and completed trips"
              />
              <QuickAction
                href="/invoices/new"
                icon={DollarSign}
                label="Send invoice"
                hint="Bill a delivered load instantly"
              />
            </div>
          </Card>

          <Card className="border-[#e4ddd3] bg-[#fffefb] p-5">
            <h3 className="font-geist-mono text-[10px] font-medium tracking-[0.04em] uppercase mb-3" style={{ color: "#8a8b8f" }}>
              Get started
            </h3>
            <div className="space-y-2.5">
              <AttentionItem
                icon={Truck}
                title="Add your trucks"
                description="Add trucks to your fleet to start dispatching"
                href="/fleet"
              />
              <AttentionItem
                icon={Clock}
                title="Add your drivers"
                description="Invite drivers and assign them to your trucks"
                href="/drivers"
              />
              <AttentionItem
                icon={AlertCircle}
                title="Configure billing"
                description="Set up your rates and customer info"
                href="/settings/billing"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───

function KpiCard({
  label, value, icon: Icon,
}: {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Card className="border-[#e4ddd3] bg-[#fffefb] p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[#fff0e6] text-[#d9622b]">
          <Icon className="h-4 w-4" strokeWidth={1.8} />
        </div>
      </div>
      <p className="font-serif text-3xl tracking-tight" style={{ color: "#16181d" }}>
        {value}
      </p>
      <p className="text-xs font-geist mt-0.5" style={{ color: "#73757a" }}>
        {label}
      </p>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bg: string; color: string }> = {
    available: { label: "Available", bg: "rgba(94,140,106,0.12)", color: "#5e8c6a" },
    booked: { label: "Booked", bg: "rgba(217,98,43,0.12)", color: "#d9622b" },
    dispatched: { label: "Dispatched", bg: "rgba(217,98,43,0.12)", color: "#d9622b" },
    in_transit: { label: "In transit", bg: "rgba(22,24,29,0.08)", color: "#16181d" },
    delivered: { label: "Delivered", bg: "rgba(94,140,106,0.12)", color: "#5e8c6a" },
    completed: { label: "Completed", bg: "rgba(94,140,106,0.12)", color: "#5e8c6a" },
    cancelled: { label: "Cancelled", bg: "rgba(217,98,43,0.12)", color: "#8a8b8f" },
  }
  const c = config[status] || config.available
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-geist font-medium"
      style={{ background: c.bg, color: c.color }}
    >
      <span className="size-1.5 rounded-full" style={{ background: c.color }} />
      {c.label}
    </span>
  )
}

function QuickAction({
  href, icon: Icon, label, hint,
}: {
  href: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  hint: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg p-2.5 -mx-2.5 hover:bg-[#f5f2ec] transition-colors group"
    >
      <div className="flex size-9 items-center justify-center rounded-md bg-[#16181d] text-[#f5f2ec] group-hover:bg-[#2a2d35]">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium" style={{ color: "#16181d" }}>{label}</p>
        <p className="text-[11px] font-geist" style={{ color: "#8a8b8f" }}>{hint}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 text-[#8a8b8f] group-hover:text-[#16181d]" />
    </Link>
  )
}

function AttentionItem({
  icon: Icon, title, description, href,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  href: string
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-2.5 rounded-lg p-2 -mx-2 hover:bg-[#f5f2ec] transition-colors"
    >
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: "#d9622b" }} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium" style={{ color: "#16181d" }}>{title}</p>
        <p className="text-[11px] font-geist mt-0.5" style={{ color: "#73757a" }}>{description}</p>
      </div>
    </Link>
  )
}

function EmptyActiveLoads() {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto w-12 h-12 rounded-full bg-[#fff0e6] flex items-center justify-center mb-4">
        <Truck className="h-5 w-5 text-[#d9622b]" />
      </div>
      <p className="font-geist text-sm font-medium" style={{ color: "#16181d" }}>
        No loads yet
      </p>
      <p className="font-geist text-xs mt-1 max-w-xs mx-auto" style={{ color: "#8a8b8f" }}>
        Create your first load to start dispatching. You can also import loads from another TMS.
      </p>
      <Link
        href="/loads/new"
        className="mt-4 h-9 px-4 inline-flex items-center justify-center rounded-full bg-[#16181d] hover:bg-[#2a2d35] text-[#f5f2ec] font-geist text-sm transition-colors"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Create your first load
      </Link>
    </div>
  )
}
