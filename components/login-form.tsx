"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import { Loader2, Truck } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter()
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState("")
  const [resending, setResending] = useState(false)

  const handleSendOTP = async () => {
    setError("")
    setLoading(true)
    console.log("[LOGIN] Sending OTP to:", email)

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      })

      if (result.error) {
        console.error("[LOGIN] Send OTP error:", result.error)
        setError(result.error.message || "Failed to send code")
        setLoading(false)
        return
      }

      console.log("[LOGIN] ✅ OTP sent successfully")
      setStep("otp")
      setLoading(false)
      toast.success("Login code sent to your email")
    } catch (err) {
      console.error("[LOGIN] Send OTP exception:", err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    setError("")
    setLoading(true)
    console.log("[LOGIN] Verifying OTP for:", email)

    if (otp.length !== 6) {
      setError("Please enter a 6-digit code")
      setLoading(false)
      return
    }

    try {
      const result = await authClient.signIn.emailOtp({
        email,
        otp,
      })

      if (result.error) {
        console.error("[LOGIN] Verify OTP error:", result.error)
        setError(result.error.message || "Invalid code")
        setLoading(false)
        return
      }

      console.log("[LOGIN] ✅ OTP verified, checking organization...")

      const { data: orgs } = await authClient.organization.list()

      if (!orgs?.organizations || orgs.organizations.length === 0) {
        console.log("[LOGIN] No organization, redirecting to onboarding")
        router.push("/onboarding")
      } else if (orgs.organizations.length === 1) {
        console.log("[LOGIN] One org, setting active:", orgs.organizations[0].id)
        await authClient.organization.setActive({
          organizationId: orgs.organizations[0].id,
        })
        router.push("/dashboard")
      } else {
        console.log("[LOGIN] Multiple orgs, redirecting to selector")
        router.push("/select-org")
      }
    } catch (err) {
      console.error("[LOGIN] Verify OTP exception:", err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResending(true)
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      })
      toast.success("Code resent!")
    } catch (err) {
      toast.error("Failed to resend code")
    }
    setResending(false)
  }

  const handleGoogleLogin = async () => {
    setError("")
    setGoogleLoading(true)
    console.log("[LOGIN] Initiating Google login...")

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/auth-redirect",
      })

      if (result.error) {
        console.error("[LOGIN] Google login error:", result.error)
        setError(result.error.message || "Google sign-in failed")
        setGoogleLoading(false)
        return
      }
    } catch (err) {
      console.error("[LOGIN] Google login exception:", err)
      setError("An unexpected error occurred with Google sign-in")
      setGoogleLoading(false)
    }
  }

  return (
    <div className={`flex flex-col gap-6 ${className}`} {...props}>
      {/* Header */}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
            <Truck className="h-4 w-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">Muvx</span>
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
          {step === "email" ? "Welcome back" : "Check your email"}
        </h1>
        <p className="text-sm text-slate-500">
          {step === "email"
            ? "Sign in to your workspace"
            : "Enter the code we sent you"}
        </p>
      </div>

      <Card className="border-slate-200/80 shadow-sm shadow-slate-200/50">
        <div className="p-7">
          {error && (
            <div className="mb-5 p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-md">
              {error}
            </div>
          )}

          {step === "email" ? (
            <>
              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-slate-200 hover:bg-slate-50"
                onClick={handleGoogleLogin}
                disabled={googleLoading || loading}
              >
                {googleLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="relative my-6">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-xs text-slate-400 uppercase tracking-wider">
                  or
                </span>
              </div>

              {/* Email input + send code */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700">
                    Work email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11"
                    required
                  />
                </div>

                <Button
                  type="button"
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800"
                  onClick={handleSendOTP}
                  disabled={loading || !email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    "Send login code"
                  )}
                </Button>
              </div>
            </>
          ) : (
            /* OTP Step */
            <div className="space-y-5">
              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Code sent to <strong className="text-slate-900">{email}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-700">
                  Verification code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="h-12 text-center text-2xl tracking-[0.5em] font-mono"
                  autoFocus
                  required
                />
              </div>

              <Button
                type="button"
                className="w-full h-11 bg-slate-900 hover:bg-slate-800"
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify and sign in"
                )}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email")
                    setOtp("")
                  }}
                  className="text-slate-500 hover:text-slate-700"
                >
                  Use different email
                </button>
                <span className="text-slate-300">·</span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={resending}
                  className="text-slate-500 hover:text-slate-700 disabled:opacity-50"
                >
                  {resending ? "Sending..." : "Resend code"}
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {step === "email" && (
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-slate-900 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      )}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
