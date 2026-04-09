"use client";

import { useEffect, useRef } from "react";

// ─── Data ───────────────────────────────────────────────────────────────────

const MONTHS = [
  { num: "I",    name: "Emberi",    days: 28, note: "" },
  { num: "II",   name: "Florenti",  days: 28, note: "" },
  { num: "III",  name: "Rufat",     days: 28, note: "" },
  { num: "IV",   name: "Virel",     days: 28, note: "" },
  { num: "V",    name: "Auren",     days: 28, note: "" },
  { num: "VI",   name: "Aka",       days: 28, note: "Arash" },
  { num: "VII",  name: "Biya",      days: 28, note: "Bia" },
  { num: "VIII", name: "Vorsthal",  days: 28, note: "" },
  { num: "IX",   name: "Serathal",  days: 28, note: "" },
  { num: "X",    name: "Caliven",   days: 28, note: "" },
  { num: "XI",   name: "Noctiven",  days: 28, note: "" },
  { num: "XII",  name: "Tristiven", days: 28, note: "" },
  { num: "XIII", name: "Finiven",   days: 29, note: "Intercalary" },
] as const;

const DAYS = [
  { name: "Mona",  constel: "Cautus"    },
  { name: "Solla", constel: "Bia"       },
  { name: "Aetra", constel: "Aetheri"   },
  { name: "Burta", constel: "Florentia" },
  { name: "Kaisa", constel: "Arash"     },
  { name: "Rosa",  constel: "Rozalia"   },
  { name: "Sapta", constel: "Aureth"    },
] as const;

