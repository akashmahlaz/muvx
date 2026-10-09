/* ─────────────────────────────────────────────────────────────────────────────
 * TheLine — the animated load-journey timeline from Chicago → Dallas
 *
 * Layout: a 1440-wide fixed canvas (horizontally scrollable on mobile)
 * with inline SVG contour lines, route path, stop markers, and event cards.
 * No external SVG files — everything is pure Tailwind + inline SVG.
 * ───────────────────────────────────────────────────────────────────────────── */

/* ── Data ────────────────────────────────────────────────────────────────── */

const CONTOUR_PATH =
  "M0.5 10.5C260.5 -19.5 440.5 50.5 720.5 18.5C980.5 -11.5 1160.5 46.5 1480.5 0.5";

const ROUTE_PATH =
  "M1.25 181.25C121.25 181.25 181.25 91.25 281.25 91.25C381.25 91.25 441.25 151.25 541.25 151.25C661.25 151.25 721.25 31.25 821.25 31.25C921.25 31.25 981.25 101.25 1081.25 101.25C1171.25 101.25 1211.25 1.25 1281.25 1.25";

interface EventCard {
  time: string;
  label: string;
  body: string;
  /** CSS left/top for the card */
  left: number;
  top: number;
  /** Connector line: x position + top/bottom of the 22px line */
  connX: number;
  connTop: number;
  /** Stop marker center on the route */
  stopX: number;
  stopY: number;
  /** Is this the dark "NEEDED YOU" card? */
  dark?: boolean;
}

const EVENTS: EventCard[] = [
  {
    time: "08:41",
    label: "EMAIL IN",
    body: "Jenna's email read. Load built in 4 seconds.",
    left: 40,
    top: 362,
    connX: 80,
    connTop: 340,
    stopX: 80,
    stopY: 330,
  },
  {
    time: "08:42",
    label: "QUOTED",
    body: "Priced at $2,640 against today's market. 72% win odds.",
    left: 320,
    top: 97,
    connX: 360,
    connTop: 208,
    stopX: 360,
    stopY: 240,
  },
  {
    time: "08:44",
    label: "BOOKED",
    body: "Swift Lines tendered and confirmed. Rate con signed.",
    left: 580,
    top: 332,
    connX: 620,
    connTop: 310,
    stopX: 620,
    stopY: 300,
  },
  {
    time: "13:10",
    label: "NEEDED YOU",
    body: "Storm on I-44. Reroute adds $40, saves 1h 40m. Approve?",
    left: 860,
    top: 21,
    connX: 900,
    connTop: 148,
    stopX: 900,
    stopY: 180,
    dark: true,
  },
  {
    time: "16:32",
    label: "DELIVERED",
    body: "On time. Customer was told before they asked.",
    left: 1120,
    top: 282,
    connX: 1160,
    connTop: 260,
    stopX: 1160,
    stopY: 250,
  },
  {
    time: "16:35",
    label: "INVOICED",
    body: "POD matched to BOL. Invoice sent. Carrier paid Friday.",
    left: 1186,
    top: 27,
    connX: 1360,
    connTop: 118,
    stopX: 1360,
    stopY: 150,
  },
];

/* ── Sub-components ─────────────────────────────────────────────────────── */

/** Light event card (white bg, shadow) */
function LightCard({ e }: { e: EventCard }) {
  return (
    <div
      className="absolute flex w-[228px] flex-col gap-2 rounded-[14px] border border-[#dcd5c9] bg-[#fffefb] px-4 py-3.5 shadow-[0_6px_18px_rgba(58,46,30,0.06)]"
      style={{ left: e.left, top: e.top }}
    >
      <div className="flex items-center gap-2 font-geist-mono text-[10px] font-medium tracking-[0.04em]">
        <span className="text-[#d9622b]">{e.time}</span>
        <span className="text-[#8a8b8f]">{e.label}</span>
      </div>
      <p className="font-geist text-sm font-medium leading-5 text-[#16181d]">{e.body}</p>
    </div>
  );
}

