"use client"

import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { Truck } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Top nav */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-slate-900 flex items-center justify-center">
              <Truck className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900">Muvx</span>
          </Link>
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
