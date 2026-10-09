import { redirect } from "next/navigation"
import { Settings } from "lucide-react"
import { ModulePage } from "@/components/dashboard/module-page"
import { getSession } from "@/lib/dal"

export default async function SettingsPage() {
  const session = await getSession()
  if (!session?.user) redirect("/login")
  const tenantId = session.session.activeOrganizationId
  if (!tenantId) redirect("/onboarding")

  return (
    <ModulePage
      title="Settings"
      description="Manage your workspace, team, billing, and integrations."
      icon={Settings}
      emptyStateTitle="Settings"
      emptyStateDescription="Configure your workspace, invite team members, set up billing, and connect integrations."
      nextSteps={[
        { label: "Team", href: "/settings/team", description: "Invite and manage members" },
        { label: "Billing", href: "/settings/billing", description: "Subscription and invoices" },
        { label: "Integrations", href: "/settings/integrations", description: "Connect to external systems" },
      ]}
    />
  )
}
