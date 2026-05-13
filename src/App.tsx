import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

const SERVICES = [
  {
    icon: "📊",
    title: "Sisteme de Raportare",
    desc: "Rapoarte zilnice automate trimise proprietarului pe email și WhatsApp — în timp real, fără niciun PC pornit.",
    tags: ["Email", "WhatsApp", "PDF"],
  },
  {
    icon: "💬",
    title: "Automatizare WhatsApp",
    desc: "Notificări instant, mesaje clienți și alerte automate — direct pe WhatsApp, 24/7.",
    tags: ["Notificări", "Clienți", "Alerte"],
  },
  {
    icon: "🗂️",
    title: "Dashboarduri Personalizate",
    desc: "Urmărești clienți, lucrări, echipe și facturi dintr-un singur loc — construit exact pentru afacerea ta.",
    tags: ["CRM", "Facturi", "Echipe"],
  },
  {
    icon: "📧",
    title: "Automatizare Email",
    desc: "Emailuri profesionale pentru rapoarte, facturi și follow-up-uri — rulează automat, fără intervenția ta.",
    tags: ["SMTP", "Template", "Auto-send"],
  },
  {
    icon: "🔗",
    title: "Integrări Business",
    desc: "Conectezi software-ul de facturare, plăți, calendare — totul într-un singur flux automat.",
    tags: ["SmartBill", "API", "Webhooks"],
  },
  {
    icon: "⚡",
    title: "Sisteme AI Custom",
    desc: "Soluții de automatizare construite exact pentru nevoile tale. Dacă îl poți descrie, îl putem construi.",
    tags: ["AI", "Custom", "Scalabil"],
  },
];

const STEPS = [
  {
    number: "01",
    title: "Discuție inițială",
    desc: "Aflăm despre afacerea ta, fluxul de lucru actual și ce îți ia cel mai mult timp.",
    detail: "Gratuit, fără obligații",
  },
  {
    number: "02",
    title: "Construim sistemul",
    desc: "În zile, nu luni. Un sistem complet funcțional, construit pentru nevoile tale exacte.",
    detail: "Livrare în 3–7 zile",
  },
  {
    number: "03",
    title: "Tu te relaxezi",
    desc: "Sistemul rulează 24/7. Fără mentenanță din partea ta. Noi ne ocupăm de orice.",
    detail: "Suport inclus",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "400€",
    period: "proiect",
    desc: "Perfect pentru afaceri mici care au nevoie de o singură automatizare.",
    features: [
      "1 sistem de automatizare custom",
      "Integrare Email sau WhatsApp",
      "Interfață optimizată pentru mobil",
      "1 lună de suport",
      "Modificări incluse",
    ],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
  },
  {
    name: "Professional",
    price: "800€",
    period: "proiect",
    desc: "Sistem complet cu multiple integrări pentru afaceri în creștere.",
    features: [
      "Sistem custom complet",
      "Email + WhatsApp integrate",
      "Dashboard & rapoarte",
      "Integrare facturare",
      "3 luni de suport",
      "Modificări nelimitate",
    ],
    highlight: true,
    color: "linear-gradient(135deg, #1d4ed8, #1e40af)",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "negociat",
    desc: "Automatizarea completă a întregii tale afaceri.",
    features: [
      "Sisteme multiple custom",
      "Automatizare completă business",
      "Suport prioritar",
      "Manager de cont dedicat",
      "Dezvoltare continuă",
      "Garanție SLA",
    ],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
  },
];

const STATS = [
  { value: "24/7", label: "Sistemele rulează non-stop" },
  { value: "< 7 zile", label: "Timp mediu de livrare" },
  { value: "100%", label: "Construit personalizat" },
  { value: "0", label: "Mentenanță necesară din partea ta" },
];

