"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Loader2, Truck, ArrowRight } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    console.log("[SIGNUP] Starting email signup for:", email)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters")
      setLoading(false)
      return
    }

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      })
      if (result.error) {
        console.error("[SIGNUP] Send OTP error:", result.error)
        setError(result.error.message || "Failed to send verification code")
        setLoading(false)
        return
      }
      localStorage.setItem("signup_data", JSON.stringify({ email, name, password }))
      console.log("[SIGNUP] ✅ OTP sent")
      router.push("/signup/verify")
    } catch (err) {
      console.error("[SIGNUP] Signup error:", err)
      setError("An unexpected error occurred")
      setLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setError("")
    setGoogleLoading(true)
    console.log("[SIGNUP] Initiating Google signup...")
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/onboarding",
      })
      if (result.error) {
        console.error("[SIGNUP] Google signup error:", result.error)
        setError(result.error.message || "Google sign-up failed")
        setGoogleLoading(false)
      }
    } catch (err) {
      console.error("[SIGNUP] Google signup exception:", err)
      setError("An unexpected error occurred with Google sign-up")
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f2ec] flex flex-col">
      {/* Top bar */}
      <header className="w-full bg-[#fbf8f3]">
        <div className="mx-auto flex max-w-[1440px] items-center gap-10 px-6 py-[22px] md:px-16">
          <Link href="/" className="flex items-center">
            <span className="font-serif text-[30px] font-medium leading-none tracking-[-0.015em] text-[#16181d]">
              Muvx<span className="text-[#e8602b]">TMS</span>
            </span>
          </Link>
          <div className="ml-auto flex items-center gap-6">
            <span className="hidden sm:block font-geist-mono text-[10px] font-medium tracking-[0.04em] text-[#8a8b8f]">
              GET EARLY ACCESS
            </span>
            <Link
              href="/login"
              className="font-geist text-sm font-medium text-[#4a4e57] hover:text-[#16181d] transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12 md:px-16">
        <div className="w-full max-w-[480px]">
          {/* Eyebrow */}
          <div className="mb-6 flex items-center gap-2.5">
            <span className="size-[7px] shrink-0 rounded-full bg-[#d9622b]" />
            <span className="font-geist-mono text-[11px] font-medium uppercase tracking-[0.04em] text-[#16181d]">
              CREATE ACCOUNT
            </span>
            <span className="font-geist-mono text-[11px] tracking-[0.04em] text-[#8a8b8f]">
              · NO CREDIT CARD REQUIRED
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-[clamp(40px,5vw,56px)] leading-[0.96] tracking-[-0.04em] text-[#16181d] mb-2">
            Start moving <span className="italic text-[#d9622b]">freight</span> in minutes.
          </h1>
          <p className="text-[#4a4e57] font-geist mb-8">
            Dispatch, drivers, documents, and dollars — all in one TMS.
          </p>

          <Card className="border-[#dcd5c9] bg-[#fffefb] shadow-[0_10px_30px_rgba(58,46,30,0.06)]">
            <div className="p-7">
              {error && (
                <div className="mb-5 p-3 text-sm text-[#d9622b] bg-[#d9622b]/[0.08] border border-[#d9622b]/30 rounded-xl">
                  {error}
                </div>
              )}

              {/* Google */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-[#dcd5c9] hover:bg-[#fbf8f3] bg-[#fffdf9] font-geist"
                onClick={handleGoogleSignup}
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

              <div className="relative my-6 flex items-center">
                <div className="flex-1 border-t border-[#dcd5c9]" />
                <span className="px-3 text-xs font-geist-mono tracking-[0.04em] text-[#8a8b8f] uppercase">
                  or
                </span>
                <div className="flex-1 border-t border-[#dcd5c9]" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-geist-mono text-[10px] font-medium tracking-[0.04em] text-[#8a8b8f] uppercase">
                    Full name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 border-[#dcd5c9] focus-visible:ring-[#16181d]/10 focus-visible:border-[#16181d] bg-[#fffdf9]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-geist-mono text-[10px] font-medium tracking-[0.04em] text-[#8a8b8f] uppercase">
                    Work email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 border-[#dcd5c9] focus-visible:ring-[#16181d]/10 focus-visible:border-[#16181d] bg-[#fffdf9]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="font-geist-mono text-[10px] font-medium tracking-[0.04em] text-[#8a8b8f] uppercase">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-[#dcd5c9] focus-visible:ring-[#16181d]/10 focus-visible:border-[#16181d] bg-[#fffdf9]"
                    required
                    minLength={8}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="font-geist-mono text-[10px] font-medium tracking-[0.04em] text-[#8a8b8f] uppercase">
                    Confirm password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 border-[#dcd5c9] focus-visible:ring-[#16181d]/10 focus-visible:border-[#16181d] bg-[#fffdf9]"
                    required
                    minLength={8}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-full bg-[#16181d] hover:bg-[#2a2d35] font-geist text-[#f5f2ec] mt-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending verification code...
                    </>
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Card>

          <p className="text-center text-xs text-[#8a8b8f] mt-6 font-geist leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-[#16181d] hover:underline">Terms</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-[#16181d] hover:underline">Privacy Policy</Link>.
          </p>
        </div>
      </main>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}
