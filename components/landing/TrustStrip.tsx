/* ─────────────────────────────────────────────────────────────────────────────
 * TrustStrip — "MOVING FREIGHT WITH" partner logos bar
 *
 * Each "logo" is a styled text wordmark in a distinct font/weight to mimic
 * real brand identities. Responsive: wraps on mobile.
 * ───────────────────────────────────────────────────────────────────────────── */

const PARTNERS = [
  { name: "Northbound", cls: "font-serif text-[26px] not-italic" },
  { name: "KESTREL", cls: "font-geist text-xl font-semibold tracking-[2.4px]" },
  { name: "Ironwood & Co.", cls: "font-serif text-[26px] italic" },
  { name: "MERIDIAN 3PL", cls: "font-geist-mono text-sm font-medium tracking-[0.04em]" },
  { name: "bluewater", cls: "font-geist text-xl font-semibold tracking-[-0.4px]" },
  { name: "Pinecrest", cls: "font-serif text-[26px] not-italic" },
] as const;

export default function TrustStrip() {
  return (
    <section className="w-full border-t border-[#dcd5c9] px-6 pb-14 pt-9 md:px-16">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-12 gap-y-5">
        <p className="shrink-0 font-geist-mono text-[10px] font-medium tracking-[0.04em] text-[#8a8b8f]">
          MOVING FREIGHT WITH
        </p>
        <div className="flex flex-1 flex-wrap items-center justify-between gap-x-10 gap-y-4 text-[#4a4e57]">
          {PARTNERS.map((p) => (
            <span key={p.name} className={`shrink-0 opacity-70 ${p.cls}`}>
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