/** Dark "NEEDED YOU" card */
function DarkCard({ e }: { e: EventCard }) {
  return (
    <div
      className="absolute flex w-[228px] flex-col gap-2 rounded-[14px] bg-[#16181d] px-4 py-3.5"
      style={{ left: e.left, top: e.top }}
    >
      <div className="flex items-center gap-2 font-geist-mono text-[10px] font-medium tracking-[0.04em]">
        <span className="text-[#ffb48a]">{e.time}</span>
        <span className="text-[#f5f2ec]">{e.label}</span>
      </div>
      <p className="font-geist text-sm font-medium leading-5 text-[#f5f2ec]">{e.body}</p>
      <div className="flex gap-2">
        <button className="rounded-full bg-[#d9622b] px-3 py-1.5 font-geist text-xs font-semibold text-white">
          Approve
        </button>
        <button className="rounded-full border border-white/30 px-3 py-1.5 font-geist text-xs font-medium text-[#f5f2ec]">
          Why?
        </button>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────── */

export default function TheLine() {
  return (
    <section className="w-full overflow-x-auto">
      {/* Fixed-width canvas — scrolls horizontally on small screens */}
      <div className="relative mx-auto h-[488px] min-w-[1440px]">
        {/* ── Background contour lines ─────────────────────────── */}
        <svg
          className="pointer-events-none absolute inset-x-0 top-0 h-full w-[1480px]"
          viewBox="0 0 1481 488"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {[30, 88, 146, 204, 262, 320, 378].map((y) => (
            <path
              key={y}
              d={CONTOUR_PATH}
              stroke="#E4DDD0"
              strokeLinecap="round"
              strokeLinejoin="round"
              transform={`translate(-20, ${y})`}
            />
          ))}
        </svg>

        {/* ── Route ─────────────────────────────────────────────── */}
        <svg
          className="pointer-events-none absolute left-[80px] top-[150px] h-[183px] w-[1283px]"
          viewBox="0 0 1282.5 182.5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d={ROUTE_PATH}
            stroke="#16181D"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* ── Before / After dashed lines ───────────────────────── */}
        <svg
          className="pointer-events-none absolute left-5 top-[330px] h-px w-[60px]"
          viewBox="0 0 61.5 1.5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0.75 0.75H60.75"
            stroke="#16181D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
        </svg>
        <svg
          className="pointer-events-none absolute left-[1360px] top-[126px] h-6 w-20"
          viewBox="0 0 81.5 25.5"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0.75 24.75L80.75 0.75"
            stroke="#16181D"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="2 5"
          />
        </svg>

        {/* ── City labels ──────────────────────────────────────── */}
        <p className="absolute left-6 top-[304px] font-geist-mono text-[10px] font-medium tracking-[0.04em] text-[#16181d]">
          CHICAGO, IL
        </p>
        <p className="absolute left-[1376px] top-[160px] font-geist-mono text-[10px] font-medium tracking-[0.04em] text-[#16181d]">
          DALLAS, TX
        </p>

        {/* ── Caption ──────────────────────────────────────────── */}
        <p className="absolute left-16 top-3 font-geist-mono text-[10px] tracking-[0.04em] text-[#8a8b8f]">
          ONE REAL LOAD · 7 HOURS 54 MINUTES · 1 HUMAN DECISION
        </p>

        {/* ── Events ───────────────────────────────────────────── */}
        {EVENTS.map((e) => (
          <div key={e.label}>
            {/* Connector line */}
            <div
              className="absolute w-px bg-[#16181d]/35"
              style={{ left: e.connX, top: e.connTop, height: 22 }}
            />

            {/* Stop marker */}
            {e.dark ? (
              <>
                {/* Orange glow ring */}
                <div
                  className="absolute size-9 rounded-full bg-[#d9622b]/15"
                  style={{ left: e.stopX - 18, top: e.stopY - 18 }}
                />
                {/* Solid orange dot */}
                <div
                  className="absolute size-4 rounded-full bg-[#d9622b]"
                  style={{ left: e.stopX - 8, top: e.stopY - 8 }}
                />
              </>
            ) : (
              <div
                className="absolute size-3.5 rounded-full border-2 border-[#16181d] bg-[#f5f2ec]"
                style={{ left: e.stopX - 7, top: e.stopY - 7 }}
              />
            )}

            {/* Card */}
            {e.dark ? <DarkCard e={e} /> : <LightCard e={e} />}
          </div>
        ))}
      </div>
    </section>
  );
}
