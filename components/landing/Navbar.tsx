"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "./landing-utils"

/* ─────────────────────────────────────────────────────────────────────────────
 * Navbar — matches the Figma design: cream bg, logomark, centered links,
 * dark pill CTA. Fully responsive (links collapse on mobile).
 * ───────────────────────────────────────────────────────────────────────────── */

const NAV_ITEMS = [
  { label: "Product", hasDropdown: true, href: "#product" },
  { label: "Solutions", hasDropdown: true, href: "#solutions" },
  { label: "How it works", hasDropdown: false, href: "#how-it-works" },
  { label: "Pricing", hasDropdown: false, href: "#pricing" },
  { label: "Resources", hasDropdown: true, href: "#resources" },
] as const

export default function Navbar() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <header className="w-full bg-[#fbf8f3]">
      <div className="mx-auto flex max-w-[1440px] items-center gap-10 px-6 py-[22px] md:px-16">
        {/* ── Brand ─────────────────────────────────────────────── */}
        <Link href="/" className="flex shrink-0 items-center">
          <span className="font-serif text-[30px] font-medium leading-none tracking-[-0.015em] text-[#16181d]">
            Muvx<span className="text-[#e8602b]">TMS</span>
          </span>
        </Link>

        {/* ── Nav links (hidden on mobile) ──────────────────────── */}
        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="group inline-flex items-center gap-1.5 font-geist text-sm font-medium text-[#4a4e57] transition-colors hover:text-[#16181d]"
            >
              <span>{item.label}</span>
              {item.hasDropdown && (
                <svg
                  className="size-3 text-[#7a7d85] transition-transform group-hover:text-[#16181d]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}
            </a>
          ))}
        </nav>

        {/* ── Right CTA ─────────────────────────────────────────── */}
        <div className="ml-auto flex shrink-0 items-center gap-6 lg:ml-0">
          {user ? (
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-full bg-[#16181d] px-[22px] py-[11px] font-geist text-sm font-medium text-[#f5f2ec] transition-colors hover:bg-[#2a2d35]"
            >
              Dashboard&nbsp;&nbsp;→
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden font-geist text-sm font-medium text-[#4a4e57] transition-colors hover:text-[#16181d] sm:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-[#16181d] px-[22px] py-[11px] font-geist text-sm font-medium text-[#f5f2ec] transition-colors hover:bg-[#2a2d35]"
              >
                Get early access
                <span aria-hidden="true">→</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
