/* ─────────────────────────────────────────────────────────────────────────────
 * Logo — the MuvxTMS wordmark, reusable across Navbar / Footer / auth side
 * panel. Pulls the exact styling from the landing Navbar so the brand is
 * consistent everywhere.
 *
 * ───────────────────────────────────────────────────────────────────────────── */
import { Link } from "@tanstack/react-router";

export function Logo({
  href = "/",
  className = "",
  showColorDot = false,
}: {
  href?: string;
  className?: string;
  /** When true (auth side panel), the wordmark inherits the parent text color. */
  showColorDot?: boolean;
}) {
  const brand = (
    <span
      className={`font-serif text-[30px] font-medium leading-none tracking-[-0.015em] ${className}`}
    >
      Muvx<span className="text-[#e8602b]">TMS</span>
    </span>
  );

  if (href) {
    return <Link to={href} className="flex shrink-0 items-center">
      {brand}
    </Link>;
  }

  return brand;
}
