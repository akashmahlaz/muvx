import { redirect } from "next/navigation"
import { Truck, MapPin, Receipt, FileText, Plus, Users, DollarSign, ClipboardList, Banknote, TrendingUp, ShieldCheck } from "lucide-react"
import { ModulePage } from "@/components/dashboard/module-page"
import { getSession, getLoadsForOrg } from "@/lib/dal"

export default async function LoadsPage() {
  const session = await getSession()
  if (!session?.user) redirect("/login")
  const tenantId = session.session.activeOrganizationId
  if (!tenantId) redirect("/onboarding")

  const loads = await getLoadsForOrg(tenantId)

  return (
    <ModulePage
      title="Loads"
      description="Dispatch, track, and manage every load in your fleet."
      icon={Truck}
      primaryAction={{ label: "Create new load", href: "/loads/new" }}
      emptyStateTitle="No loads yet"
      emptyStateDescription="Create your first load to start dispatching. You can build loads manually, import from email, or sync with your existing TMS."
      nextSteps={[
        { label: "Add a customer", href: "/customers", description: "Build your customer book" },
        { label: "Set up lanes", href: "/settings/lanes", description: "Pre-define frequent routes" },
        { label: "Import from email", href: "/settings/import", description: "Auto-build loads from emails" },
      ]}
    />
  )
}
