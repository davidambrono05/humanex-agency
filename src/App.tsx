import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

const SERVICES = [
  {
    icon: "🎯",
    title: "Campanii Meta Ads",
    desc: "Reclame pe Facebook și Instagram — targetare locală, buget controlat, optimizare continuă și raport lunar clar.",
    tags: ["Facebook", "Instagram", "Targetare"],
  },
  {
    icon: "🎬",
    title: "Campanii TikTok Ads",
    desc: "Reclame video pe TikTok pentru audiențe tinere — creative produse de noi, testate și optimizate săptămânal.",
    tags: ["TikTok", "Video", "Optimizare"],
  },
  {
    icon: "📱",
    title: "Gestionare Social Media",
    desc: "Ne ocupăm complet de paginile tale: plan de conținut, postări, reels, story-uri și răspuns la mesaje.",
    tags: ["Conținut", "Reels", "Community"],
  },
  {
    icon: "📸",
    title: "Conținut Foto & Video",
    desc: "Producție de materiale pentru rețele sociale și reclame — editare profesională, inclusiv cu unelte AI.",
    tags: ["Foto", "Video", "Editare AI"],
  },
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

// Abonamente lunare de promovare — bugetul de reclame se plătește separat, direct către platformă
const SOCIAL_PLANS = [
  {
    name: "Social Media Start",
    price: "150€ – 300€",
    period: "lună",
    desc: "Postăm în fiecare zi pentru tine. Pagina ta rămâne activă, fără să te ocupi de nimic.",
    features: [
      "O postare în fiecare zi — 30 pe lună",
      "Story-uri zilnice",
      "Plan de conținut lunar",
      "Răspuns la comentarii și mesaje",
      "Raport lunar",
    ],
    highlight: false,
    badge: "Social Media",
  },
  {
    name: "Social Media + Ads",
    price: "300€ – 600€",
    period: "lună",
    desc: "Postare zilnică plus campanii plătite administrate și optimizate de noi.",
    features: [
      "O postare în fiecare zi — 30 pe lună",
      "8 reels pe lună",
      "Campanii Meta Ads și TikTok Ads",
      "Story-uri zilnice",
      "Răspuns la comentarii și mesaje",
      "Raport lunar",
    ],
    highlight: true,
    badge: "Cel mai ales",
  },
];

const PLANS = [
  // One-time services
  {
    name: "AI Landing Page",
    price: "300€ – 500€",
    period: "proiect",
    desc: "Design modern + mobile responsive + formular contact + SEO basic",
    features: ["Design modern", "Mobile responsive", "Formular contact + WhatsApp", "SEO basic", "Livrare rapidă"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "Web",
  },
  {
    name: "Business Website",
    price: "700€ – 1.500€",
    period: "proiect",
    desc: "Website profesional complet cu design premium și automatizări",
    features: ["Design premium", "Analytics integrat", "Automatizări basic", "SEO complet", "CMS"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "Web",
  },
  {
    name: "Shopify / Magazin Online",
    price: "1.500€ – 3.000€",
    period: "proiect",
    desc: "Setup complet Shopify cu design premium și automatizări",
    features: ["Setup complet Shopify", "Produse + colecții", "Plăți online", "Design premium", "Automatizări basic"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "E-commerce",
  },
  {
    name: "AI Lead Generation System",
    price: "1.000€ – 3.000€",
    period: "proiect",
    desc: "Lead generation automatizat cu CRM, outreach și dashboard analytics",
    features: ["Lead generation AI", "CRM intern", "Outreach system", "Dashboard analytics", "Automatizări AI"],
    highlight: true,
    color: "linear-gradient(135deg, #1d4ed8, #1e40af)",
    badge: "AI Systems",
  },
  {
    name: "AI CRM + Dashboard",
    price: "1.500€ – 5.000€",
    period: "proiect",
    desc: "Dashboard custom cu client management și pipeline AI",
    features: ["Dashboard custom", "Client management", "Analytics timp real", "Pipeline management", "Automatizări + notificări"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "AI Systems",
  },
  {
    name: "Business Automation System",
    price: "2.000€ – 7.000€",
    period: "proiect",
    desc: "Automatizări complete business cu WhatsApp, email și AI",
    features: ["Automatizări complete", "WhatsApp workflows", "Email automation", "AI workflows", "Dashboard operational"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "Automation",
  },
  {
    name: "AI Content System",
    price: "500€ – 2.000€",
    period: "proiect",
    desc: "Reels generation, hooks, scripts și content calendar automat",
    features: ["Reels generation", "Hooks + scripts", "Content calendar", "Social media workflows", "Analytics"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "Content",
  },
  {
    name: "HUMANEX AI Operations",
    price: "3.000€ – 10.000€",
    period: "proiect",
    desc: "AI orchestration complet cu agents, workflows și business automation",
    features: ["AI orchestration", "AI agents custom", "Workflow management", "Analytics avansat", "Monitoring", "Business automation"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "Enterprise",
  },
  // Monthly maintenance
  {
    name: "Basic Support",
    price: "50€ – 100€",
    period: "lună",
    desc: "Updates, bug fixes și suport tehnic lunar",
    features: ["Updates lunare", "Bug fixes", "Suport tehnic", "Monitorizare uptime"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "Mentenanță",
    isMonthly: true,
  },
  {
    name: "Growth Support",
    price: "150€ – 300€",
    period: "lună",
    desc: "Automatizări, analytics, optimizări și workflow management",
    features: ["Automatizări noi", "Analytics avansat", "Optimizări continue", "Workflow management", "Raport lunar"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "Mentenanță",
    isMonthly: true,
  },
  {
    name: "AI Operations Retainer",
    price: "500€ – 2.000€",
    period: "lună",
    desc: "AI systems management complet cu lead generation și outreach",
    features: ["AI systems management", "Lead generation activ", "Outreach management", "Dashboard monitoring", "Business automation", "Raport săptămânal"],
    highlight: false,
    color: "rgba(29,78,216,0.08)",
    badge: "Mentenanță",
    isMonthly: true,
  },
];

const CASE_STUDIES = [
  {
    name: "DaVinci",
    meta: "Restaurant & Boutique Hotel • Centrul Vechi, Brașov",
    items: [
      "Campanii Meta Ads administrate",
      "Conținut foto și video produs lunar",
      "Gestionare Instagram și Facebook",
      "Strategie adaptată sezonului turistic",
    ],
    quote:
      "Campanii plătite pe Facebook și Instagram, conținut foto-video produs lunar și gestionarea completă a paginilor — pentru un restaurant din inima Centrului Vechi, cu public format din localnici și turiști.",
    // TODO David: înlocuiește cu cifre reale din Meta Ads Manager când ai un istoric de 2–3 luni
    stats: [
      { value: "3", label: "Canale gestionate" },
      { value: "24/7", label: "Campanii active" },
      { value: "Lunar", label: "Conținut nou livrat" },
    ],
  },
  {
    name: "SpecialDelivery",
    meta: "Livrări fast food • Județul Bacău",
    items: [
      "Site construit de la zero, cu preluare de comenzi",
      "Campanii țintite pe localitățile fără acoperire",
      "Acoperire în orașe și sate din tot județul",
      "Livrare caldă, în ambalaje termice",
    ],
    quote:
      "Brandurile mari de fast food se opreau la marginea Bacăului. Am construit site-ul prin care satele și orașele din tot județul puteau comanda aceeași mâncare, livrată caldă — plus campaniile care au dus vestea acolo.",
    // TODO David: dacă știi comenzi/lună sau nr. de localități acoperite, înlocuiește
    stats: [
      { value: "Tot județul", label: "Zonă acoperită" },
      { value: "Site + Ads", label: "Construit și promovat" },
      { value: "Direct", label: "Comenzi fără intermediari" },
    ],
  },
  {
    name: "Energoprest",
    meta: "Servicii Electrice • Bacău",
    items: [
      "Raportare zilnică automată",
      "Email + WhatsApp instant",
      "Formular mobil pentru echipă",
      "Funcționare 24/7 în cloud",
    ],
    quote:
      "Șefii de echipă completează raportul zilnic de pe telefon. Proprietarul primește raportul complet pe email și WhatsApp în câteva secunde — fără niciun PC implicat, 24/7.",
    stats: [
      { value: "< 3s", label: "Timp de trimitere raport" },
      { value: "100%", label: "Disponibilitate sistem" },
      { value: "0", label: "Intervenții manuale" },
    ],
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
    q: "Bugetul de reclame e inclus în preț?",
    a: "Nu. Prețul abonamentului acoperă strategia, conținutul, administrarea și optimizarea campaniilor. Bugetul de reclame îl plătești separat, direct către Meta sau TikTok, din contul tău — așa vezi exact cât se cheltuie și rămâi proprietarul contului.",
  },
  {
    q: "Ce buget de reclame îmi trebuie ca să merite?",
    a: "Pentru o afacere locală, pornim de obicei de la 10–15 € pe zi. Sub acest prag, platformele nu au suficiente date ca să optimizeze corect. Stabilim împreună bugetul în funcție de obiectiv, iar tu îl poți modifica oricând.",
  },
  {
    q: "Există contract pe termen lung?",
    a: "Nu. Lucrăm lunar, iar prima lună o poți trata ca perioadă de probă. Dacă nu ești mulțumit de rezultate, ne oprim fără penalizări. Conturile de reclame și paginile rămân întotdeauna ale tale.",
  },
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
        <div className="nav-links" style={{ display: "flex", gap: 36, alignItems: "center" }}>
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
      <section ref={heroRef} className="hero-section" style={{
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
            Agenție de Promovare & Automatizare AI
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
          Campanii Meta și TikTok Ads, gestionarea rețelelor sociale și sisteme AI personalizate, pentru afaceri din România.
        </p>

        {/* CTA */}
        <div className="hero-cta" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 80 }}>
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
        <div className="hero-stats" style={{
          display: "flex", gap: 0, flexWrap: "wrap", justifyContent: "center",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, overflow: "hidden", maxWidth: 820, width: "100%",
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-item" style={{
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
          <div className="services-header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 64, flexWrap: "wrap", gap: 24 }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#60a5fa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 14 }}>
                Ce Facem
              </p>
              <h2 style={{ fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.15, maxWidth: 560 }}>
                Promovare și Automatizare pentru Afaceri Reale
              </h2>
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 340, lineHeight: 1.8 }}>
              Îți aducem clienți prin campanii și social media, apoi automatizăm ce urmează după — totul construit pe măsura afacerii tale.
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

      {/* ── CASE STUDIES ── */}
      <section style={{ padding: "0 24px 110px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
          {CASE_STUDIES.map((cs) => (
            <div key={cs.name} style={{
              background: "linear-gradient(135deg, rgba(29,78,216,0.12) 0%, rgba(14,165,233,0.06) 100%)",
              border: "1px solid rgba(29,78,216,0.25)", borderRadius: 24,
              padding: "56px 56px", position: "relative", overflow: "hidden",
            }} className="case-study-wrap">
              <div style={{
                position: "absolute", top: -60, right: -60, width: 300, height: 300,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)",
              }} />

              <div className="case-study-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 56, alignItems: "center" }}>
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
                  <h3 style={{
                    fontSize: "clamp(30px, 7vw, 52px)", fontWeight: 900,
                    letterSpacing: "-1.5px", marginBottom: 6, lineHeight: 1.05,
                    overflowWrap: "anywhere",
                  }}>{cs.name}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 28 }}>{cs.meta}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {cs.items.map(item => (
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
                  {/* Fără italic: textele astea sunt descrieri, nu citate scurte.
                      Un paragraf întreg în italic e greu de urmărit, mai ales pe
                      ecran îngust, unde ajunge la 6-7 rânduri. */}
                  <p style={{
                    fontSize: "clamp(16px, 2vw, 19px)",
                    color: "rgba(255,255,255,0.88)",
                    lineHeight: 1.65, marginBottom: 32,
                  }}>
                    {cs.quote}
                  </p>
                  <div className="case-study-stats" style={{ display: "flex", gap: 32 }}>
                    {cs.stats.map(stat => (
                      <div key={stat.label}>
                        <div style={{ fontSize: 28, fontWeight: 900, color: "#60a5fa" }}>{stat.value}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
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

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {STEPS.map((step, i) => (
              <div key={step.number} style={{ position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div className="step-connector" style={{
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
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 520, margin: "0 auto" }}>
              Promovarea se lucrează pe abonament lunar. Sistemele se plătesc o singură dată, la livrare.
            </p>
          </div>

          {/* Social media & ads — recurring */}
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Promovare & Social Media — Lunar</h3>
            <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, maxWidth: 760, margin: "0 auto" }}>
              {SOCIAL_PLANS.map((plan) => (
                <div key={plan.name} className={plan.highlight ? "pricing-highlight" : undefined} style={{
                  background: plan.highlight ? "linear-gradient(160deg, #1d4ed8 0%, #1e3a8a 100%)" : "rgba(255,255,255,0.025)",
                  border: plan.highlight ? "1px solid rgba(96,165,250,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20, padding: "32px 26px",
                  position: "relative",
                  boxShadow: plan.highlight ? "0 0 60px rgba(29,78,216,0.3)" : "none",
                  display: "flex", flexDirection: "column",
                }}>
                  <div style={{
                    display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: 1,
                    textTransform: "uppercase", padding: "4px 10px", borderRadius: 6, marginBottom: 16,
                    color: plan.highlight ? "#fff" : "#93c5fd",
                    background: plan.highlight ? "rgba(255,255,255,0.18)" : "rgba(29,78,216,0.15)",
                    border: plan.highlight ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(29,78,216,0.3)",
                  }}>{plan.badge}</div>

                  <h4 style={{ fontSize: 19, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.3px" }}>{plan.name}</h4>
                  <p style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 18, minHeight: 44 }}>{plan.desc}</p>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 22 }}>
                    <span style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-1px" }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)" }}>/ {plan.period}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <span style={{ fontSize: 12, color: plan.highlight ? "#bfdbfe" : "#60a5fa" }}>✓</span>
                        <span style={{ fontSize: 13.5, color: plan.highlight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <a href="#contact" style={{
                    display: "block", textAlign: "center", padding: "11px 18px", borderRadius: 10,
                    fontSize: 13.5, fontWeight: 700, textDecoration: "none",
                    color: plan.highlight ? "#1e3a8a" : "#93c5fd",
                    background: plan.highlight ? "#fff" : "rgba(29,78,216,0.12)",
                    border: plan.highlight ? "1px solid #fff" : "1px solid rgba(29,78,216,0.3)",
                    marginTop: "auto",
                  }}>Începe acum →</a>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 16, lineHeight: 1.7, maxWidth: 760, margin: "16px auto 0" }}>
              Bugetul de reclame se plătește separat, direct către Meta sau TikTok. Prețurile de mai sus acoperă doar munca de administrare, conținut și optimizare.
            </p>
          </div>

          {/* One-time services */}
          <div style={{ marginBottom: 48 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Servicii One-Time</h3>
            <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {PLANS.filter(p => !p.isMonthly).map((plan) => (
                <div key={plan.name} className={plan.highlight ? "pricing-highlight" : undefined} style={{
                  background: plan.highlight ? "linear-gradient(160deg, #1d4ed8 0%, #1e3a8a 100%)" : "rgba(255,255,255,0.025)",
                  border: plan.highlight ? "1px solid rgba(96,165,250,0.4)" : "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20, padding: "32px 26px",
                  position: "relative",
                  boxShadow: plan.highlight ? "0 0 60px rgba(29,78,216,0.3)" : "none",
                  display: "flex", flexDirection: "column",
                }}>
                  {plan.highlight && (
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #0ea5e9, #38bdf8)",
                      borderRadius: 999, padding: "4px 16px",
                      fontSize: 11, fontWeight: 800, color: "#fff", whiteSpace: "nowrap",
                      boxShadow: "0 0 20px rgba(14,165,233,0.5)",
                    }}>⭐ Cel mai popular</div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.3)", borderRadius: 6, padding: "2px 8px" }}>{plan.badge}</span>
                  </div>

                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{plan.desc}</div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px" }}>{plan.price}</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                          background: plan.highlight ? "rgba(255,255,255,0.15)" : "rgba(29,78,216,0.2)",
                          border: `1px solid ${plan.highlight ? "rgba(255,255,255,0.2)" : "rgba(29,78,216,0.4)"}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, color: plan.highlight ? "#fff" : "#60a5fa",
                        }}>✓</div>
                        <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.6)" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <a href="#contact" style={{
                    display: "block", textAlign: "center", padding: "12px",
                    borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none",
                    background: plan.highlight ? "rgba(255,255,255,0.18)" : "rgba(29,78,216,0.25)",
                    border: `1px solid ${plan.highlight ? "rgba(255,255,255,0.25)" : "rgba(29,78,216,0.4)"}`,
                    color: "#fff",
                    marginTop: "auto",
                  }}>Începe acum →</a>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly maintenance */}
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 24 }}>Mentenanță Lunară</h3>
            <div className="pricing-monthly-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
              {PLANS.filter(p => p.isMonthly).map((plan) => (
                <div key={plan.name} style={{
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 20, padding: "32px 26px",
                  position: "relative",
                  display: "flex", flexDirection: "column",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#60a5fa", background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.3)", borderRadius: 6, padding: "2px 8px" }}>{plan.badge}</span>
                  </div>

                  <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 16 }}>{plan.desc}</div>

                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 20 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px" }}>{plan.price}</span>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.3)" }}>/lună</span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
                    {plan.features.map(f => (
                      <div key={f} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                          background: "rgba(29,78,216,0.2)", border: "1px solid rgba(29,78,216,0.4)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 10, color: "#60a5fa",
                        }}>✓</div>
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.6)" }}>{f}</span>
                      </div>
                    ))}
                  </div>

                  <a href="#contact" style={{
                    display: "block", textAlign: "center", padding: "12px",
                    borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none",
                    background: "rgba(29,78,216,0.25)", border: "1px solid rgba(29,78,216,0.4)", color: "#fff",
                    marginTop: "auto",
                  }}>Începe acum →</a>
                </div>
              ))}
            </div>
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
          }} className="cta-band">
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
            <div className="contact-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
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
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24,
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
          {[
            { label: "Servicii", href: "#servicii" },
            { label: "Prețuri", href: "#preturi" },
            { label: "Contact", href: "#contact" },
          ].map(l => (
            <a key={l.label} href={l.href}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{l.label}</a>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", textAlign: "right" }}>
          © {new Date().getFullYear()} HUMANEX. Toate drepturile rezervate.
        </p>
      </footer>

      <style>{`
        /* ── MOBILE RESPONSIVE ── */
        @media (max-width: 768px) {

          /* Navbar */
          .nav-links { display: none !important; }
          .nav-cta { display: none !important; }
          nav { padding: 0 20px !important; }

          /* Hero */
          .hero-section { padding-top: 100px !important; padding-bottom: 48px !important; }
          .hero-stats { flex-direction: column !important; gap: 0 !important; }
          .hero-stats > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .hero-stats > div:last-child { border-bottom: none; }
          .hero-cta { flex-direction: column !important; align-items: center !important; margin-bottom: 36px !important; }
          .hero-cta a { width: 100% !important; text-align: center !important; box-sizing: border-box; }
          .stat-item { padding: 14px 16px !important; flex: 1 1 100% !important; }

          /* Services */
          .services-header { flex-direction: column !important; align-items: flex-start !important; }

          /* Case study */
          .case-study-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .case-study-stats { flex-wrap: wrap !important; gap: 20px !important; }
          .case-study-wrap { padding: 32px 24px !important; }

          /* How it works */
          .steps-grid { grid-template-columns: 1fr !important; }
          .step-connector { display: none !important; }

          /* Pricing */
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-highlight { transform: scale(1) !important; }

          /* CTA band */
          .cta-band { padding: 48px 28px !important; }

          /* Contact form */
          .contact-form-row { grid-template-columns: 1fr !important; }

          /* Footer */
          footer { display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; padding: 32px 24px !important; gap: 16px !important; }
          footer p { text-align: center !important; }

          /* Section padding */
          section { padding-left: 16px !important; padding-right: 16px !important; }
        }

        /* Smooth hover for inputs */
        input:focus, textarea:focus {
          border-color: rgba(29,78,216,0.5) !important;
        }
        input::placeholder, textarea::placeholder {
          color: rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}
