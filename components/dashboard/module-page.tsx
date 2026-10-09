import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

type ModulePageProps = {
  title: string
  description: string
  icon: LucideIcon
  primaryAction?: {
    label: string
    href: string
  }
  emptyStateTitle?: string
  emptyStateDescription?: string
  nextSteps?: { label: string; href: string; description: string }[]
}

/**
 * Reusable empty-state module page for dashboard sections.
 * Used while we build out individual modules (Loads, Trips, Fleet, etc.)
 */
export function ModulePage({
  title,
  description,
  icon: Icon,
  primaryAction,
  emptyStateTitle = "No data yet",
  emptyStateDescription = "Get started by adding your first item.",
  nextSteps = [],
}: ModulePageProps) {
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-[#fff0e6] text-[#d9622b] flex-shrink-0">
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="font-serif text-3xl tracking-tight" style={{ color: "#16181d" }}>
              {title}
            </h1>
            <p className="mt-1 font-geist text-sm" style={{ color: "#4a4e57" }}>
              {description}
            </p>
          </div>
        </div>
        {primaryAction && (
          <Link
            href={primaryAction.href}
            className="h-10 px-4 inline-flex items-center justify-center rounded-full bg-[#16181d] hover:bg-[#2a2d35] text-[#f5f2ec] font-geist text-sm transition-colors flex-shrink-0"
          >
            {primaryAction.label}
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Link>
        )}
      </div>

      {/* Empty state */}
      <Card className="border-[#e4ddd3] bg-[#fffefb] overflow-hidden">
        <div className="p-12 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-[#fff0e6] flex items-center justify-center mb-4">
            <Icon className="h-7 w-7 text-[#d9622b]" strokeWidth={1.5} />
          </div>
          <h2 className="font-serif text-2xl" style={{ color: "#16181d" }}>
            {emptyStateTitle}
          </h2>
          <p className="font-geist text-sm mt-2 max-w-md mx-auto" style={{ color: "#73757a" }}>
            {emptyStateDescription}
          </p>
          {primaryAction && (
            <Link
              href={primaryAction.href}
              className="mt-6 h-10 px-5 inline-flex items-center justify-center rounded-full bg-[#16181d] hover:bg-[#2a2d35] text-[#f5f2ec] font-geist text-sm transition-colors"
            >
              {primaryAction.label}
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Link>
          )}
        </div>
      </Card>

      {/* Next steps */}
      {nextSteps.length > 0 && (
        <div>
          <h3 className="font-geist-mono text-[10px] font-medium tracking-[0.04em] uppercase mb-3" style={{ color: "#8a8b8f" }}>
            Next steps
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {nextSteps.map((step) => (
              <Link
                key={step.href}
                href={step.href}
                className="flex items-center justify-between rounded-xl border border-[#e4ddd3] bg-[#fffefb] p-4 hover:border-[#d9622b] hover:bg-[#fffdf9] transition-all group"
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "#16181d" }}>{step.label}</p>
                  <p className="text-[12px] font-geist mt-0.5" style={{ color: "#73757a" }}>{step.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-[#8a8b8f] group-hover:text-[#d9622b] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
