"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useMutation, useQuery } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useOnboardingStore, type FleetSize, type PrimaryUse } from "@/lib/stores/onboarding-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import {
  Loader2,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Truck,
  Hash,
  Users,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Reserved slugs that conflict with routes
const RESERVED_SLUGS = [
  "admin", "api", "dashboard", "settings", "login", "signup",
  "onboarding", "select-org", "auth-redirect", "www", "app",
  "help", "support", "billing", "terms", "privacy", "about",
  "contact", "blog", "docs", "status", "public", "static",
]

const FLEET_SIZE_OPTIONS: { value: FleetSize; label: string; description: string }[] = [
  { value: "1-5", label: "1–5 trucks", description: "Owner-operator or small fleet" },
  { value: "6-20", label: "6–20 trucks", description: "Growing regional carrier" },
  { value: "21-50", label: "21–50 trucks", description: "Mid-size operation" },
  { value: "51-100", label: "51–100 trucks", description: "Established carrier" },
  { value: "100+", label: "100+ trucks", description: "Enterprise fleet" },
]

const PRIMARY_USE_OPTIONS: { value: PrimaryUse; label: string; description: string }[] = [
  { value: "long_haul", label: "Long-haul", description: "Over-the-road, multi-state freight" },
  { value: "ltl", label: "LTL", description: "Less-than-truckload, partial shipments" },
  { value: "local", label: "Local delivery", description: "Regional and last-mile" },
  { value: "owner_operator", label: "Owner-operator", description: "Single truck, leased or owned" },
  { value: "brokerage", label: "Brokerage", description: "Arrange freight for carriers" },
  { value: "other", label: "Other", description: "Specialized or mixed operations" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const setActiveOrganization = useAuthStore((s) => s.setActiveOrganization)

  const {
    companyName, slug, dotNumber, mcNumber, fleetSize, primaryUse,
    currentStep, completedSteps,
    setField, nextStep, prevStep, goToStep, reset, isStepValid,
  } = useOnboardingStore()

  const [error, setError] = useState("")
  const [done, setDone] = useState(false)
  const [checkingExistingOrg, setCheckingExistingOrg] = useState(true)

  // ─── Edge case 1: Check if user already completed onboarding ───
  useEffect(() => {
    const checkExistingOrg = async () => {
      console.log("[ONBOARDING] Checking for existing orgs...")
      try {
        const { data: orgs } = await authClient.organization.list()
        const orgsList = orgs?.organizations ?? []

        if (orgsList.length > 0) {
          // User already has at least one org
          // Check if any have completed onboarding
          const completed = orgsList.find((o: any) => {
            try {
              const meta = o.metadata ? JSON.parse(o.metadata) : {}
              return meta.onboardingCompleted === true
            } catch {
              return false
            }
          })

          if (completed) {
            console.log("[ONBOARDING] User has completed org, redirecting to dashboard")
            // Set active and redirect
            await authClient.organization.setActive({ organizationId: completed.id })
            router.push("/dashboard")
            return
          }

          // Has org but no onboarding completed - they were mid-onboarding
          // Pre-fill from existing org
          const existing = orgsList[0] as any
          console.log("[ONBOARDING] Pre-filling from existing org:", existing.slug)
          setField("companyName", existing.name)
          setField("slug", existing.slug)
          try {
            const meta = existing.metadata ? JSON.parse(existing.metadata) : {}
            if (meta.dotNumber) setField("dotNumber", meta.dotNumber)
            if (meta.mcNumber) setField("mcNumber", meta.mcNumber)
            if (meta.fleetSize) setField("fleetSize", meta.fleetSize)
            if (meta.primaryUse) setField("primaryUse", meta.primaryUse)
          } catch {
            // ignore parse errors
          }
        }
      } catch (err) {
        console.error("[ONBOARDING] Failed to check existing orgs:", err)
      } finally {
        setCheckingExistingOrg(false)
      }
    }
    checkExistingOrg()
  }, [router, setField])

  // ─── Slug availability check ───
  const slugIsReserved = RESERVED_SLUGS.includes(slug)
  const slugIsValid = slug.length >= 2 && /^[a-z0-9-]+$/.test(slug) && !slugIsReserved

  const { data: slugCheck, isFetching: checkingSlug } = useQuery({
    queryKey: ["check-slug", slug],
    queryFn: async () => {
      const result = await authClient.organization.checkSlug({ slug })
      return result.data
    },
    enabled: slugIsValid,
    staleTime: 5 * 1000,
    retry: false,
  })

  const slugAvailable = slugCheck ? !slugCheck.exists : null

  // ─── Auto-generate slug from company name (only if user hasn't manually edited) ───
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  useEffect(() => {
    if (!slugManuallyEdited && companyName && currentStep === 0) {
      const generated = companyName
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 50)
      setField("slug", generated)
    }
  }, [companyName, slugManuallyEdited, currentStep, setField])

  // ─── DOT/MC validation ───
  const dotIsValid = dotNumber === "" || /^\d{1,10}$/.test(dotNumber)
  const mcIsValid = mcNumber === "" || /^\d{1,10}$/.test(mcNumber)

  // ─── Final submit ───
  const createOrgMutation = useMutation({
    mutationFn: async () => {
      console.log("[ONBOARDING] Creating organization...")

      // Build metadata with all collected info
      const metadata = {
        dotNumber: dotNumber.trim() || null,
        mcNumber: mcNumber.trim() || null,
        fleetSize: fleetSize || null,
        primaryUse: primaryUse || null,
        onboardingCompleted: true,
        onboardingCompletedAt: new Date().toISOString(),
      }

      const result = await authClient.organization.create({
        name: companyName.trim(),
        slug: slug.trim(),
        metadata: JSON.stringify(metadata),
      })

      if (result.error) {
        // If slug collision, surface that
        if (result.error.code === "ORGANIZATION_ALREADY_EXISTS" || result.error.message?.includes("slug")) {
          throw new Error("This URL is already taken. Please choose another.")
        }
        // If limit reached, explain
        if (result.error.code === "YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS") {
          throw new Error("You've reached the maximum number of organizations. Please delete an existing one first.")
        }
        throw new Error(result.error.message || "Failed to create organization")
      }
      return result.data
    },
    onSuccess: async (data) => {
      if (data?.organization?.id) {
        await authClient.organization.setActive({
          organizationId: data.organization.id,
        })
        setActiveOrganization({
          id: data.organization.id,
          name: data.organization.name,
          slug: data.organization.slug,
          logo: data.organization.logo,
          metadata: data.organization.metadata,
        })
        console.log("[ONBOARDING] ✅ Org created and set active")
        setDone(true)
        toast.success("Welcome to Muvx!")
        reset()
        setTimeout(() => router.push("/dashboard"), 1200)
      }
    },
    onError: (err: Error) => {
      console.error("[ONBOARDING] Create org failed:", err)
      setError(err.message)
    },
  })

  // ─── Step navigation ───
  const handleNext = () => {
    setError("")
    if (currentStep === 0) {
      if (!companyName.trim() || companyName.trim().length < 2) {
        setError("Please enter your company name")
        return
      }
      if (!slug || !slugIsValid) {
        setError("Please choose a valid company URL (lowercase, numbers, hyphens)")
        return
      }
      if (slugIsReserved) {
        setError("This URL is reserved. Please choose another.")
        return
      }
      if (slugAvailable === false) {
        setError("This URL is already taken. Please choose another.")
        return
      }
    }
    if (currentStep === 1) {
      if (!dotIsValid) {
        setError("DOT number must be digits only")
        return
      }
      if (!mcIsValid) {
        setError("MC number must be digits only")
        return
      }
    }
    nextStep()
  }

  const handleSubmit = () => {
    setError("")
    createOrgMutation.mutate()
  }

  // ─── Loading state ───
  if (checkingExistingOrg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400 mx-auto" />
          <p className="mt-4 text-sm text-slate-500">Loading your workspace...</p>
        </div>
      </div>
    )
  }

  // ─── Done state ───
  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-white px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">You&apos;re all set</h1>
          <p className="text-slate-500 mt-2 leading-relaxed">
            Your workspace is ready. Taking you to your dashboard...
          </p>
        </div>
      </div>
    )
  }

  const totalSteps = 3
  const progressPercent = ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Muvx</span>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">
          {/* Progress */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-xs text-slate-500">
                {Math.round(progressPercent)}% complete
              </span>
            </div>
            <Progress value={progressPercent} className="h-1" />
          </div>

          {/* Step content */}
          <Card className="border-slate-200/80 shadow-sm shadow-slate-200/50">
            <div className="p-8 sm:p-10">
              {error && (
                <div className="mb-6 p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md flex items-start gap-2">
                  <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {currentStep === 0 && (
                <StepCompany
                  companyName={companyName}
                  slug={slug}
                  onCompanyNameChange={(v) => setField("companyName", v)}
                  onSlugChange={(v) => {
                    setSlugManuallyEdited(true)
                    setField("slug", v.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                  }}
                  slugIsValid={slugIsValid}
                  slugIsReserved={slugIsReserved}
                  slugAvailable={slugAvailable}
                  checkingSlug={checkingSlug}
                />
              )}

              {currentStep === 1 && (
                <StepIndustry
                  dotNumber={dotNumber}
                  mcNumber={mcNumber}
                  onDotChange={(v) => setField("dotNumber", v.replace(/\D/g, ""))}
                  onMcChange={(v) => setField("mcNumber", v.replace(/\D/g, ""))}
                  dotIsValid={dotIsValid}
                  mcIsValid={mcIsValid}
                />
              )}

              {currentStep === 2 && (
                <StepPersonalize
                  fleetSize={fleetSize}
                  primaryUse={primaryUse}
                  onFleetSizeChange={(v) => setField("fleetSize", v)}
                  onPrimaryUseChange={(v) => setField("primaryUse", v)}
                />
              )}
            </div>

            {/* Footer nav */}
            <div className="border-t border-slate-100 px-8 sm:px-10 py-5 bg-slate-50/50 flex items-center justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={prevStep}
                disabled={currentStep === 0 || createOrgMutation.isPending}
                className="text-slate-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {currentStep < totalSteps - 1 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid(currentStep) || checkingSlug}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={createOrgMutation.isPending}
                  className="bg-slate-900 hover:bg-slate-800"
                >
                  {createOrgMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating workspace...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create workspace
                    </>
                  )}
                </Button>
              )}
            </div>
          </Card>

          {/* Trust signals */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>SOC 2 ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Encrypted at rest</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Multi-tenant isolated</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Company basics
// ─────────────────────────────────────────────────────────────────────────────
function StepCompany({
  companyName, slug,
  onCompanyNameChange, onSlugChange,
  slugIsValid, slugIsReserved, slugAvailable, checkingSlug,
}: {
  companyName: string
  slug: string
  onCompanyNameChange: (v: string) => void
  onSlugChange: (v: string) => void
  slugIsValid: boolean
  slugIsReserved: boolean
  slugAvailable: boolean | null
  checkingSlug: boolean
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 mb-4">
          <Building2 className="h-5 w-5 text-slate-700" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          Name your company
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          This is the workspace your team will use. You can rename it later.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-slate-700">
            Company name
          </Label>
          <Input
            id="companyName"
            type="text"
            placeholder="Acme Trucking Co."
            value={companyName}
            onChange={(e) => onCompanyNameChange(e.target.value)}
            className="h-11"
            autoFocus
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug" className="text-slate-700">
            Company URL
          </Label>
          <div className="flex items-center rounded-md border border-slate-200 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-slate-900/10 focus-within:border-slate-300">
            <span className="px-3 text-sm text-slate-400 bg-slate-50 border-r border-slate-200 h-11 flex items-center">
              muvx.com/
            </span>
            <input
              id="slug"
              type="text"
              placeholder="acme-trucking"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              className="flex-1 h-11 px-3 text-sm bg-transparent outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="min-h-[20px] text-xs">
            {slug && slugIsReserved && (
              <p className="text-amber-600">This URL is reserved. Please choose another.</p>
            )}
            {slug && !slugIsValid && !slugIsReserved && (
              <p className="text-amber-600">Use lowercase letters, numbers, and hyphens only.</p>
            )}
            {slug && slugIsValid && checkingSlug && (
              <p className="text-slate-500">Checking availability...</p>
            )}
            {slug && slugIsValid && !checkingSlug && slugAvailable === true && (
              <p className="text-emerald-600">✓ This URL is available</p>
            )}
            {slug && slugIsValid && !checkingSlug && slugAvailable === false && (
              <p className="text-red-600">✗ This URL is already taken</p>
            )}
            {!slug && (
              <p className="text-slate-500">Your team will use this URL to sign in.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2: Industry details
// ─────────────────────────────────────────────────────────────────────────────
function StepIndustry({
  dotNumber, mcNumber, onDotChange, onMcChange, dotIsValid, mcIsValid,
}: {
  dotNumber: string
  mcNumber: string
  onDotChange: (v: string) => void
  onMcChange: (v: string) => void
  dotIsValid: boolean
  mcIsValid: boolean
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 mb-4">
          <Hash className="h-5 w-5 text-slate-700" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          Regulatory details
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          Optional, but speeds up your DOT/MC compliance workflows.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="dotNumber" className="text-slate-700 flex items-center gap-2">
            DOT number
            <span className="text-xs font-normal text-slate-400">Optional</span>
          </Label>
          <Input
            id="dotNumber"
            type="text"
            inputMode="numeric"
            placeholder="1234567"
            value={dotNumber}
            onChange={(e) => onDotChange(e.target.value)}
            maxLength={10}
            className={cn("h-11 font-mono", !dotIsValid && "border-red-300")}
            autoFocus
          />
          {!dotIsValid && (
            <p className="text-xs text-red-600">DOT number must be digits only (up to 10 digits).</p>
          )}
          {dotIsValid && (
            <p className="text-xs text-slate-500">
              Issued by the Federal Motor Carrier Safety Administration (FMCSA).
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="mcNumber" className="text-slate-700 flex items-center gap-2">
            MC number
            <span className="text-xs font-normal text-slate-400">Optional</span>
          </Label>
          <Input
            id="mcNumber"
            type="text"
            inputMode="numeric"
            placeholder="654321"
            value={mcNumber}
            onChange={(e) => onMcChange(e.target.value)}
            maxLength={10}
            className={cn("h-11 font-mono", !mcIsValid && "border-red-300")}
          />
          {!mcIsValid && (
            <p className="text-xs text-red-600">MC number must be digits only.</p>
          )}
          {mcIsValid && (
            <p className="text-xs text-slate-500">
              Required for interstate carriers transporting regulated commodities.
            </p>
          )}
        </div>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-md flex gap-2.5">
          <ShieldCheck className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            We never share your regulatory data. Numbers are stored encrypted and used only to pre-fill compliance forms.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3: Personalization
// ─────────────────────────────────────────────────────────────────────────────
function StepPersonalize({
  fleetSize, primaryUse, onFleetSizeChange, onPrimaryUseChange,
}: {
  fleetSize: FleetSize | ""
  primaryUse: PrimaryUse | ""
  onFleetSizeChange: (v: FleetSize) => void
  onPrimaryUseChange: (v: PrimaryUse) => void
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100 mb-4">
          <Users className="h-5 w-5 text-slate-700" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
          Tell us about your operation
        </h2>
        <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
          We&apos;ll tailor Muvx to your fleet size and freight type.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-slate-700 flex items-center gap-2">
            Fleet size
            <span className="text-xs font-normal text-slate-400">Optional</span>
          </Label>
          <RadioGroup
            value={fleetSize}
            onValueChange={(v) => onFleetSizeChange(v as FleetSize)}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          >
            {FLEET_SIZE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`fleet-${opt.value}`}
                className={cn(
                  "flex flex-col p-3 border rounded-md cursor-pointer transition-all text-left",
                  fleetSize === opt.value
                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                )}
              >
                <RadioGroupItem value={opt.value} id={`fleet-${opt.value}`} className="sr-only" />
                <span className="text-sm font-medium text-slate-900">{opt.label}</span>
                <span className="text-xs text-slate-500 mt-0.5">{opt.description}</span>
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-slate-700 flex items-center gap-2">
            Primary operation
            <span className="text-xs font-normal text-slate-400">Optional</span>
          </Label>
          <RadioGroup
            value={primaryUse}
            onValueChange={(v) => onPrimaryUseChange(v as PrimaryUse)}
            className="grid grid-cols-1 sm:grid-cols-2 gap-2"
          >
            {PRIMARY_USE_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                htmlFor={`use-${opt.value}`}
                className={cn(
                  "flex flex-col p-3 border rounded-md cursor-pointer transition-all text-left",
                  primaryUse === opt.value
                    ? "border-slate-900 bg-slate-50 ring-1 ring-slate-900"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                )}
              >
                <RadioGroupItem value={opt.value} id={`use-${opt.value}`} className="sr-only" />
                <span className="text-sm font-medium text-slate-900">{opt.label}</span>
                <span className="text-xs text-slate-500 mt-0.5">{opt.description}</span>
              </label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  )
}
