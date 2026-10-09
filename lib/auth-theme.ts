/**
 * Shared visual language for the auth + onboarding screens.
 * One product, one palette — derived from the landing page Hero.
 *
 * Source of truth: components/landing/Hero.tsx
 */

/** Page background — the Hero's cream. */
export const authPageBg = "#f7f3ec"

/** Ink — headings and primary buttons. */
export const authInk = "#16181d"
export const authInkHover = "#2a2d35"

/** Amber accent — the italic line in every Hero headline. */
export const authAccent = "#d9622b"
export const authAccentHover = "#e04e1c"
export const authAccentTint = "#fff0e6"

/** Hairlines and muted text. */
export const authRule = "#e4ddd3"
export const authMuted = "#73757a"
export const authMutedSoft = "#8a8b8f"
export const authBorder = "#ece3d8"
export const authCardBg = "#fffdf9"
export const authOnAccent = "#f5f2ec"
export const authSuccess = "#5e8c6a"

/** The warm brown shadow the landing cards use. */
export const authShadow = "shadow-[0_10px_30px_rgba(58,46,30,0.06)]"

/** Primary pill button. */
export const btnPrimary =
  "inline-flex h-11 w-full items-center justify-center rounded-full bg-[#16181d] px-7 font-geist text-[15px] font-medium text-[#f5f2ec] transition-colors hover:bg-[#2a2d35] disabled:cursor-not-allowed disabled:opacity-60"

/** Secondary pill button. */
export const btnSecondary =
  "inline-flex h-11 w-full items-center justify-center rounded-full border border-[rgba(22,24,29,0.22)] px-7 font-geist text-[15px] font-medium text-[#16181d] transition-colors hover:bg-[#ece7df] disabled:cursor-not-allowed disabled:opacity-60"

/** Text inputs. */
export const inputBase =
  "h-11 w-full rounded-lg border border-[#d1ccc5] bg-white px-3 text-[15px] text-[#16181d] placeholder-[#a8a29a] transition-colors focus:border-[#d9622b] focus:outline-none focus:ring-2 focus:ring-[#d9622b]/20"

export const inputWithIcon =
  "h-11 w-full rounded-lg border border-[#d1ccc5] bg-white pl-10 pr-3 text-[15px] text-[#16181d] placeholder-[#a8a29a] transition-colors focus:border-[#d9622b] focus:outline-none focus:ring-2 focus:ring-[#d9622b]/20"

/** Uppercase micro-label used above every field. */
export const fieldLabel =
  "mb-1.5 block font-geist-mono text-[11px] font-medium uppercase tracking-[0.04em] text-[#8a8b8f]"

export const fieldError = "mt-1.5 text-[12.5px] text-[#b91c1c]"

export const errorBanner =
  "rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13.5px] text-[#991c1c]"

/** Serif display heading. */
export const displayHeading =
  "font-serif text-[clamp(32px,4.4vw,46px)] font-normal leading-[1.04] tracking-[-0.03em] text-[#16181d]"

/** Italic accent word. */
export const italicAccent = "italic text-[#d9622b]"

/** Eyebrow used in STOP labels. */
export const eyebrowStop =
  "flex items-center gap-2.5"