const CONSTELLATIONS = [
  { domain: "Spasium",    name: "Arash",     entity: "Space & Void"        },
  { domain: "Kuantitas",  name: "Aureth",    entity: "Quantity & Measure"  },
  { domain: "Kualitas",   name: "Bia",       entity: "Quality & Essence"   },
  { domain: "Pertumbuhan",name: "Florentia", entity: "Growth & Life"       },
  { domain: "Eksistensi", name: "Rozalia",   entity: "Existence & Being"   },
  { domain: "Intensitas", name: "Aetheri",   entity: "Intensity & Force"   },
  { domain: "Kausalitas", name: "Cautus",    entity: "Causality & Fate"    },
] as const;

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarBackground() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() < 0.15 ? 1.5 : 1,
    opacity: 0.3 + Math.random() * 0.5,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* Ambient glows */}
      <div className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(83,74,183,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 70%, rgba(29,158,117,0.06) 0%, transparent 55%)
          `,
        }}
      />
      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {stars.map((s) => (
          <circle
            key={s.id}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.size}
            fill={s.id % 8 === 0 ? "#c9a84c" : "white"}
            opacity={s.opacity}
          />
        ))}
      </svg>
    </div>
  );
}

function NavBar() {
  return (
    <nav className="relative z-10 border-b border-[rgba(201,168,76,0.2)]">
      <div className="mx-auto max-w-5xl px-8 py-6 flex items-center justify-between">
        <a
          href="#"
          className="font-cinzel text-[13px] tracking-widest text-[#c9a84c] no-underline"
        >
          Septaera
        </a>
        <ul className="hidden sm:flex gap-8 list-none m-0 p-0">
          {["months", "days", "constellations", "events"].map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className="text-[13px] tracking-[0.08em] uppercase text-[#9a8e78] no-underline transition-colors duration-300 hover:text-[#c9a84c]"
              >
                {id}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

function FloatingOrb() {
  return (
    <div className="flex justify-center my-12">
      <div
        className="relative w-44 h-44 rounded-full flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(201,168,76,0.18), rgba(83,74,183,0.12) 50%, rgba(13,11,14,0.6))",
          border: "0.5px solid rgba(201,168,76,0.3)",
          animation: "orbFloat 6s ease-in-out infinite",
        }}
      >
        {/* Outer rings */}
        <div
          className="absolute rounded-full"
          style={{
            inset: "-12px",
            border: "0.5px solid rgba(201,168,76,0.1)",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            inset: "-28px",
            border: "0.5px solid rgba(201,168,76,0.05)",
          }}
        />
        <div className="font-cinzel text-[11px] text-[#e8d08a] tracking-[0.2em] text-center leading-loose">
          <div>Year I</div>
          <div>1 Emberi</div>
          <div>Solla</div>
        </div>
      </div>
    </div>
  );
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6 my-8 text-[11px] tracking-[0.2em] uppercase text-[#7a6030]">
      <div className="flex-1 h-px bg-[rgba(201,168,76,0.2)]" />
      {label}
      <div className="flex-1 h-px bg-[rgba(201,168,76,0.2)]" />
    </div>
  );
}

function MonthsGrid() {
  return (
    <section id="months" className="py-16">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-3">
        Temporal Structure
      </p>
      <h2 className="font-cinzel text-3xl text-white mb-3 leading-snug">
        Months of the Septaera Year
      </h2>
      <p className="text-lg text-[#9a8e78] leading-relaxed max-w-xl mb-10 font-light italic">
        Every month begins on Solla — a constant anchor woven into time by Aureth&apos;s design.
      </p>
      <div
        className="grid border border-[rgba(201,168,76,0.2)]"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1px" }}
      >
        {MONTHS.map((m) => (
          <div
            key={m.num}
            className="bg-[#131118] p-5 border border-[rgba(201,168,76,0.2)] transition-colors duration-300 hover:bg-[#1a1724]"
          >
            <div className="text-[10px] text-[#7a6030] tracking-[0.2em] mb-1">
              Month {m.num}
            </div>
            <div className="font-cinzel text-[12px] text-[#e8d08a] mb-1">{m.name}</div>
            <div className="text-[11px] text-[#9a8e78] italic">
              {m.days} days{m.note ? ` · ${m.note}` : ""}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DaysStrip() {
  return (
    <section id="days" className="py-16">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-3">
        Weekly Cycle
      </p>
      <h2 className="font-cinzel text-3xl text-white mb-3 leading-snug">
        Days of the Sacred Week
      </h2>
      <p className="text-lg text-[#9a8e78] leading-relaxed max-w-xl mb-10 font-light italic">
        Each day bears the name of one constellation, marking their watch over the mortal world.
      </p>
      <div
        className="grid border border-[rgba(201,168,76,0.2)]"
        style={{ gridTemplateColumns: "repeat(7, 1fr)", gap: "1px" }}
      >
        {DAYS.map((d) => (
          <div
            key={d.name}
            className="bg-[#131118] py-5 px-2 text-center border border-[rgba(201,168,76,0.2)]"
          >
            <span className="font-cinzel block text-[11px] text-[#c9a84c] mb-1">
              {d.name}
            </span>
            <span className="text-[10px] text-[#9a8e78] italic">{d.constel}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ConstellationsGrid() {
  return (
    <section id="constellations" className="py-16">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-3">
        Primordial Forces
      </p>
      <h2 className="font-cinzel text-3xl text-white mb-3 leading-snug">
        The Governing Constellations
      </h2>
      <p className="text-lg text-[#9a8e78] leading-relaxed max-w-xl mb-10 font-light italic">
        Seven forces uphold the laws of existence. Each has lent their name to time itself.
      </p>
      <div
        className="grid border border-[rgba(201,168,76,0.2)]"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1px" }}
      >
        {CONSTELLATIONS.map((c) => (
          <div
            key={c.name}
            className="bg-[#131118] p-5 border border-[rgba(201,168,76,0.2)] transition-colors duration-300 hover:bg-[#1a1724]"
          >
            <div className="text-[10px] text-[#7a6030] tracking-[0.2em] uppercase mb-2">
              {c.domain}
            </div>
            <div className="font-cinzel text-[14px] text-[#e8d08a] mb-1">{c.name}</div>
            <div className="text-[12px] text-[#9a8e78] italic">{c.entity}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function EventsSection() {
  return (
    <section id="events" className="py-16">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] mb-3">
        Chronological Record
      </p>
      <h2 className="font-cinzel text-3xl text-white mb-8 leading-snug">
        Notable Events
      </h2>
      <div
        className="bg-[#1a1724] p-10 relative"
        style={{ border: "0.5px solid rgba(201,168,76,0.35)" }}
      >
        {/* Gold left accent */}
        <div className="absolute top-0 left-0 w-[3px] h-full bg-[#c9a84c]" />

        <div className="font-cinzel text-xl text-[#c9a84c] mb-4">
          Sayembara Harmoni Alam
        </div>
        <div className="flex flex-wrap gap-8 text-[13px] text-[#9a8e78] mb-4 tracking-[0.05em]">
          <span><strong className="text-[#e8e0d0]">Start:</strong> 1 Vorsthal</span>
          <span><strong className="text-[#e8e0d0]">End:</strong> 26 Caliven</span>
          <span><strong className="text-[#e8e0d0]">Duration:</strong> 82 days</span>
          <span><strong className="text-[#e8e0d0]">Closing Day:</strong> Rosa</span>
        </div>
        <p className="text-base text-[#9a8e78] leading-relaxed italic">
          The great tournament organized by the Guild Halimawan in the city of Elaris.
          Adventurers, wanderers, and those seeking fortune converge under the seal of the
          Sayembara — a competition whose outcome echoes across the continent&apos;s political order.
        </p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[rgba(201,168,76,0.2)] py-12 text-center">
      <div className="font-cinzel text-[14px] text-[#c9a84c] mb-2">Septaera</div>
      <div className="text-[12px] text-[#7a6030] tracking-[0.1em]">
        A world shaped by seven constellations — and the mortals who dare to walk beneath them.
      </div>
    </footer>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function SeptaeraCalendarPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for fade-in
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(".fade-target");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Global styles — inject once */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap');

        .font-cinzel { font-family: 'Cinzel Decorative', serif !important; }

        body {
          background: #0d0b0e;
          color: #e8e0d0;
          font-family: 'Cormorant Garamond', serif;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }

        .fade-target {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
      `}</style>

      <div className="relative min-h-screen overflow-x-hidden">
        <StarBackground />

        <div className="relative z-10">
          <NavBar />

          <main className="mx-auto max-w-5xl px-8">
            {/* Hero */}
            <section
              ref={heroRef}
              className="fade-target pt-28 pb-20 text-center relative"
            >
              {/* Vertical line above hero */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20"
                style={{ background: "linear-gradient(to bottom, transparent, #7a6030)" }}
              />

              <div
                className="inline-block text-[11px] tracking-[0.25em] uppercase text-[#c9a84c] mb-8 px-5 py-1.5"
                style={{ border: "0.5px solid rgba(201,168,76,0.2)", borderRadius: "100px" }}
              >
                Septaera Multiverse — Chronological System
              </div>

              <h1
                className="font-cinzel text-5xl md:text-6xl text-white leading-tight mb-5"
                style={{ textShadow: "0 0 60px rgba(201,168,76,0.15)" }}
              >
                The Calendar
                <br />
                of Septaera
              </h1>

              <p className="text-xl text-[#9a8e78] font-light italic max-w-lg mx-auto mb-12 leading-relaxed">
                Thirteen months. Seven days. Seven constellations. The order of time
                as woven by the Primordials.
              </p>

              <div className="flex gap-4 flex-wrap justify-center">
                <a
                  href="#months"
                  className="inline-block bg-[#c9a84c] text-[#0d0b0e] font-[Cormorant_Garamond] text-[15px] tracking-[0.06em] px-8 py-3 transition-all duration-300 hover:bg-[#e8d08a] hover:-translate-y-px"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Explore the Calendar
                </a>
                <a
                  href="#constellations"
                  className="inline-block bg-transparent text-[#9a8e78] text-[15px] tracking-[0.06em] px-8 py-3 transition-all duration-300 hover:text-[#c9a84c]"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                  }}
                >
                  Constellation Lore
                </a>
              </div>
            </section>

            <FloatingOrb />

            <SectionDivider label="The Thirteen Months" />
            <div className="fade-target">
              <MonthsGrid />
            </div>

            <SectionDivider label="The Seven Days" />
            <div className="fade-target">
              <DaysStrip />
            </div>

            <SectionDivider label="The Seven Constellations" />
            <div className="fade-target">
              <ConstellationsGrid />
            </div>

            <SectionDivider label="Notable Events" />
            <div className="fade-target">
              <EventsSection />
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </>
  );
}
