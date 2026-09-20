import { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

/* ═══════════════════════════════════════════════════════════════
   Bilingv RO / EN.

   Fiecare bucată de text e un obiect { ro, en } și se alege cu t().
   Varianta cu două fișiere de traduceri separate ar fi rupt textul
   de locul unde e folosit — aici vezi ambele limbi una lângă alta,
   deci nu poți modifica una și uita de cealaltă.
   ═══════════════════════════════════════════════════════════════ */

type Lang = "ro" | "en";
type TX = { ro: string; en: string };

const t = (x: TX, l: Lang) => x[l];

/* ── Texte de interfață ─────────────────────────────────────── */

const UI = {
  tagline: { ro: "Sisteme AI & Promovare", en: "AI Systems & Marketing" },
  navServices: { ro: "Servicii", en: "Services" },
  navProjects: { ro: "Proiecte", en: "Work" },
  navProcess: { ro: "Proces", en: "Process" },
  navPricing: { ro: "Prețuri", en: "Pricing" },
  navContact: { ro: "Contact", en: "Contact" },
  navCta: { ro: "Începe acum", en: "Get started" },

  heroBadge: {
    ro: "Agenție de software și promovare · România",
    en: "Software & marketing studio · Romania",
  },
  heroTitle1: { ro: "Sisteme care lucrează", en: "Systems that work" },
  heroTitle2: { ro: "cât timp tu dormi.", en: "while you sleep." },
  heroSub: {
    ro: "Construim software la comandă pentru afaceri mici și mijlocii — și le ducem clienți prin campanii pe Meta și TikTok. Din Brașov, pentru clienți din România și din afară.",
    en: "We build custom software for small and mid-sized businesses — and bring them customers through Meta and TikTok campaigns. Based in Romania, working with clients anywhere.",
  },
  heroCta1: { ro: "Începe un proiect", en: "Start a project" },
  heroCta2: { ro: "Vezi ce am construit", en: "See our work" },

  projectsEyebrow: { ro: "Proiecte", en: "Selected work" },
  projectsTitle: { ro: "Ce am construit", en: "What we have built" },
  projectsSub: {
    ro: "Fiecare sistem de mai jos rulează acum, pentru o afacere reală.",
    en: "Every system below is running right now, for a real business.",
  },
  liveLabel: { ro: "Live", en: "Live" },
  buildingLabel: { ro: "În dezvoltare", en: "In development" },
  visitLabel: { ro: "Vezi site-ul", en: "Visit site" },

  ccEyebrow: { ro: "Ultimul proiect", en: "Latest project" },
  ccWatch: { ro: "Vezi prezentarea completă", en: "Watch the full walkthrough" },
  ccDuration: { ro: "4 min", en: "4 min" },
  ccNoVideo: {
    ro: "Browserul tău nu poate reda acest video.",
    en: "Your browser cannot play this video.",
  },

  servicesEyebrow: { ro: "Ce facem", en: "What we do" },
  servicesTitle: {
    ro: "Software la comandă și promovare",
    en: "Custom software and marketing",
  },
  servicesSub: {
    ro: "Îți aducem clienți prin campanii, apoi automatizăm munca care vine după.",
    en: "We bring you customers through campaigns, then automate the work that follows.",
  },

  processEyebrow: { ro: "Cum lucrăm", en: "How we work" },
  processTitle: { ro: "Simplu. Rapid. Gata.", en: "Simple. Fast. Done." },

  pricingEyebrow: { ro: "Prețuri", en: "Pricing" },
  pricingTitle: { ro: "Transparent, fără surprize", en: "Transparent, no surprises" },
  pricingSub: {
    ro: "Promovarea se lucrează pe abonament lunar. Sistemele se plătesc o singură dată, la livrare.",
    en: "Marketing runs on a monthly retainer. Systems are paid once, on delivery.",
  },
  pricingSocial: {
    ro: "Promovare și social media — lunar",
    en: "Marketing and social media — monthly",
  },
  pricingOneTime: { ro: "Sisteme — plată unică", en: "Systems — one-time" },
  pricingMonthly: { ro: "Mentenanță lunară", en: "Monthly support" },
  pricingNote: {
    ro: "Bugetul de reclame se plătește separat, direct către Meta sau TikTok, din contul tău. Prețurile de mai sus acoperă strategia, conținutul și administrarea.",
    en: "Ad spend is paid separately, straight to Meta or TikTok from your own account. The prices above cover strategy, content and management.",
  },
  perMonth: { ro: "lună", en: "month" },
  perProject: { ro: "proiect", en: "project" },
  planCta: { ro: "Începe acum", en: "Get started" },
  popular: { ro: "Cel mai ales", en: "Most chosen" },

  faqEyebrow: { ro: "Întrebări", en: "Questions" },
  faqTitle: { ro: "Întrebări frecvente", en: "Frequently asked" },

  ctaTitle: {
    ro: "Ai un proces care îți mănâncă ziua?",
    en: "Got a process eating your day?",
  },
  ctaSub: {
    ro: "Discuție gratuită, fără obligații. Îți spunem direct dacă se poate automatiza și cât ar dura.",
    en: "Free call, no strings. We will tell you straight whether it can be automated and how long it would take.",
  },
  ctaButton: { ro: "Programează o discuție", en: "Book a call" },

  contactEyebrow: { ro: "Contact", en: "Contact" },
  contactTitle: { ro: "Hai să vorbim", en: "Let us talk" },
  contactSub: {
    ro: "Descrie-ne afacerea și ce vrei să automatizezi. Îți răspundem în maxim 24 de ore.",
    en: "Tell us about your business and what you want to automate. We reply within 24 hours.",
  },
  fName: { ro: "Numele tău", en: "Your name" },
  fEmail: { ro: "Email", en: "Email" },
  fPhone: { ro: "Telefon / WhatsApp", en: "Phone / WhatsApp" },
  fBusiness: {
    ro: "Tipul afacerii (ex: restaurant, construcții, transport)",
    en: "Type of business (e.g. restaurant, construction, logistics)",
  },
  fMessage: {
    ro: "Ce vrei să automatizezi? Descrie procesul actual…",
    en: "What would you like to automate? Describe how it works today…",
  },
  fSend: { ro: "Trimite mesajul", en: "Send message" },
  fSending: { ro: "Se trimite…", en: "Sending…" },
  fSent: { ro: "Trimis!", en: "Sent!" },
  fOk: {
    ro: "Mesaj trimis. Te contactăm în maxim 24 de ore.",
    en: "Message sent. We will be in touch within 24 hours.",
  },
  fErr: {
    ro: "Eroare la trimitere. Încearcă din nou sau scrie-ne direct pe email.",
    en: "Something went wrong. Try again, or email us directly.",
  },
  rights: { ro: "Toate drepturile rezervate.", en: "All rights reserved." },
  basedIn: { ro: "Brașov, România", en: "Brașov, Romania" },
};

/* ── Proiecte ───────────────────────────────────────────────── */

type Project = {
  /* Numele de marcă rămân la fel în ambele limbi; partea descriptivă
     („Raportare zilnică") se traduce, altfel un vizitator străin
     citește jumătate de titlu în română. */
  name: TX;
  kind: TX;
  client: TX;
  desc: TX;
  points: TX[];
  url?: string;
  live: boolean;
  accent: string;
};

const PROJECTS: Project[] = [
  {
    name: { ro: "CloseCheck", en: "CloseCheck" },
    kind: { ro: "Produs · Contabilitate", en: "Product · Accounting" },
    client: { ro: "Cabinete de contabilitate", en: "Accounting firms" },
    desc: {
      ro: "Într-un restaurant, banii trec prin patru locuri: casa de marcat, terminalul de card, aplicațiile de livrare și sertarul. Nimeni nu le compară între ele. CloseCheck o face în fiecare seară și arată unde nu se potrivesc.",
      en: "In a restaurant, money moves through four places: the till, the card terminal, the delivery apps and the cash drawer. Nobody compares them against each other. CloseCheck does it every evening and shows where they stop matching.",
    },
    points: [
      { ro: "Închiderea turei se face de pe telefon, în câteva minute", en: "Shift close happens on the phone, in a few minutes" },
      { ro: "Un panou pentru toate restaurantele din portofoliu", en: "One dashboard for every restaurant in the portfolio" },
      { ro: "Diferențele neexplicate, urmărite săptămână de săptămână", en: "Unexplained differences, tracked week by week" },
      { ro: "Rezultatul pentru fiecare client, exportabil în PDF și Word", en: "Per-client results, exported to PDF and Word" },
      { ro: "Termenele și declarațiile lunii, pe client", en: "Monthly filing deadlines, per client" },
    ],
    live: false,
    accent: "#60a5fa",
  },
  {
    name: { ro: "Energoprest — Raportare zilnică", en: "Energoprest — Daily reporting" },
    kind: { ro: "Software la comandă", en: "Custom software" },
    client: { ro: "Firmă de instalații electrice · Bacău", en: "Electrical contractor · Romania" },
    desc: {
      ro: "Șefii de echipă completează raportul zilei de pe telefon, direct de pe șantier. Proprietarul primește raportul complet, cu poze, pe email și WhatsApp în câteva secunde — fără niciun calculator pornit.",
      en: "Team leads file the daily report from their phone, straight from the site. The owner gets the full report with photos by email and WhatsApp within seconds — no computer involved.",
    },
    points: [
      { ro: "Formular mobil pentru echipele de pe teren", en: "Mobile form for field crews" },
      { ro: "Raport PDF generat și trimis automat", en: "PDF report generated and sent automatically" },
      { ro: "Materiale, manoperă și poze, pe fiecare lucrare", en: "Materials, labour and photos, per job" },
      { ro: "Rulează în cloud, 24/7", en: "Runs in the cloud, 24/7" },
    ],
    url: "https://www.energoprest.site",
    live: true,
    accent: "#22d3ee",
  },
  {
    name: { ro: "Energoprest — Licitații", en: "Energoprest — Public tenders" },
    kind: { ro: "Software la comandă", en: "Custom software" },
    client: { ro: "Firmă de instalații electrice · Bacău", en: "Electrical contractor · Romania" },
    desc: {
      ro: "Sistem care citește documentația unei licitații publice și scoate singur lucrările și termenele, verifică ce lipsește din listele de cantități, pregătește devizul și cererile de ofertă. O muncă de trei-patru zile devine câteva ore.",
      en: "A system that reads public tender documents, pulls out the works and deadlines on its own, checks what is missing from the bill of quantities, and prepares the cost estimate and supplier requests. Three or four days of work becomes a few hours.",
    },
    points: [
      { ro: "Citește documentația și extrage termenele", en: "Reads the documents and extracts deadlines" },
      { ro: "Verifică ce lipsește din listele de cantități", en: "Checks what is missing from the bill of quantities" },
      { ro: "Compară ofertele primite de la furnizori", en: "Compares the quotes that come back from suppliers" },
      { ro: "Alerte pe termenele care se apropie", en: "Alerts on deadlines coming up" },
    ],
    url: "https://energoprest.humanex.space",
    live: true,
    accent: "#a78bfa",
  },
  {
    name: { ro: "da Vinci", en: "da Vinci" },
    kind: { ro: "Site + Promovare", en: "Website + Marketing" },
    client: { ro: "Restaurant & boutique hotel · Brașov", en: "Restaurant & boutique hotel · Brașov" },
    desc: {
      ro: "Site complet pentru un restaurant din Centrul Vechi al Brașovului, cu meniul real de 278 de preparate și rezervări trimise direct pe WhatsApp. Plus campanii plătite pe Meta și TikTok și conținut foto-video produs lunar.",
      en: "A complete website for a restaurant in Brașov's old town, with the real 278-dish menu and reservations sent straight to WhatsApp. Plus paid Meta and TikTok campaigns and monthly photo and video content.",
    },
    points: [
      { ro: "Meniu complet, care se salvează ca PDF", en: "Full menu, saveable as a PDF" },
      { ro: "Rezervări de masă și de cameră, pe WhatsApp", en: "Table and room bookings, over WhatsApp" },
      { ro: "Campanii Meta și TikTok, țintite pe turiști și localnici", en: "Meta and TikTok campaigns, targeting tourists and locals" },
      { ro: "Fără abonament lunar de găzduire", en: "No monthly hosting subscription" },
    ],
    url: "https://davincibrasov.com",
    live: true,
    accent: "#f0b429",
  },
  {
    name: { ro: "SpecialDelivery", en: "SpecialDelivery" },
    kind: { ro: "Site + Promovare", en: "Website + Marketing" },
    client: { ro: "Livrări fast food · Județul Bacău", en: "Fast food delivery · Romania" },
    desc: {
      ro: "Brandurile mari de livrare se opreau la marginea orașului. Am construit site-ul prin care satele și orașele din tot județul puteau comanda aceeași mâncare, livrată caldă — plus campaniile care au dus vestea acolo.",
      en: "The big delivery brands stopped at the edge of the city. We built the site that let villages and towns across the whole county order the same food, delivered hot — plus the campaigns that spread the word.",
    },
    points: [
      { ro: "Preluare de comenzi direct, fără intermediari", en: "Orders taken directly, no middlemen" },
      { ro: "Campanii țintite pe localitățile fără acoperire", en: "Campaigns targeted at areas with no coverage" },
      { ro: "Acoperire în tot județul", en: "Coverage across the whole county" },
    ],
    live: true,
    accent: "#4ade80",
  },
];

/* Capturi din prezentarea CloseCheck */
const CC_SHOTS: { src: string; cap: TX }[] = [
  { src: "/cc-mobil.jpg", cap: { ro: "Închiderea turei, de pe telefon", en: "Shift close, from the phone" } },
  { src: "/cc-panou.jpg", cap: { ro: "Panoul contabilului", en: "The accountant's dashboard" } },
  { src: "/cc-rezultate.jpg", cap: { ro: "Rezultatul pentru client", en: "Results per client" } },
  { src: "/cc-termene.jpg", cap: { ro: "Termene și declarații", en: "Deadlines and filings" } },
];

/* ── Servicii ───────────────────────────────────────────────── */

const SERVICES: { icon: string; title: TX; desc: TX; tags: TX[] }[] = [
  {
    icon: "⚙️",
    title: { ro: "Software la comandă", en: "Custom software" },
    desc: {
      ro: "Construim exact sistemul de care are nevoie afacerea ta. Dacă îl poți descrie, îl putem construi.",
      en: "We build exactly the system your business needs. If you can describe it, we can build it.",
    },
    tags: [
      { ro: "La comandă", en: "Bespoke" },
      { ro: "Scalabil", en: "Scalable" },
      { ro: "Cloud", en: "Cloud" },
    ],
  },
  {
    icon: "📊",
    title: { ro: "Sisteme de raportare", en: "Reporting systems" },
    desc: {
      ro: "Rapoarte zilnice trimise automat pe email și WhatsApp, în timp real, fără niciun calculator pornit.",
      en: "Daily reports sent automatically by email and WhatsApp, in real time, with no computer running.",
    },
    tags: [
      { ro: "Email", en: "Email" },
      { ro: "WhatsApp", en: "WhatsApp" },
      { ro: "PDF", en: "PDF" },
    ],
  },
  {
    icon: "🗂️",
    title: { ro: "Panouri de control", en: "Dashboards" },
    desc: {
      ro: "Urmărești clienți, lucrări, echipe și facturi dintr-un singur loc, construit pentru felul tău de a lucra.",
      en: "Track clients, jobs, teams and invoices from one place, built around the way you actually work.",
    },
    tags: [
      { ro: "CRM", en: "CRM" },
      { ro: "Facturi", en: "Invoicing" },
      { ro: "Echipe", en: "Teams" },
    ],
  },
  {
    icon: "🌐",
    title: { ro: "Site-uri și magazine online", en: "Websites and online stores" },
    desc: {
      ro: "Site-uri rapide, care arată bine pe telefon și aduc cereri reale — nu doar vizite.",
      en: "Fast sites that look right on a phone and bring in real enquiries — not just visits.",
    },
    tags: [
      { ro: "Site", en: "Website" },
      { ro: "Shopify", en: "Shopify" },
      { ro: "SEO", en: "SEO" },
    ],
  },
  {
    icon: "🎯",
    title: { ro: "Campanii Meta Ads", en: "Meta Ads campaigns" },
    desc: {
      ro: "Reclame pe Facebook și Instagram — targetare locală, buget controlat, raport lunar clar.",
      en: "Facebook and Instagram ads — local targeting, controlled budget, a clear monthly report.",
    },
    tags: [
      { ro: "Facebook", en: "Facebook" },
      { ro: "Instagram", en: "Instagram" },
      { ro: "Targetare", en: "Targeting" },
    ],
  },
  {
    icon: "🎬",
    title: { ro: "Campanii TikTok Ads", en: "TikTok Ads campaigns" },
    desc: {
      ro: "Reclame video pentru audiențe tinere — creative produse de noi, testate și optimizate săptămânal.",
      en: "Video ads for younger audiences — creative made in-house, tested and tuned every week.",
    },
    tags: [
      { ro: "TikTok", en: "TikTok" },
      { ro: "Video", en: "Video" },
      { ro: "Optimizare", en: "Optimisation" },
    ],
  },
  {
    icon: "📱",
    title: { ro: "Gestionare social media", en: "Social media management" },
    desc: {
      ro: "Ne ocupăm complet de paginile tale: plan de conținut, postări, reels, story-uri și răspuns la mesaje.",
      en: "We run your pages end to end: content plan, posts, reels, stories and replies to messages.",
    },
    tags: [
      { ro: "Conținut", en: "Content" },
      { ro: "Reels", en: "Reels" },
      { ro: "Comunitate", en: "Community" },
    ],
  },
  {
    icon: "📸",
    title: { ro: "Conținut foto și video", en: "Photo and video content" },
    desc: {
      ro: "Producție de materiale pentru rețele și reclame, cu editare profesională și unelte AI acolo unde ajută.",
      en: "Content produced for social and ads, professionally edited, with AI tools where they genuinely help.",
    },
    tags: [
      { ro: "Foto", en: "Photo" },
      { ro: "Video", en: "Video" },
      { ro: "Editare", en: "Editing" },
    ],
  },
  {
    icon: "🔗",
    title: { ro: "Integrări între programe", en: "Integrations" },
    desc: {
      ro: "Conectăm facturarea, plățile și calendarele pe care le folosești deja, într-un singur flux automat.",
      en: "We connect the invoicing, payments and calendars you already use into one automatic flow.",
    },
    tags: [
      { ro: "Facturare", en: "Invoicing" },
      { ro: "API", en: "API" },
      { ro: "Webhooks", en: "Webhooks" },
    ],
  },
  {
    icon: "💬",
    title: { ro: "Automatizare WhatsApp", en: "WhatsApp automation" },
    desc: {
      ro: "Notificări instant, mesaje către clienți și alerte automate, direct pe WhatsApp, 24/7.",
      en: "Instant notifications, customer messages and automatic alerts, straight to WhatsApp, 24/7.",
    },
    tags: [
      { ro: "Notificări", en: "Notifications" },
      { ro: "Clienți", en: "Customers" },
      { ro: "Alerte", en: "Alerts" },
    ],
  },
];

/* ── Proces ─────────────────────────────────────────────────── */

const STEPS: { number: string; title: TX; desc: TX; detail: TX }[] = [
  {
    number: "01",
    title: { ro: "Discuție inițială", en: "First conversation" },
    desc: {
      ro: "Aflăm despre afacerea ta, cum lucrezi acum și ce îți ia cel mai mult timp.",
      en: "We learn about your business, how you work today, and what eats the most time.",
    },
    detail: { ro: "Gratuit, fără obligații", en: "Free, no obligation" },
  },
  {
    number: "02",
    title: { ro: "Construim sistemul", en: "We build it" },
    desc: {
      ro: "În zile, nu în luni. Un sistem complet funcțional, făcut pentru nevoile tale exacte.",
      en: "In days, not months. A fully working system, built for your exact needs.",
    },
    detail: { ro: "Livrare în 3–7 zile", en: "Delivered in 3–7 days" },
  },
  {
    number: "03",
    title: { ro: "Tu te ocupi de afacere", en: "You get on with business" },
    desc: {
      ro: "Sistemul rulează singur. Fără mentenanță din partea ta — de tot ce apare ne ocupăm noi.",
      en: "The system runs itself. No upkeep on your side — anything that comes up, we handle.",
    },
    detail: { ro: "Suport inclus", en: "Support included" },
  },
];

/* ── Prețuri ────────────────────────────────────────────────── */

type Plan = {
  name: TX;
  price: string;
  period: "month" | "project";
  desc: TX;
  features: TX[];
  highlight?: boolean;
  badge: TX;
  isMonthly?: boolean;
};

const SOCIAL_PLANS: Plan[] = [
  {
    name: { ro: "Social Media Start", en: "Social Media Start" },
    price: "150 € – 300 €",
    period: "month",
    desc: {
      ro: "Postăm în fiecare zi pentru tine. Pagina rămâne activă, fără să te ocupi de nimic.",
      en: "We post every day for you. Your page stays alive without you touching it.",
    },
    features: [
      { ro: "O postare în fiecare zi — 30 pe lună", en: "A post every day — 30 a month" },
      { ro: "Story-uri zilnice", en: "Daily stories" },
      { ro: "Plan de conținut lunar", en: "Monthly content plan" },
      { ro: "Răspuns la comentarii și mesaje", en: "Replies to comments and messages" },
      { ro: "Raport lunar", en: "Monthly report" },
    ],
    badge: { ro: "Social Media", en: "Social Media" },
  },
  {
    name: { ro: "Social Media + Reclame", en: "Social Media + Ads" },
    price: "300 € – 600 €",
    period: "month",
    desc: {
      ro: "Postare zilnică, plus campanii plătite administrate și optimizate de noi.",
      en: "Daily posting, plus paid campaigns run and optimised by us.",
    },
    features: [
      { ro: "O postare în fiecare zi — 30 pe lună", en: "A post every day — 30 a month" },
      { ro: "8 reels pe lună", en: "8 reels a month" },
      { ro: "Campanii Meta Ads și TikTok Ads", en: "Meta Ads and TikTok Ads campaigns" },
      { ro: "Story-uri zilnice", en: "Daily stories" },
      { ro: "Răspuns la comentarii și mesaje", en: "Replies to comments and messages" },
      { ro: "Raport lunar", en: "Monthly report" },
    ],
    highlight: true,
    badge: { ro: "Cel mai ales", en: "Most chosen" },
  },
];

const PLANS: Plan[] = [
  {
    name: { ro: "Pagină de prezentare", en: "Landing page" },
    price: "300 € – 500 €",
    period: "project",
    desc: {
      ro: "Design modern, arată bine pe telefon, formular de contact și SEO de bază.",
      en: "Modern design, looks right on a phone, contact form and basic SEO.",
    },
    features: [
      { ro: "Design modern", en: "Modern design" },
      { ro: "Optimizat pentru telefon", en: "Mobile-first" },
      { ro: "Formular + WhatsApp", en: "Form + WhatsApp" },
      { ro: "SEO de bază", en: "Basic SEO" },
    ],
    badge: { ro: "Web", en: "Web" },
  },
  {
    name: { ro: "Site de firmă", en: "Business website" },
    price: "700 € – 1.500 €",
    period: "project",
    desc: {
      ro: "Site complet, cu design premium, analytics și automatizări de bază.",
      en: "A complete site with premium design, analytics and basic automation.",
    },
    features: [
      { ro: "Design premium", en: "Premium design" },
      { ro: "Analytics integrat", en: "Analytics built in" },
      { ro: "Automatizări de bază", en: "Basic automation" },
      { ro: "SEO complet", en: "Full SEO" },
    ],
    badge: { ro: "Web", en: "Web" },
  },
  {
    name: { ro: "Magazin online", en: "Online store" },
    price: "1.500 € – 3.000 €",
    period: "project",
    desc: {
      ro: "Magazin complet, cu produse, plăți online și design premium.",
      en: "A full store with products, online payments and premium design.",
    },
    features: [
      { ro: "Configurare completă", en: "Full setup" },
      { ro: "Produse și colecții", en: "Products and collections" },
      { ro: "Plăți online", en: "Online payments" },
      { ro: "Design premium", en: "Premium design" },
    ],
    badge: { ro: "E-commerce", en: "E-commerce" },
  },
  {
    name: { ro: "Sistem de raportare", en: "Reporting system" },
    price: "1.000 € – 3.000 €",
    period: "project",
    desc: {
      ro: "Ca la Energoprest: echipa completează de pe telefon, tu primești raportul pe email și WhatsApp.",
      en: "Like Energoprest: the crew files from their phone, you get the report by email and WhatsApp.",
    },
    features: [
      { ro: "Formular mobil pentru echipă", en: "Mobile form for the crew" },
      { ro: "Raport PDF automat", en: "Automatic PDF report" },
      { ro: "Email și WhatsApp", en: "Email and WhatsApp" },
      { ro: "Poze de pe teren", en: "Photos from the field" },
    ],
    highlight: true,
    badge: { ro: "Sisteme", en: "Systems" },
  },
  {
    name: { ro: "Panou de control", en: "Custom dashboard" },
    price: "1.500 € – 5.000 €",
    period: "project",
    desc: {
      ro: "Clienți, lucrări, echipe și facturi într-un singur loc, construit pe fluxul tău.",
      en: "Clients, jobs, teams and invoices in one place, built around your workflow.",
    },
    features: [
      { ro: "Panou la comandă", en: "Bespoke dashboard" },
      { ro: "Gestionare clienți", en: "Client management" },
      { ro: "Cifre în timp real", en: "Real-time numbers" },
      { ro: "Notificări automate", en: "Automatic notifications" },
    ],
    badge: { ro: "Sisteme", en: "Systems" },
  },
  {
    name: { ro: "Automatizare completă", en: "Full automation" },
    price: "2.000 € – 7.000 €",
    period: "project",
    desc: {
      ro: "Legăm tot ce folosești deja — facturare, WhatsApp, email — într-un singur flux automat.",
      en: "We tie together everything you already use — invoicing, WhatsApp, email — into one automatic flow.",
    },
    features: [
      { ro: "Automatizări complete", en: "End-to-end automation" },
      { ro: "Fluxuri WhatsApp", en: "WhatsApp flows" },
      { ro: "Email automat", en: "Automated email" },
      { ro: "Panou operațional", en: "Operations dashboard" },
    ],
    badge: { ro: "Automatizare", en: "Automation" },
  },
];

const SUPPORT_PLANS: Plan[] = [
  {
    name: { ro: "Suport de bază", en: "Basic support" },
    price: "50 € – 100 €",
    period: "month",
    desc: {
      ro: "Actualizări, reparații și suport tehnic lunar.",
      en: "Updates, fixes and technical support each month.",
    },
    features: [
      { ro: "Actualizări lunare", en: "Monthly updates" },
      { ro: "Reparații", en: "Bug fixes" },
      { ro: "Suport tehnic", en: "Technical support" },
      { ro: "Monitorizare", en: "Uptime monitoring" },
    ],
    badge: { ro: "Mentenanță", en: "Support" },
    isMonthly: true,
  },
  {
    name: { ro: "Suport extins", en: "Growth support" },
    price: "150 € – 300 €",
    period: "month",
    desc: {
      ro: "Automatizări noi, optimizări și îmbunătățiri continue.",
      en: "New automations, optimisation and continuous improvement.",
    },
    features: [
      { ro: "Automatizări noi", en: "New automations" },
      { ro: "Cifre detaliate", en: "Deeper analytics" },
      { ro: "Optimizări continue", en: "Continuous optimisation" },
      { ro: "Raport lunar", en: "Monthly report" },
    ],
    badge: { ro: "Mentenanță", en: "Support" },
    isMonthly: true,
  },
];

/* ── Cifre și întrebări ─────────────────────────────────────── */

const STATS: { value: string; label: TX }[] = [
  { value: "24/7", label: { ro: "Sistemele rulează non-stop", en: "Systems run around the clock" } },
  { value: "3–7", label: { ro: "Zile până la livrare", en: "Days to delivery" } },
  { value: "100%", label: { ro: "Construit la comandă", en: "Built bespoke" } },
  { value: "0", label: { ro: "Mentenanță din partea ta", en: "Upkeep on your side" } },
];

const FAQS: { q: TX; a: TX }[] = [
  {
    q: { ro: "Lucrați și cu clienți din afara României?", en: "Do you work with clients outside Romania?" },
    a: {
      ro: "Da. Lucrăm la distanță, în engleză sau română, iar plata se face prin transfer bancar în euro. Firma noastră e înregistrată în România, cu facturare în regulă pentru clienți din UE.",
      en: "Yes. We work remotely, in English or Romanian, and invoice in euro by bank transfer. Our company is registered in Romania, with proper invoicing for EU clients.",
    },
  },
  {
    q: { ro: "Cât durează să construiți un sistem?", en: "How long does a system take to build?" },
    a: {
      ro: "De obicei între 3 și 7 zile lucrătoare, în funcție de complexitate. Sistemele simple pot fi gata chiar și în 24 de ore.",
      en: "Usually between 3 and 7 working days, depending on complexity. Simple systems can be ready within 24 hours.",
    },
  },
  {
    q: { ro: "Am nevoie de cunoștințe tehnice?", en: "Do I need any technical knowledge?" },
    a: {
      ro: "Deloc. Noi ne ocupăm de toată partea tehnică. Tu primești un sistem gata de folosit, cu instrucțiuni clare.",
      en: "Not at all. We handle the technical side. You get a system that is ready to use, with clear instructions.",
    },
  },
  {
    q: { ro: "Bugetul de reclame e inclus în preț?", en: "Is ad spend included in the price?" },
    a: {
      ro: "Nu. Prețul acoperă strategia, conținutul, administrarea și optimizarea. Bugetul de reclame îl plătești separat, direct către Meta sau TikTok, din contul tău — așa vezi exact cât se cheltuie și rămâi proprietarul contului.",
      en: "No. The price covers strategy, content, management and optimisation. Ad spend is paid separately, straight to Meta or TikTok from your own account — so you see exactly what is spent and you stay the owner of the account.",
    },
  },
  {
    q: { ro: "Există contract pe termen lung?", en: "Is there a long-term contract?" },
    a: {
      ro: "Nu. Lucrăm lunar, iar prima lună o poți trata ca perioadă de probă. Dacă nu ești mulțumit, ne oprim fără penalizări. Conturile și paginile rămân întotdeauna ale tale.",
      en: "No. We work month to month, and you can treat the first month as a trial. If you are not happy, we stop, with no penalty. The accounts and pages are always yours.",
    },
  },
  {
    q: { ro: "Sistemele merg și când nu am calculatorul pornit?", en: "Do the systems work when my computer is off?" },
    a: {
      ro: "Da, complet. Totul rulează în cloud. Calculatorul tău nu are nicio legătură cu funcționarea sistemului.",
      en: "Yes, entirely. Everything runs in the cloud. Your computer has nothing to do with whether the system works.",
    },
  },
  {
    q: { ro: "Cui aparțin codul și datele?", en: "Who owns the code and the data?" },
    a: {
      ro: "Ție. Primești sistemul și datele, iar dacă vrei să pleci în altă parte, nu te ține nimic aici.",
      en: "You do. You get the system and the data, and if you ever want to move elsewhere, nothing holds you here.",
    },
  },
  {
    q: { ro: "Pot adăuga funcții noi mai târziu?", en: "Can I add features later?" },
    a: {
      ro: "Da. Construim modular tocmai ca sistemul să poată crește odată cu afacerea.",
      en: "Yes. We build modular precisely so the system can grow as the business does.",
    },
  },
];

const EMAILJS_SERVICE = "service_vgg5fdg";
const EMAILJS_TEMPLATE = "template_asjlv4r";
const EMAILJS_KEY = "km3Un_Nuwq0eqaiPP";

const META: Record<Lang, { title: string; desc: string }> = {
  ro: {
    title: "HUMANEX — Sisteme AI și promovare pentru afaceri",
    desc: "Software la comandă, sisteme de raportare și campanii Meta și TikTok pentru afaceri mici și mijlocii. Din Brașov, România.",
  },
  en: {
    title: "HUMANEX — Custom software and marketing for small business",
    desc: "Bespoke software, reporting systems and Meta and TikTok campaigns for small and mid-sized businesses. Based in Romania, working worldwide.",
  },
};

/* Limba de start: alegerea salvată, altfel româna doar pentru un
   browser setat pe română. Restul lumii primește engleză din prima —
   un vizitator străin care nimerește pe o pagină în română pleacă
   înainte să caute butonul de limbă. */
function limbaInitiala(): Lang {
  try {
    const salvat = localStorage.getItem("humanex-lang");
    if (salvat === "ro" || salvat === "en") return salvat;
  } catch {
    /* localStorage blocat (fereastră privată) — mergem pe browser */
  }
  const nav = typeof navigator !== "undefined" ? navigator.language : "";
  return nav.toLowerCase().startsWith("ro") ? "ro" : "en";
}

export default function App() {
  const [lang, setLang] = useState<Lang>(limbaInitiala);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);

  const L = (x: TX) => t(x, lang);

  useEffect(() => {
    try {
      localStorage.setItem("humanex-lang", lang);
    } catch {
      /* fără localStorage, alegerea ține doar cât e pagina deschisă */
    }
    document.documentElement.lang = lang;
    document.title = META[lang].title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", META[lang].desc);
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  /* Videoul se încarcă abia la apăsare (preload="none"), deci cele
     14 MB nu intră în costul primei vizite. */
  const porneste = () => {
    setPlaying(true);
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  };

  const navLinks = [
    { label: UI.navProjects, id: "proiecte" },
    { label: UI.navServices, id: "servicii" },
    { label: UI.navProcess, id: "proces" },
    { label: UI.navPricing, id: "preturi" },
    { label: UI.navContact, id: "contact" },
  ];

  const eyebrow: React.CSSProperties = {
    fontSize: 12, fontWeight: 700, color: "#60a5fa",
    letterSpacing: 3, textTransform: "uppercase", marginBottom: 14,
  };
  const h2: React.CSSProperties = {
    fontSize: "clamp(30px, 4vw, 48px)", fontWeight: 900,
    letterSpacing: "-1.5px", lineHeight: 1.15,
  };
  const card: React.CSSProperties = {
    background: "rgba(255,255,255,0.025)",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 20,
  };
  const input: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 12, padding: "15px 18px", color: "#fff", fontSize: 15,
    outline: "none", fontFamily: "inherit", width: "100%", boxSizing: "border-box",
  };

  const Logo = ({ size = 42, id = "lg" }: { size?: number; id?: string }) => (
    <svg width={size} height={size} viewBox="0 0 42 42" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <path d="M21 2L38 11.5V30.5L21 40L4 30.5V11.5L21 2Z" fill={`url(#${id})`} opacity="0.15" />
      <path d="M21 2L38 11.5V30.5L21 40L4 30.5V11.5L21 2Z" stroke={`url(#${id})`} strokeWidth="1.5" fill="none" />
      <text x="21" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="900"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">H</text>
      <circle cx="21" cy="2" r="2" fill="#0ea5e9" opacity="0.8" />
    </svg>
  );

  const planCard = (plan: Plan) => (
    <div key={plan.name.en} className={plan.highlight ? "pricing-highlight" : undefined} style={{
      ...card,
      background: plan.highlight ? "linear-gradient(160deg, #1d4ed8 0%, #1e3a8a 100%)" : card.background,
      border: plan.highlight ? "1px solid rgba(96,165,250,0.4)" : card.border,
      padding: "32px 26px", position: "relative",
      boxShadow: plan.highlight ? "0 0 60px rgba(29,78,216,0.28)" : "none",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{
        alignSelf: "flex-start", fontSize: 10, fontWeight: 800, letterSpacing: 1,
        textTransform: "uppercase", padding: "4px 10px", borderRadius: 6, marginBottom: 16,
        color: plan.highlight ? "#fff" : "#93c5fd",
        background: plan.highlight ? "rgba(255,255,255,0.18)" : "rgba(29,78,216,0.15)",
        border: plan.highlight ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(29,78,216,0.3)",
      }}>{L(plan.badge)}</div>

      <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, letterSpacing: "-0.3px" }}>{L(plan.name)}</h4>
      <p style={{
        fontSize: 13, lineHeight: 1.7, marginBottom: 18,
        color: plan.highlight ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.45)",
      }}>{L(plan.desc)}</p>

      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 22 }}>
        <span style={{ fontSize: 25, fontWeight: 900, letterSpacing: "-1px" }}>{plan.price}</span>
        <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)" }}>
          / {plan.period === "month" ? L(UI.perMonth) : L(UI.perProject)}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
        {plan.features.map((f) => (
          <div key={f.en} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
            <span style={{ fontSize: 12, lineHeight: "22px", color: plan.highlight ? "#bfdbfe" : "#60a5fa" }}>✓</span>
            <span style={{ fontSize: 13.5, lineHeight: 1.6, color: plan.highlight ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.7)" }}>{L(f)}</span>
          </div>
        ))}
      </div>

      <a href="#contact" style={{
        display: "block", textAlign: "center", padding: "12px 18px", borderRadius: 10,
        fontSize: 13.5, fontWeight: 700, textDecoration: "none", marginTop: "auto",
        color: plan.highlight ? "#1e3a8a" : "#93c5fd",
        background: plan.highlight ? "#fff" : "rgba(29,78,216,0.14)",
        border: plan.highlight ? "1px solid #fff" : "1px solid rgba(29,78,216,0.3)",
      }}>{L(UI.planCta)} →</a>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#040d1f", color: "#fff", overflowX: "hidden" }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "rgba(4,13,31,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        transition: "background .4s ease, border-color .4s ease",
        padding: "0 48px", height: 72,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#fff" }}>
          <Logo />
          <div>
            <div style={{ fontWeight: 900, fontSize: 19, letterSpacing: "0.5px", lineHeight: 1 }}>HUMANEX</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 3, textTransform: "uppercase", marginTop: 2 }}>
              {L(UI.tagline)}
            </div>
          </div>
        </a>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div className="nav-links" style={{ display: "flex", gap: 32, alignItems: "center" }}>
            {navLinks.map((l) => (
              <a key={l.id} href={`#${l.id}`} style={{
                color: "rgba(255,255,255,0.55)", fontSize: 14, fontWeight: 500, textDecoration: "none",
                transition: "color .2s", whiteSpace: "nowrap",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >{L(l.label)}</a>
            ))}
          </div>

          {/* Comutatorul de limbă rămâne vizibil și pe telefon, unde
              restul navigației dispare — altfel un vizitator străin
              n-ar avea nicio cale să schimbe limba. */}
          <div role="group" aria-label="Language" style={{
            display: "flex", alignItems: "center",
            border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999,
            padding: 3, gap: 2, flexShrink: 0,
          }}>
            {(["ro", "en"] as Lang[]).map((code) => (
              <button key={code} onClick={() => setLang(code)}
                aria-pressed={lang === code}
                style={{
                  border: "none", cursor: "pointer", borderRadius: 999,
                  padding: "5px 11px", fontSize: 12, fontWeight: 800, letterSpacing: 0.6,
                  fontFamily: "inherit", transition: "background .2s, color .2s",
                  background: lang === code ? "linear-gradient(135deg, #1d4ed8, #0ea5e9)" : "transparent",
                  color: lang === code ? "#fff" : "rgba(255,255,255,0.5)",
                }}>{code.toUpperCase()}</button>
            ))}
          </div>

          <a href="#contact" className="nav-cta" style={{
            background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
            color: "#fff", padding: "10px 22px", borderRadius: 8,
            fontWeight: 700, fontSize: 14, textDecoration: "none", whiteSpace: "nowrap",
            boxShadow: "0 0 24px rgba(29,78,216,0.35)",
          }}>{L(UI.navCta)}</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="top" className="hero-section" style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "130px 24px 80px", textAlign: "center", position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
          <div style={{
            position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
            width: 900, height: 900, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(29,78,216,0.13) 0%, transparent 65%)",
          }} />
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage:
              "linear-gradient(rgba(29,78,216,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(29,78,216,0.04) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }} />
        </div>

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
            {L(UI.heroBadge)}
          </span>
        </div>

        <h1 style={{
          fontSize: "clamp(38px, 6.2vw, 78px)", fontWeight: 900,
          lineHeight: 1.05, letterSpacing: "-2.5px", maxWidth: 900, marginBottom: 28,
        }}>
          {L(UI.heroTitle1)}{" "}
          <span style={{
            background: "linear-gradient(135deg, #60a5fa 0%, #0ea5e9 50%, #38bdf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{L(UI.heroTitle2)}</span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.5)",
          maxWidth: 640, lineHeight: 1.75, marginBottom: 44,
        }}>{L(UI.heroSub)}</p>

        <div className="hero-cta" style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", marginBottom: 80 }}>
          <a href="#contact" style={{
            background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
            color: "#fff", padding: "16px 36px", borderRadius: 12,
            fontWeight: 800, fontSize: 16, textDecoration: "none",
            boxShadow: "0 0 50px rgba(29,78,216,0.45)",
            display: "flex", alignItems: "center", gap: 8,
          }}>{L(UI.heroCta1)} <span style={{ fontSize: 18 }}>→</span></a>
          <a href="#proiecte" style={{
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff", padding: "16px 36px", borderRadius: 12,
            fontWeight: 600, fontSize: 16, textDecoration: "none",
          }}>{L(UI.heroCta2)}</a>
        </div>

        <div className="hero-stats" style={{
          display: "flex", flexWrap: "wrap", justifyContent: "center",
          background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 16, overflow: "hidden", maxWidth: 820, width: "100%",
        }}>
          {STATS.map((s, i) => (
            <div key={s.label.en} className="stat-item" style={{
              flex: "1 1 180px", padding: "24px 20px", textAlign: "center",
              borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
            }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#60a5fa", marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{L(s.label)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLOSECHECK — proiectul cu video ── */}
      <section id="proiecte" style={{ padding: "90px 24px 0" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <p style={eyebrow}>{L(UI.ccEyebrow)}</p>

          <div className="cc-head" style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            gap: 28, flexWrap: "wrap", marginBottom: 40,
          }}>
            <div>
              <h2 style={{ ...h2, marginBottom: 10 }}>CloseCheck</h2>
              <p style={{ fontSize: 17, color: "#93c5fd", fontWeight: 600 }}>
                {lang === "ro" ? "Verificarea pe care n-o face nimeni" : "The check nobody runs"}
              </p>
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", maxWidth: 440, lineHeight: 1.8 }}>
              {L(PROJECTS[0].desc)}
            </p>
          </div>

          {/* Player: poster întâi, videoul se descarcă abia la apăsare */}
          <div style={{
            position: "relative", borderRadius: 20, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)", background: "#0b1628",
            boxShadow: "0 30px 90px -30px rgba(0,0,0,0.8)", aspectRatio: "16 / 9",
          }}>
            {playing ? (
              <video ref={videoRef} controls playsInline preload="auto"
                poster="/closecheck-poster.jpg"
                style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}>
                <source src="/closecheck.mp4" type="video/mp4" />
                {L(UI.ccNoVideo)}
              </video>
            ) : (
              <button onClick={porneste} aria-label={L(UI.ccWatch)} style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                border: "none", padding: 0, cursor: "pointer", background: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src="/closecheck-poster.jpg" alt={L(PROJECTS[0].name)}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <span style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(180deg, rgba(4,13,31,0.15) 0%, rgba(4,13,31,0.72) 100%)",
                }} />
                <span style={{
                  position: "relative", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: 16, color: "#fff",
                }}>
                  <span style={{
                    width: 74, height: 74, borderRadius: "50%",
                    background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 60px rgba(29,78,216,0.65)", fontSize: 26, paddingLeft: 6,
                  }}>▶</span>
                  {/* Umbra ține textul lizibil peste orice cadru ar ajunge
                      poster — partea de sus a lui e hârtie deschisă. */}
                  <span style={{
                    fontSize: 15, fontWeight: 700, letterSpacing: 0.3,
                    textShadow: "0 2px 14px rgba(0,0,0,0.85)",
                  }}>{L(UI.ccWatch)}</span>
                  <span style={{
                    fontSize: 12, color: "rgba(255,255,255,0.75)",
                    textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                  }}>{L(UI.ccDuration)}</span>
                </span>
              </button>
            )}
          </div>

          {/* Principiul care îl deosebește — merită spațiul lui */}
          <div style={{
            margin: "28px 0 36px", padding: "26px 30px", borderRadius: 16,
            background: "rgba(29,78,216,0.07)", border: "1px solid rgba(29,78,216,0.22)",
            borderLeft: "3px solid #60a5fa",
          }}>
            <p style={{ fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.65, color: "rgba(255,255,255,0.9)" }}>
              {lang === "ro"
                ? "Un sistem care numește pe cineva după două zile e mai periculos decât unul care nu numește pe nimeni. Sub pragul lui de dovezi, CloseCheck tace — și spune de ce tace."
                : "A system that names someone after two days is more dangerous than one that names nobody. Below its evidence threshold, CloseCheck stays quiet — and tells you why."}
            </p>
          </div>

          <div className="cc-shots" style={{
            display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 20,
          }}>
            {CC_SHOTS.map((shot) => (
              <figure key={shot.src} style={{ margin: 0 }}>
                <img src={shot.src} alt={L(shot.cap)} loading="lazy"
                  style={{
                    width: "100%", display: "block", borderRadius: 12,
                    border: "1px solid rgba(255,255,255,0.08)",
                  }} />
                <figcaption style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 10, lineHeight: 1.5 }}>
                  {L(shot.cap)}
                </figcaption>
              </figure>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", marginBottom: 20 }}>
            {PROJECTS[0].points.map((p) => (
              <div key={p.en} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span style={{ color: "#60a5fa", fontSize: 13 }}>✓</span>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.72)" }}>{L(p)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CELELALTE PROIECTE ── */}
      <section style={{ padding: "80px 24px 110px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <p style={eyebrow}>{L(UI.projectsEyebrow)}</p>
            <h2 style={{ ...h2, marginBottom: 14 }}>{L(UI.projectsTitle)}</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 560, lineHeight: 1.7 }}>
              {L(UI.projectsSub)}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {PROJECTS.slice(1).map((p) => (
              <article key={p.name.en} className="project-card" style={{
                ...card, padding: "40px 44px", position: "relative", overflow: "hidden",
              }}>
                <div className="project-grid" style={{
                  display: "grid", gridTemplateColumns: "1fr 1.35fr", gap: 44, alignItems: "start",
                }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
                        color: p.accent, background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "3px 10px",
                      }}>{L(p.kind)}</span>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
                        color: p.live ? "#4ade80" : "#fbbf24",
                      }}>
                        <span style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: p.live ? "#4ade80" : "#fbbf24",
                        }} />
                        {p.live ? L(UI.liveLabel) : L(UI.buildingLabel)}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900,
                      letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 8,
                      overflowWrap: "anywhere",
                    }}>{L(p.name)}</h3>
                    <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", marginBottom: 22 }}>{L(p.client)}</p>

                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        fontSize: 13.5, fontWeight: 700, textDecoration: "none", color: p.accent,
                        border: `1px solid ${p.accent}44`, borderRadius: 9, padding: "8px 15px",
                      }}>{L(UI.visitLabel)} ↗</a>
                    )}
                  </div>

                  <div>
                    <p style={{
                      fontSize: "clamp(15px, 1.7vw, 17px)", color: "rgba(255,255,255,0.85)",
                      lineHeight: 1.7, marginBottom: 24,
                    }}>{L(p.desc)}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {p.points.map((pt) => (
                        <div key={pt.en} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <span style={{ color: p.accent, fontSize: 13, lineHeight: "22px" }}>✓</span>
                          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>{L(pt)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICII ── */}
      <section id="servicii" style={{ padding: "110px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div className="services-header" style={{
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            marginBottom: 56, flexWrap: "wrap", gap: 24,
          }}>
            <div>
              <p style={eyebrow}>{L(UI.servicesEyebrow)}</p>
              <h2 style={{ ...h2, maxWidth: 560 }}>{L(UI.servicesTitle)}</h2>
            </div>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", maxWidth: 340, lineHeight: 1.8 }}>
              {L(UI.servicesSub)}
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {SERVICES.map((s) => (
              <div key={s.title.en} style={{ ...card, padding: "30px 26px", transition: "border-color .3s, transform .3s, background .3s" }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(29,78,216,0.5)";
                  el.style.background = "rgba(29,78,216,0.06)";
                  el.style.transform = "translateY(-5px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(255,255,255,0.07)";
                  el.style.background = "rgba(255,255,255,0.025)";
                  el.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: "rgba(29,78,216,0.15)", border: "1px solid rgba(29,78,216,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 23, marginBottom: 18,
                }}>{s.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 11, letterSpacing: "-0.3px" }}>{L(s.title)}</h3>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: 18 }}>{L(s.desc)}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {s.tags.map((tag) => (
                    <span key={tag.en} style={{
                      fontSize: 11, fontWeight: 700, color: "#60a5fa",
                      background: "rgba(29,78,216,0.12)", border: "1px solid rgba(29,78,216,0.25)",
                      borderRadius: 6, padding: "3px 10px", letterSpacing: 0.5,
                    }}>{L(tag)}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCES ── */}
      <section id="proces" style={{ padding: "110px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={eyebrow}>{L(UI.processEyebrow)}</p>
            <h2 style={h2}>{L(UI.processTitle)}</h2>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {STEPS.map((step, i) => (
              <div key={step.number} style={{ position: "relative" }}>
                {i < STEPS.length - 1 && (
                  <div className="step-connector" style={{
                    position: "absolute", top: 32, left: "calc(100% - 12px)", right: "-12px",
                    height: 1, background: "linear-gradient(90deg, rgba(29,78,216,0.5), rgba(29,78,216,0.1))",
                  }} />
                )}
                <div style={{ ...card, padding: "34px 28px", height: "100%", boxSizing: "border-box" }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 14,
                    background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 900, fontSize: 20, marginBottom: 22,
                    boxShadow: "0 0 30px rgba(29,78,216,0.4)",
                  }}>{step.number}</div>
                  <div style={{
                    display: "inline-block", fontSize: 11, fontWeight: 700,
                    color: "#22d3ee", background: "rgba(34,211,238,0.1)",
                    border: "1px solid rgba(34,211,238,0.2)", borderRadius: 6,
                    padding: "3px 10px", marginBottom: 14, letterSpacing: 0.5,
                  }}>{L(step.detail)}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 11, letterSpacing: "-0.3px" }}>{L(step.title)}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.75 }}>{L(step.desc)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREȚURI ── */}
      <section id="preturi" style={{ padding: "110px 24px", background: "rgba(255,255,255,0.015)" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={eyebrow}>{L(UI.pricingEyebrow)}</p>
            <h2 style={{ ...h2, marginBottom: 16 }}>{L(UI.pricingTitle)}</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              {L(UI.pricingSub)}
            </p>
          </div>

          <div style={{ marginBottom: 52 }}>
            <h3 className="price-group" style={{
              fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)",
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 22,
            }}>{L(UI.pricingSocial)}</h3>
            <div className="pricing-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16, maxWidth: 760, margin: "0 auto",
            }}>
              {SOCIAL_PLANS.map(planCard)}
            </div>
            <p style={{
              fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.7,
              maxWidth: 760, margin: "16px auto 0",
            }}>{L(UI.pricingNote)}</p>
          </div>

          <div style={{ marginBottom: 52 }}>
            <h3 className="price-group" style={{
              fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)",
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 22,
            }}>{L(UI.pricingOneTime)}</h3>
            <div className="pricing-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16,
            }}>
              {PLANS.map(planCard)}
            </div>
          </div>

          <div>
            <h3 className="price-group" style={{
              fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)",
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 22,
            }}>{L(UI.pricingMonthly)}</h3>
            <div className="pricing-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16, maxWidth: 760,
            }}>
              {SUPPORT_PLANS.map(planCard)}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "110px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={eyebrow}>{L(UI.faqEyebrow)}</p>
            <h2 style={h2}>{L(UI.faqTitle)}</h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq, i) => (
              <div key={faq.q.en} style={{
                ...card, borderRadius: 16, overflow: "hidden",
                borderColor: openFaq === i ? "rgba(29,78,216,0.4)" : "rgba(255,255,255,0.07)",
                transition: "border-color .2s",
              }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  style={{
                    width: "100%", padding: "20px 24px", background: "none", border: "none",
                    cursor: "pointer", display: "flex", justifyContent: "space-between",
                    alignItems: "center", color: "#fff", textAlign: "left", gap: 16,
                    fontFamily: "inherit",
                  }}>
                  <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.45 }}>{L(faq.q)}</span>
                  <span style={{
                    fontSize: 20, color: "#60a5fa", flexShrink: 0,
                    transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform .2s",
                  }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: "0 24px 20px" }}>
                    <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.8 }}>{L(faq.a)}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BANDĂ CTA ── */}
      <section style={{ padding: "0 24px 110px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div className="cta-band" style={{
            background: "linear-gradient(135deg, #1d4ed8 0%, #0f172a 60%, #1e40af 100%)",
            border: "1px solid rgba(96,165,250,0.2)", borderRadius: 24,
            padding: "68px 56px", textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
              width: 500, height: 500, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <h2 style={{ ...h2, fontSize: "clamp(27px, 4vw, 48px)", marginBottom: 16, position: "relative" }}>
              {L(UI.ctaTitle)}
            </h2>
            <p style={{
              fontSize: 17, color: "rgba(255,255,255,0.65)", maxWidth: 520,
              margin: "0 auto 36px", lineHeight: 1.7, position: "relative",
            }}>{L(UI.ctaSub)}</p>
            <a href="#contact" style={{
              background: "#fff", color: "#1d4ed8", padding: "16px 40px", borderRadius: 12,
              fontWeight: 900, fontSize: 17, textDecoration: "none",
              display: "inline-block", position: "relative",
            }}>{L(UI.ctaButton)} →</a>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "0 24px 110px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={eyebrow}>{L(UI.contactEyebrow)}</p>
            <h2 style={{ ...h2, marginBottom: 16 }}>{L(UI.contactTitle)}</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{L(UI.contactSub)}</p>
          </div>

          <form ref={formRef} style={{ display: "flex", flexDirection: "column", gap: 14 }} onSubmit={handleSubmit}>
            <div className="contact-form-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <input type="text" name="name" placeholder={L(UI.fName)} required style={input} />
              <input type="email" name="email" placeholder={L(UI.fEmail)} required style={input} />
            </div>
            <input type="text" name="phone" placeholder={L(UI.fPhone)} style={input} />
            <input type="text" name="business" placeholder={L(UI.fBusiness)} style={input} />
            <textarea name="message" placeholder={L(UI.fMessage)} rows={5}
              style={{ ...input, resize: "vertical" }} />

            {sent && (
              <div style={{
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 12, padding: "14px 18px", color: "#4ade80", fontSize: 15, fontWeight: 600,
              }}>✓ {L(UI.fOk)}</div>
            )}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 12, padding: "14px 18px", color: "#f87171", fontSize: 15, fontWeight: 600,
              }}>{L(UI.fErr)}</div>
            )}

            <button type="submit" disabled={sending || sent} style={{
              background: sent ? "rgba(34,197,94,0.2)" : "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
              color: "#fff", padding: "18px", borderRadius: 12, border: "none",
              fontWeight: 800, fontSize: 17, fontFamily: "inherit",
              cursor: sending || sent ? "default" : "pointer",
              boxShadow: sent ? "none" : "0 0 50px rgba(29,78,216,0.45)",
              opacity: sending ? 0.7 : 1,
            }}>
              {sending ? L(UI.fSending) : sent ? `✓ ${L(UI.fSent)}` : `${L(UI.fSend)} →`}
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)", padding: "44px 48px",
        display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Logo size={34} id="lg2" />
          <div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>HUMANEX</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 2, textTransform: "uppercase" }}>
              {L(UI.basedIn)}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
          {navLinks.map((l) => (
            <a key={l.id} href={`#${l.id}`}
              style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{L(l.label)}</a>
          ))}
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", textAlign: "right" }}>
          © {new Date().getFullYear()} HUMANEX. {L(UI.rights)}
        </p>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        input:focus, textarea:focus { border-color: rgba(29,78,216,0.5) !important; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.3); }

        @media (max-width: 1000px) {
          .cc-shots { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 860px) {
          .nav-links { display: none !important; }
          .nav-cta { display: none !important; }
          nav { padding: 0 18px !important; }

          .hero-section { padding-top: 104px !important; padding-bottom: 48px !important; }
          .hero-stats { flex-direction: column !important; }
          .hero-stats > div { border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.07); }
          .hero-stats > div:last-child { border-bottom: none; }
          .hero-cta { flex-direction: column !important; align-items: stretch !important; width: 100%; max-width: 340px; margin-bottom: 40px !important; }
          .hero-cta a { justify-content: center !important; box-sizing: border-box; }
          .stat-item { padding: 16px !important; flex: 1 1 100% !important; }

          .services-header { flex-direction: column !important; align-items: flex-start !important; }
          .cc-head { flex-direction: column !important; align-items: flex-start !important; }

          .project-grid { grid-template-columns: 1fr !important; gap: 26px !important; }
          .project-card { padding: 30px 24px !important; }

          .steps-grid { grid-template-columns: 1fr !important; }
          .step-connector { display: none !important; }

          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-highlight { transform: none !important; }

          .cta-band { padding: 48px 26px !important; }
          .contact-form-row { grid-template-columns: 1fr !important; }

          footer { display: flex !important; flex-direction: column !important; align-items: center !important; text-align: center !important; padding: 32px 24px !important; gap: 18px !important; }
          footer p { text-align: center !important; }

          section { padding-left: 18px !important; padding-right: 18px !important; }
        }

        @media (max-width: 560px) {
          .cc-shots { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
