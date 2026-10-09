import { Eyebrow } from "./Hero";

/* ─────────────────────────────────────────────────────────────────────────────
 * STOP 04 — Delivered (Stats + Testimonial)
 * ───────────────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: "4s", desc: "from customer email to a priced, ready-to-send load" },
  { value: "1 in 12", desc: "loads that actually need a human decision" },
  { value: "0", desc: "check calls your team has to make by hand" },
  { value: "2.1 days", desc: "faster from delivery to cash in the bank" },
] as const;

export default function Stats() {
  return (
    <section className="flex w-full flex-col gap-12 px-6 pt-[140px] md:px-16">
      <Eyebrow stop="STOP 04 — DELIVERED" subtitle="WHAT CHANGES ON DAY ONE" />

      {/* Headline */}
      <div className="max-w-full font-serif text-[clamp(48px,5.5vw,76px)] leading-[0.96] tracking-[-1.52px]">
        <p className="mb-0 text-[#16181d]">Less typing. Fewer calls.</p>
        <p className="italic text-[#d9622b]">More freight per person.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 border-t border-[#dcd5c9] lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.value}
            className={`flex flex-col gap-3 pb-2 pt-8 pr-7 ${i > 0 ? "border-l border-[#dcd5c9] pl-7" : ""}`}
          >
            <p className="font-serif text-[clamp(56px,6vw,88px)] leading-none tracking-[-2.64px] text-[#16181d]">
              {s.value}
            </p>
            <p className="font-geist text-[15px] leading-[22px] text-[#4a4e57]">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Testimonial */}
      <div className="flex gap-6 pt-24 sm:gap-16">
        {/* Opening quote mark */}
        <span
          className="hidden shrink-0 font-serif text-[160px] leading-[120px] text-[#d9622b] sm:block"
          aria-hidden="true"
        >
          "
        </span>

        <div className="flex flex-col gap-7">
          <p className="font-serif text-[clamp(28px,3.2vw,46px)] leading-[1.17] text-[#16181d]">
            It's the first TMS that feels like it works the night shift for us. I open it at seven
            and the day is already mostly done — it just leaves me the three calls that are actually
            mine.
          </p>

          {/* Attribution */}
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-full bg-[#e7e0d3]">
              <span className="font-serif text-lg text-[#4a4e57]">PR</span>
            </div>
            <div>
              <p className="font-geist text-[15px] font-medium text-[#16181d]">Priya Raman</p>
              <p className="font-geist text-[13px] text-[#8a8b8f]">
                Dispatch Lead, Northbound Freight · 140 trucks
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