const FAQS = [
  {
    q: "Cât durează să construiți un sistem?",
    a: "De obicei între 3 și 7 zile lucrătoare, în funcție de complexitate. Sisteme simple pot fi livrate chiar și în 24 de ore.",
  },
  {
    q: "Am nevoie de cunoștințe tehnice?",
    a: "Deloc. Noi ne ocupăm de tot aspectul tehnic. Tu primești un sistem gata de utilizat, cu instrucțiuni clare.",
  },
  {
    q: "Ce se întâmplă dacă vreau modificări după livrare?",
    a: "Modificările sunt incluse în perioada de suport. Orice ajustare o facem rapid, fără costuri suplimentare în această perioadă.",
  },
  {
    q: "Sistemele funcționează și când nu am PC-ul pornit?",
    a: "Da, 100%. Totul rulează în cloud — Supabase, funcții serverless, integrări externe. PC-ul tău nu are nicio relevanță.",
  },
  {
    q: "Pot adăuga funcționalități noi mai târziu?",
    a: "Absolut. Sistemele noastre sunt construite modular, tocmai pentru a permite extinderea ușoară pe măsură ce afacerea crește.",
  },
];

const EMAILJS_SERVICE = "service_vgg5fdg";
const EMAILJS_TEMPLATE = "template_asjlv4r";
const EMAILJS_KEY = "km3Un_Nuwq0eqaiPP";

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setSending(true);
    setError(false);
    try {
      await emailjs.sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, formRef.current, EMAILJS_KEY);
      setSent(true);
      formRef.current.reset();
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Servicii", id: "servicii" },
    { label: "Proces", id: "proces" },
    { label: "Prețuri", id: "preturi" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#040d1f", color: "#fff", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(4,13,31,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "all 0.4s ease",
        padding: "0 48px", height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1d4ed8"/>
                <stop offset="100%" stopColor="#0ea5e9"/>
              </linearGradient>
              <filter id="logoGlow">
                <feGaussianBlur stdDeviation="2" result="blur"/>
                <feComposite in="SourceGraphic" in2="blur" operator="over"/>
              </filter>
            </defs>
            {/* Hexagon shape */}
            <path d="M21 2L38 11.5V30.5L21 40L4 30.5V11.5L21 2Z"
              fill="url(#logoGrad)" opacity="0.15"/>
            <path d="M21 2L38 11.5V30.5L21 40L4 30.5V11.5L21 2Z"
              stroke="url(#logoGrad)" strokeWidth="1.5" fill="none"/>
            {/* H letter */}
            <text x="21" y="27" textAnchor="middle"
              fill="white" fontSize="18" fontWeight="900"
              fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
              filter="url(#logoGlow)">H</text>
            {/* Corner dots */}
            <circle cx="21" cy="2" r="2" fill="#0ea5e9" opacity="0.8"/>
            <circle cx="38" cy="11.5" r="2" fill="#1d4ed8" opacity="0.6"/>
            <circle cx="38" cy="30.5" r="2" fill="#1d4ed8" opacity="0.6"/>
          </svg>
          <div>
            <div style={{ fontWeight: 900, fontSize: 19, letterSpacing: "0.5px", lineHeight: 1 }}>HUMANEX</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>AI Systems</div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 36, alignItems: "center" }}>
          {navLinks.map(l => (
            <a key={l.id} href={`#${l.id}`}
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 14, fontWeight: 500, textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
            >{l.label}</a>
          ))}
          <a href="#contact" style={{
            background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
            color: "#fff", padding: "10px 22px", borderRadius: 8,
            fontWeight: 700, fontSize: 14, textDecoration: "none",
            boxShadow: "0 0 24px rgba(29,78,216,0.35)",
            transition: "box-shadow 0.2s",
          }}>Începe acum</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "130px 24px 80px", textAlign: "center", position: "relative",
      }}>
        {/* Glow bg */}
        <div style={{
          position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none",
        }}>
          <div style={{
            position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
            width: 900, height: 900, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(29,78,216,0.13) 0%, transparent 65%)",
          }} />
          <div style={{
            position: "absolute", top: "30%", left: "20%",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,165,233,0.07) 0%, transparent 70%)",
          }} />
          <div style={{
            position: "absolute", top: "40%", right: "15%",
            width: 250, height: 250, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(29,78,216,0.08) 0%, transparent 70%)",
          }} />
          {/* Grid lines */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(29,78,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />
        </div>

        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28,
          background: "rgba(29,78,216,0.12)", border: "1px solid rgba(29,78,216,0.35)",
          borderRadius: 999, padding: "7px 18px",
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#22d3ee",
            display: "inline-block", boxShadow: "0 0 8px #22d3ee",
          }} />
          <span style={{ fontSize: 13, color: "#93c5fd", fontWeight: 600, letterSpacing: 0.5 }}>
            Agenție de Automatizare AI • România
          </span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(40px, 6.5vw, 80px)", fontWeight: 900,
          lineHeight: 1.05, letterSpacing: "-2.5px", maxWidth: 880, marginBottom: 28,
        }}>
          Sistemele Noastre Lucrează Non-Stop.{" "}
          <span style={{
            background: "linear-gradient(135deg, #60a5fa 0%, #0ea5e9 50%, #38bdf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Tu Crești.
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.5)",
          maxWidth: 580, lineHeight: 1.75, marginBottom: 44,
        }}>
          Sisteme AI personalizate pentru afaceri mici și mijlocii. Rapoarte, notificări, dashboarduri — complet automatizate, livrate rapid.
        </p>

        {/* CTA */}
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 80 }}>
          <a href="#contact" style={{
            background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
            color: "#fff", padding: "16px 36px", borderRadius: 12,
            fontWeight: 800, fontSize: 16, textDecoration: "none",
            boxShadow: "0 0 50px rgba(29,78,216,0.45)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            Începe Proiectul Tău
            <span style={{ fontSize: 18 }}>→</span>
          </a>
          <a href="#servicii" style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff", padding: "16px 36px", borderRadius: 12,
            fontWeight: 600, fontSize: 16, textDecoration: "none",
          }}>
            Vezi Serviciile
          </a>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "flex", gap: 0, flexWrap: "wrap", justifyContent: "center",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, overflow: "hidden", maxWidth: 820, width: "100%",
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              flex: "1 1 180px", padding: "24px 20px", textAlign: "center",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#60a5fa", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="servicii" style={{ padding: "110px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
                Ce Construim
              </p>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.15, maxWidth: 500 }}>
                Sisteme de Automatizare pentru Afaceri Reale
              </h2>
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 340, lineHeight: 1.8 }}>
              Fiecare sistem e construit de la zero, adaptat exact proceselor tale de business.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            {SERVICES.map((s) => (
              <div key={s.title}
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20, padding: "32px 28px",
                  transition: "all 0.3s ease", cursor: "default",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(29,78,216,0.5)";
                  el.style.background = "rgba(29,78,216,0.06)";
                  el.style.transform = "translateY(-6px)";
                  el.style.boxShadow = "0 20px 60px rgba(29,78,216,0.15)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.background = "rgba(255,255,255,0.02)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                <div style={{
                  position: "absolute", top: -20, right: -20,
                  fontSize: 80, opacity: 0.04, userSelect: "none",
                }}>{s.icon}</div>

                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, marginBottom: 20,
                }}>{s.icon}</div>

                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.3px" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 20 }}>{s.desc}</p>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {s.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 700, color: "#60a5fa",
                      background: "rgba(29,78,216,0.12)", border: "1px solid rgba(29,78,216,0.25)",
                      borderRadius: 6, padding: "3px 10px", letterSpacing: 0.5,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDY ── */}
      <section style={{ padding: "0 24px 110px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(29,78,216,0.12) 0%, rgba(14,165,233,0.06) 100%)",
            border: "1px solid rgba(29,78,216,0.25)", borderRadius: 24,
            padding: "56px 56px", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -60, right: -60, width: 300, height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
            }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 56, alignItems: "center" }}>
              <div>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "5px 14px", borderRadius: 8,
                  background: "rgba(29,78,216,0.2)", border: "1px solid rgba(29,78,216,0.35)",
                  marginBottom: 20,
                }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", letterSpacing: 1, textTransform: "uppercase" }}>
                    Studiu de caz
                  </span>
                </div>
                <h3 style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-2px", marginBottom: 6 }}>Energoprest</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>Servicii Electrice • Bacău</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Raportare zilnică automată", "Email + WhatsApp instant", "Formular mobil pentru echipă", "Funcționare 24/7 în cloud"].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6,
                        background: "rgba(29,78,216,0.3)", border: "1px solid rgba(29,78,216,0.5)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, color: "#60a5fa", flexShrink: 0,
                      }}>✓</div>
                      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)" }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p style={{ fontSize: 20, color: "rgba(255,255,255,0.8)", lineHeight: 1.8, marginBottom: 32, fontStyle: "italic" }}>
                  "Șefii de echipă completează raportul zilnic de pe telefon. Proprietarul primește raportul complet pe email și WhatsApp în câteva secunde — fără niciun PC implicat, 24/7."
                </p>
                <div style={{ display: "flex", gap: 32 }}>
                  {[
                    { value: "< 3s", label: "Timp de trimitere raport" },
                    { value: "100%", label: "Disponibilitate sistem" },
                    { value: "0", label: "Intervenții manuale" },
                  ].map(stat => (
                    <div key={stat.label}>
                      <div style={{ fontSize: 28, fontWeight: 900, color: "#60a5fa" }}>{stat.value}</div>
                      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="proces" style={{ padding: "110px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Procesul Nostru</p>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px" }}>
              Simplu. Rapid. Gata.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {STEPS.map((step, i) => (
              <div key={step.number} style={{ position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div style={{
                    position: "absolute", top: 32, left: "calc(100% - 12px)", right: "-12px",
                    height: 1, background: "linear-gradient(90deg, rgba(29,78,216,0.5), rgba(29,78,216,0.1))",
                    zIndex: 1,
                  }} />
                )}
                <div style={{
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20, padding: "36px 28px", height: "100%",
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14,
                    background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: 20, marginBottom: 24,
                    boxShadow: "0 0 30px rgba(29,78,216,0.4)",
                  }}>{step.number}</div>

                  <div style={{
                    display: "inline-block", fontSize: 11, fontWeight: 700,
                    color: "#22d3ee", background: "rgba(34,211,238,0.1)",
                    border: "1px solid rgba(34,211,238,0.2)", borderRadius: 6,
                    padding: "3px 10px", marginBottom: 14, letterSpacing: 0.5,
                  }}>{step.detail}</div>

                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12, letterSpacing: "-0.3px" }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="preturi" style={{ padding: "110px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 72 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Prețuri</p>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 16 }}>
              Transparent. Fără Surprize.
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 480, margin: "0 auto" }}>
              Plătești o singură dată pentru sistemul construit. Fără abonamente ascunse.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, alignItems: "center" }}>
            {PLANS.map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? "linear-gradient(160deg, #1d4ed8 0%, #1e3a8a 100%)" : "rgba(255,255,255,0.025)",
                border: plan.highlight ? "1px solid rgba(96,165,250,0.4)" : "1px solid rgba(255,255,255,0.07)",
                borderRadius: 24, padding: plan.highlight ? "44px 32px" : "36px 28px",
                position: "relative",
                boxShadow: plan.highlight ? "0 0 80px rgba(29,78,216,0.35)" : "none",
                transform: plan.highlight ? "scale(1.04)" : "scale(1)",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                    background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                    borderRadius: 999, padding: "5px 20px",
                    fontSize: 12, fontWeight: 800, color: "#fff", whiteSpace: "nowrap",
                    boxShadow: "0 0 20px rgba(14,165,233,0.5)",
                  }}>⭐ Cel mai popular</div>
                )}

                <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>{plan.name}</div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 52, fontWeight: 900, letterSpacing: "-2px" }}>{plan.price}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>per {plan.period}</div>

                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 28, lineHeight: 1.7 }}>{plan.desc}</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 32 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                        background: plan.highlight ? "rgba(255,255,255,0.15)" : "rgba(29,78,216,0.2)",
                        border: `1px solid ${plan.highlight ? "rgba(255,255,255,0.2)" : "rgba(29,78,216,0.4)"}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, color: plan.highlight ? "#fff" : "#60a5fa",
                      }}>✓</div>
                      <span style={{ fontSize: 14, color: plan.highlight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.65)" }}>{f}</span>
                    </div>
                  ))}
                </div>

                <a href="#contact" style={{
                  display: "block", textAlign: "center", padding: "14px",
                  borderRadius: 12, fontWeight: 800, fontSize: 15, textDecoration: "none",
                  background: plan.highlight ? "rgba(255,255,255,0.18)" : "rgba(29,78,216,0.25)",
                  border: `1px solid ${plan.highlight ? "rgba(255,255,255,0.25)" : "rgba(29,78,216,0.4)"}`,
                  color: "#fff", transition: "all 0.2s",
                }}>Începe acum →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "110px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>FAQ</p>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px" }}>
              Întrebări Frecvente
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, overflow: "hidden",
                borderColor: openFaq === i ? "rgba(29,78,216,0.4)" : "rgba(255,255,255,0.07)",
                transition: "border-color 0.2s",
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: "100%", padding: "20px 24px", background: "none", border: "none",
                    cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
                    color: "#fff", textAlign: "left",
                  }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{faq.q}</span>
                  <span style={{
                    fontSize: 20, color: "#60a5fa", flexShrink: 0, marginLeft: 16,
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px" }}>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section style={{ padding: "0 24px 110px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{
            background: "linear-gradient(135deg, #1d4ed8 0%, #0f172a 60%, #1e40af 100%)",
            border: "1px solid rgba(96,165,250,0.2)", borderRadius: 24,
            padding: "72px 56px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
              width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 16 }}>
              Gata să Îți Automatizezi Afacerea?
            </h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", marginBottom: 40, maxWidth: 480, margin: "0 auto 40px" }}>
              Discuție gratuită, fără obligații. Îți spunem exact ce putem face pentru afacerea ta.
            </p>
            <a href="#contact" style={{
              background: "#fff", color: "#1d4ed8",
              padding: "16px 40px", borderRadius: 12,
              fontWeight: 900, fontSize: 17, textDecoration: "none",
              display: "inline-block",
            }}>Programează o Discuție →</a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "0 24px 110px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>Contact</p>
            <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", marginBottom: 16 }}>
              Hai să Vorbim
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
              Descrie-ne afacerea și ce vrei să automatizezi. Îți răspundem în maxim 24 de ore.
            </p>
          </div>

          <form ref={formRef} style={{ display: "flex", flexDirection: "column", gap: 14 }} onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input type="text" name="name" placeholder="Numele tău" required
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15,
                  outline: "none", fontFamily: "inherit",
                }}
              />
              <input type="email" name="email" placeholder="Email" required
                style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15,
                  outline: "none", fontFamily: "inherit",
                }}
              />
            </div>
            <input type="text" name="phone" placeholder="Telefon / WhatsApp"
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15,
                outline: "none", fontFamily: "inherit",
              }}
            />
            <input type="text" name="business" placeholder="Tipul afacerii tale (ex: construcții, transport, servicii)"
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15,
                outline: "none", fontFamily: "inherit",
              }}
            />
            <textarea name="message" placeholder="Ce vrei să automatizezi? Descrie procesul actual..."
              rows={5}
              style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15,
                outline: "none", resize: "vertical", fontFamily: "inherit",
              }}
            />
            {sent && (
              <div style={{
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 12, padding: "14px 18px", color: "#4ade80", fontSize: 15, fontWeight: 600,
              }}>✓ Mesaj trimis! Te contactăm în maxim 24 de ore.</div>
            )}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 12, padding: "14px 18px", color: "#f87171", fontSize: 15, fontWeight: 600,
              }}>❌ Eroare la trimitere. Încearcă din nou.</div>
            )}
            <button type="submit" disabled={sending || sent} style={{
              background: sent ? "rgba(34,197,94,0.2)" : "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
              color: "#fff", padding: "18px", borderRadius: 12, border: "none",
              fontWeight: 800, fontSize: 17, cursor: sending || sent ? "default" : "pointer",
              boxShadow: sent ? "none" : "0 0 50px rgba(29,78,216,0.45)",
              opacity: sending ? 0.7 : 1,
            }}>
              {sending ? "Se trimite..." : sent ? "✓ Trimis!" : "Trimite Mesajul →"}
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "48px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg width="34" height="34" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="logoGrad2" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1d4ed8"/>
                <stop offset="100%" stopColor="#0ea5e9"/>
              </linearGradient>
            </defs>
            <path d="M21 2L38 11.5V30.5L21 40L4 30.5V11.5L21 2Z" fill="url(#logoGrad2)" opacity="0.15"/>
            <path d="M21 2L38 11.5V30.5L21 40L4 30.5V11.5L21 2Z" stroke="url(#logoGrad2)" strokeWidth="1.5" fill="none"/>
            <text x="21" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="900" fontFamily="-apple-system, sans-serif">H</text>
            <circle cx="21" cy="2" r="2" fill="#0ea5e9" opacity="0.8"/>
          </svg>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>HUMANEX</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase" }}>AI Systems</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {["Servicii", "Prețuri", "Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)" }}>
          © {new Date().getFullYear()} HUMANEX. Toate drepturile rezervate.
        </p>
      </footer>
    </div>
  );
}
