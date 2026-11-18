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
  tagline: { ro: "Reclame & Sisteme", en: "Ads & Systems" },
  navAds: { ro: "Reclame", en: "Ads" },
  navSystems: { ro: "Sisteme", en: "Systems" },
  navFaq: { ro: "Întrebări", en: "FAQ" },
  navContact: { ro: "Contact", en: "Contact" },
  navCta: { ro: "Începe acum", en: "Get started" },

  heroBadge: {
    ro: "Reclame plătite și sisteme la comandă · Brașov",
    en: "Paid ads and custom systems · Romania",
  },
  heroTitle1: { ro: "Îți aducem clienți.", en: "We bring you customers." },
  heroTitle2: { ro: "Și îți automatizăm munca.", en: "And automate the work." },
  heroSub: {
    ro: "Facem două lucruri: reclame plătite care îți aduc clienți și sisteme la comandă care fac singure munca de rutină. Alege ce te interesează:",
    en: "We do two things: paid ads that bring you customers, and custom systems that take routine work off your hands. Pick what you need:",
  },
  doorAdsKicker: { ro: "Reclame plătite", en: "Paid ads" },
  doorAdsTitle: { ro: "Vreau mai mulți clienți", en: "I want more customers" },
  doorAdsDesc: {
    ro: "Facebook, Instagram, TikTok și ChatGPT. Facem noi și clipurile.",
    en: "Facebook, Instagram, TikTok and ChatGPT. We make the videos too.",
  },
  doorSysKicker: { ro: "Sisteme la comandă", en: "Custom systems" },
  doorSysTitle: { ro: "Vreau să scap de munca manuală", en: "I want to stop doing it by hand" },
  doorSysDesc: {
    ro: "Software, rapoarte automate, panouri de control și site-uri.",
    en: "Software, automatic reports, dashboards and websites.",
  },

  /* ── Reclame ── */
  adsEyebrow: { ro: "01 · Reclame plătite", en: "01 · Paid ads" },
  adsTitle: { ro: "Reclame care îți aduc clienți", en: "Ads that bring you customers" },
  adsSub: {
    ro: "Ne ocupăm de tot: clipurile, reclamele, bugetul și raportul. Tu primești telefoane și mesaje de la clienți.",
    en: "We handle all of it: the videos, the ads, the budget and the report. You get the calls and messages from customers.",
  },
  adsServicesTitle: { ro: "Unde apar reclamele tale", en: "Where your ads run" },
  adsHowTitle: { ro: "Cum lucrăm", en: "How it works" },
  adsOfferTitle: { ro: "Ce primești", en: "What you get" },
  adsOfferName: { ro: "Reclame făcute și administrate de noi", en: "Ads made and run by us" },
  adsOfferPrice: {
    ro: "Prețul lunar îl stabilim împreună în primul apel, în funcție de platforme și de cât vrei să crești.",
    en: "We agree the monthly fee on the first call, depending on the platforms and how fast you want to grow.",
  },
  adsOfferNote: {
    ro: "Bugetul de reclame îl plătești separat, direct către Meta, TikTok sau OpenAI, din contul tău. Așa vezi exact cât se cheltuie, iar contul rămâne al tău.",
    en: "Ad spend is paid separately, straight to Meta, TikTok or OpenAI from your own account. You see exactly what is spent, and the account stays yours.",
  },
  adsResultsTitle: { ro: "Pentru cine am făcut reclame", en: "Who we have run ads for" },
  adsCtaTitle: {
    ro: "Vrei să vezi ce pot face reclamele pentru afacerea ta?",
    en: "Want to see what ads could do for your business?",
  },
  adsCtaSub: {
    ro: "Lasă-ne numărul și te sunăm noi. Primul apel e gratuit și fără obligații.",
    en: "Leave your number and we will call you. The first call is free, with no strings.",
  },
  adsCtaButton: { ro: "Vreau să fiu sunat", en: "Call me back" },

  /* ── Sisteme ── */
  sysEyebrow: { ro: "02 · Sisteme la comandă", en: "02 · Custom systems" },
  sysTitle: { ro: "Sisteme care lucrează cât timp tu dormi", en: "Systems that work while you sleep" },
  sysSub: {
    ro: "Construim software pentru afaceri mici și mijlocii: rapoarte care se trimit singure, panouri de control, site-uri și automatizări.",
    en: "We build software for small and mid-sized businesses: reports that send themselves, dashboards, websites and automation.",
  },
  ccEyebrow: { ro: "Ultimul proiect", en: "Latest project" },
  ccWatch: { ro: "Vezi prezentarea completă", en: "Watch the full walkthrough" },
  ccDuration: { ro: "4 min", en: "4 min" },
  ccNoVideo: {
    ro: "Browserul tău nu poate reda acest video.",
    en: "Your browser cannot play this video.",
  },
  projectsTitle: { ro: "Alte sisteme construite de noi", en: "Other systems we have built" },
  projectsSub: {
    ro: "Fiecare sistem de mai jos rulează acum, pentru o afacere reală.",
    en: "Every system below is running right now, for a real business.",
  },
  liveLabel: { ro: "Live", en: "Live" },
  buildingLabel: { ro: "În dezvoltare", en: "In development" },
  sysServicesTitle: { ro: "Ce putem construi", en: "What we can build" },
  sysHowTitle: { ro: "Cum lucrăm", en: "How it works" },
  pricingTitle: { ro: "Prețuri pentru sisteme", en: "Pricing for systems" },
  pricingSub: {
    ro: "Sistemele se plătesc o singură dată, la livrare. Mentenanța lunară e opțională.",
    en: "Systems are paid once, on delivery. Monthly support is optional.",
  },
  pricingOneTime: { ro: "Plată unică", en: "One-time" },
  pricingMonthly: { ro: "Mentenanță lunară (opțional)", en: "Monthly support (optional)" },
  perMonth: { ro: "lună", en: "month" },
  perProject: { ro: "proiect", en: "project" },
  planCta: { ro: "Începe acum", en: "Get started" },
  popular: { ro: "Cel mai ales", en: "Most chosen" },
  ctaTitle: {
    ro: "Ai un proces care îți mănâncă ziua?",
    en: "Got a process eating your day?",
  },
  ctaSub: {
    ro: "Discuție gratuită, fără obligații. Îți spunem direct dacă se poate automatiza și cât ar dura.",
    en: "Free call, no strings. We will tell you straight whether it can be automated and how long it would take.",
  },
  ctaButton: { ro: "Programează o discuție", en: "Book a call" },

  faqEyebrow: { ro: "Întrebări", en: "Questions" },
  faqTitle: { ro: "Întrebări frecvente", en: "Frequently asked" },

  contactEyebrow: { ro: "Contact", en: "Contact" },
  contactTitle: { ro: "Hai să vorbim", en: "Let us talk" },
  contactSub: {
    ro: "Spune-ne ce te interesează și câteva cuvinte despre afacerea ta. Îți răspundem în maxim 24 de ore.",
    en: "Tell us what you are interested in and a little about your business. We reply within 24 hours.",
  },
  fTopic: { ro: "Despre ce vrei să vorbim?", en: "What would you like to talk about?" },
  tAds: { ro: "Reclame plătite", en: "Paid ads" },
  tSys: { ro: "Un sistem sau un site", en: "A system or a website" },
  tBoth: { ro: "Amândouă", en: "Both" },
  fName: { ro: "Numele tău", en: "Your name" },
  fEmail: { ro: "Email", en: "Email" },
  fPhone: { ro: "Telefon / WhatsApp", en: "Phone / WhatsApp" },
  fBusiness: {
    ro: "Tipul afacerii (ex: restaurant, construcții, salon)",
    en: "Type of business (e.g. restaurant, construction, salon)",
  },
  fMessage: {
    ro: "Spune-ne pe scurt ce vinzi sau ce ai vrea să automatizezi…",
    en: "Tell us briefly what you sell, or what you would like to automate…",
  },
  fSend: { ro: "Trimite mesajul", en: "Send message" },
  fSending: { ro: "Se trimite…", en: "Sending…" },
  fSent: { ro: "Trimis!", en: "Sent!" },
  fOk: {
    ro: "Mesaj trimis. Te contactăm în maxim 24 de ore.",
    en: "Message sent. We will be in touch within 24 hours.",
  },
  fErr: {
    ro: "Eroare la trimitere. Încearcă din nou sau scrie-ne direct la humanex23@gmail.com.",
    en: "Something went wrong. Try again, or email us at humanex23@gmail.com.",
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
    live: true,
    accent: "#a78bfa",
  },
  {
    name: { ro: "da Vinci", en: "da Vinci" },
    kind: { ro: "Reclame + Site", en: "Ads + Website" },
    client: { ro: "Restaurant & boutique hotel · Brașov", en: "Restaurant & boutique hotel · Brașov" },
    desc: {
      ro: "Site complet pentru un restaurant din Centrul Vechi al Brașovului, cu meniul real de 278 de preparate și rezervări trimise direct pe WhatsApp. Plus reclame plătite pe Meta și TikTok, cu clipurile făcute de noi.",
      en: "A complete website for a restaurant in Brașov's old town, with the real 278-dish menu and reservations sent straight to WhatsApp. Plus paid Meta and TikTok ads, with the videos made by us.",
    },
    points: [
      { ro: "Meniu complet, care se salvează ca PDF", en: "Full menu, saveable as a PDF" },
      { ro: "Rezervări de masă și de cameră, pe WhatsApp", en: "Table and room bookings, over WhatsApp" },
      { ro: "Campanii Meta și TikTok, țintite pe turiști și localnici", en: "Meta and TikTok campaigns, targeting tourists and locals" },
      { ro: "Fără abonament lunar de găzduire", en: "No monthly hosting subscription" },
    ],
    live: true,
    accent: "#f0b429",
  },
  {
    name: { ro: "SpecialDelivery", en: "SpecialDelivery" },
    kind: { ro: "Reclame + Site", en: "Ads + Website" },
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

/* Proiectele de reclame apar în zona Reclame, sistemele în zona Sisteme. */
const SYS_PROJECTS = PROJECTS.slice(1, 3);
const ADS_PROJECTS = PROJECTS.slice(3);

/* Capturi din prezentarea CloseCheck */
const CC_SHOTS: { src: string; cap: TX }[] = [
  { src: "/cc-mobil.jpg", cap: { ro: "Închiderea turei, de pe telefon", en: "Shift close, from the phone" } },
  { src: "/cc-panou.jpg", cap: { ro: "Panoul contabilului", en: "The accountant's dashboard" } },
  { src: "/cc-rezultate.jpg", cap: { ro: "Rezultatul pentru client", en: "Results per client" } },
  { src: "/cc-termene.jpg", cap: { ro: "Termene și declarații", en: "Deadlines and filings" } },
];

/* ── Servicii ───────────────────────────────────────────────── */

type Service = { icon: string; title: TX; desc: TX; tags: TX[] };

/* Reclame plătite. Doar reclame — postările zilnice și administrarea
   paginilor (promovarea organică) nu le mai oferim. */
const ADS_SERVICES: Service[] = [
  {
    icon: "🎯",
    title: { ro: "Facebook și Instagram", en: "Facebook and Instagram" },
    desc: {
      ro: "Reclame care ajung la oamenii din zona ta care chiar pot cumpăra. Buget controlat, cereri pe telefon, formular sau WhatsApp.",
      en: "Ads that reach the people near you who can actually buy. A controlled budget, with enquiries by phone, form or WhatsApp.",
    },
    tags: [
      { ro: "Meta Ads", en: "Meta Ads" },
      { ro: "WhatsApp", en: "WhatsApp" },
      { ro: "Local", en: "Local" },
    ],
  },
  {
    icon: "🎬",
    title: { ro: "TikTok", en: "TikTok" },
    desc: {
      ro: "Clipuri scurte care opresc degetul din scroll, testate și îmbunătățite în fiecare săptămână.",
      en: "Short videos that stop the scroll, tested and improved every week.",
    },
    tags: [
      { ro: "TikTok Ads", en: "TikTok Ads" },
      { ro: "Video", en: "Video" },
      { ro: "Testare", en: "Testing" },
    ],
  },
  {
    icon: "🤖",
    title: { ro: "ChatGPT", en: "ChatGPT" },
    desc: {
      ro: "Reclamele din ChatGPT au pornit în Europa. Apari când cineva îi cere o recomandare pentru ce vinzi tu.",
      en: "ChatGPT ads have launched in Europe. You show up when someone asks it for a recommendation for what you sell.",
    },
    tags: [
      { ro: "ChatGPT Ads", en: "ChatGPT Ads" },
      { ro: "Nou", en: "New" },
    ],
  },
  {
    icon: "📸",
    title: { ro: "Clipurile pentru reclame", en: "The ad videos" },
    desc: {
      ro: "Facem noi clipurile și pozele pentru reclame, inclusiv o mascotă AI pentru brandul tău. Tu nu filmezi și nu scrii nimic.",
      en: "We make the videos and images for your ads, including an AI mascot for your brand. You do not film or write anything.",
    },
    tags: [
      { ro: "Video", en: "Video" },
      { ro: "Mascote AI", en: "AI mascots" },
      { ro: "Foto", en: "Photo" },
    ],
  },
];

const SYS_SERVICES: Service[] = [
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

type Step = { number: string; title: TX; desc: TX; detail: TX };

const ADS_STEPS: Step[] = [
  {
    number: "01",
    title: { ro: "Primul apel", en: "First call" },
    desc: {
      ro: "Aflăm ce vinzi, cui și cât ai vrea să investești. Îți spunem sincer dacă reclamele au sens pentru tine.",
      en: "We find out what you sell, to whom, and what you would like to spend. We tell you honestly whether ads make sense for you.",
    },
    detail: { ro: "Gratuit, fără obligații", en: "Free, no obligation" },
  },
  {
    number: "02",
    title: { ro: "Facem clipurile și pornim reclamele", en: "We make the videos and launch" },
    desc: {
      ro: "Pregătim clipurile, textele și setările. Tu doar te uiți și aprobi.",
      en: "We prepare the videos, the copy and the setup. You just look and approve.",
    },
    detail: { ro: "Tu doar aprobi", en: "You just approve" },
  },
  {
    number: "03",
    title: { ro: "Urmărim și îmbunătățim", en: "We track and improve" },
    desc: {
      ro: "În fiecare săptămână oprim ce nu merge și punem banii pe ce aduce clienți. Primești un raport simplu: câți au văzut, câți au sunat, câți au cumpărat.",
      en: "Every week we stop what is not working and put the money behind what brings customers. You get a simple report: how many saw, called and bought.",
    },
    detail: { ro: "Raport lunar clar", en: "A clear monthly report" },
  },
];

const ADS_OFFER: TX[] = [
  { ro: "Strategia: cui arătăm reclamele și cu ce mesaj", en: "The strategy: who sees the ads, and with what message" },
  { ro: "Clipurile și pozele pentru reclame, făcute de noi", en: "The ad videos and images, made by us" },
  { ro: "Reclame pe Facebook, Instagram, TikTok și ChatGPT", en: "Ads on Facebook, Instagram, TikTok and ChatGPT" },
  { ro: "Testare și îmbunătățiri în fiecare săptămână", en: "Testing and improvements every week" },
  { ro: "Raport lunar pe înțelesul tău", en: "A monthly report in plain words" },
  { ro: "Fără contract pe termen lung", en: "No long-term contract" },
];

const SYS_STEPS: Step[] = [
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
      ro: "Nu. Prețul acoperă strategia, clipurile, administrarea și optimizarea. Bugetul de reclame îl plătești separat, direct către Meta, TikTok sau OpenAI, din contul tău — așa vezi exact cât se cheltuie și rămâi proprietarul contului.",
      en: "No. The price covers strategy, the videos, management and optimisation. Ad spend is paid separately, straight to Meta, TikTok or OpenAI from your own account — so you see exactly what is spent and you stay the owner of the account.",
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
/* Mesajele din formular ajung aici (și e trimis șablonului ca to_email). */
const CONTACT_EMAIL = "humanex23@gmail.com";

type Topic = "" | "ads" | "sys" | "both";

const META: Record<Lang, { title: string; desc: string }> = {
  ro: {
    title: "HUMANEX — Reclame plătite și sisteme la comandă | Brașov",
    desc: "Reclame plătite pe Facebook, Instagram, TikTok și ChatGPT, cu clipurile făcute de noi, plus software la comandă pentru afaceri mici și mijlocii. Din Brașov.",
  },
  en: {
    title: "HUMANEX — Paid ads and custom systems for small business",
    desc: "Paid ads on Facebook, Instagram, TikTok and ChatGPT, with the videos made in-house, plus custom software for small and mid-sized businesses. Based in Romania.",
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
  const [topic, setTopic] = useState<Topic>("");

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
    const fd = new FormData(formRef.current);
    const g = (k: string) => String(fd.get(k) ?? "").trim();
    const interes =
      topic === "ads" ? UI.tAds.ro : topic === "sys" ? UI.tSys.ro : topic === "both" ? UI.tBoth.ro : "nu a ales";
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          name: g("name"),
          email: g("email"),
          phone: g("phone"),
          business: g("business"),
          topic: interes,
          message: `Interesat de: ${interes}\n\n${g("message")}`,
          to_email: CONTACT_EMAIL,
        },
        { publicKey: EMAILJS_KEY },
      );
      setSent(true);
      setTopic("");
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
    { label: UI.navAds, id: "reclame" },
    { label: UI.navSystems, id: "sisteme" },
    { label: UI.navFaq, id: "intrebari" },
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

      <a href="#contact" onClick={() => setTopic("sys")} style={{
        display: "block", textAlign: "center", padding: "12px 18px", borderRadius: 10,
        fontSize: 13.5, fontWeight: 700, textDecoration: "none", marginTop: "auto",
        color: plan.highlight ? "#1e3a8a" : "#93c5fd",
        background: plan.highlight ? "#fff" : "rgba(29,78,216,0.14)",
        border: plan.highlight ? "1px solid #fff" : "1px solid rgba(29,78,216,0.3)",
      }}>{L(UI.planCta)} →</a>
    </div>
  );

  /* Cele două zone ale site-ului au fiecare culoarea ei, ca să știi
     mereu în care ești: turcoaz pentru reclame, mov pentru sisteme. */
  const ACC_ADS = "#22d3ee";
  const ACC_SYS = "#a78bfa";

  const catHead = (eb: TX, title: TX, sub: TX, accent: string) => (
    <div style={{ marginBottom: 48, maxWidth: 780 }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 20,
        padding: "7px 16px", borderRadius: 999,
        border: `1px solid ${accent}59`, background: `${accent}14`,
      }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, boxShadow: `0 0 10px ${accent}` }} />
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", color: accent }}>
          {L(eb)}
        </span>
      </div>
      <h2 style={{ ...h2, fontSize: "clamp(34px, 5vw, 58px)", marginBottom: 16 }}>{L(title)}</h2>
      <p style={{ fontSize: "clamp(16px, 1.9vw, 18px)", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{L(sub)}</p>
    </div>
  );

  const subHead = (x: TX, sub?: TX) => (
    <div style={{ margin: "76px 0 26px" }}>
      <h3 style={{ fontSize: "clamp(22px, 2.6vw, 30px)", fontWeight: 900, letterSpacing: "-0.6px", lineHeight: 1.2 }}>
        {L(x)}
      </h3>
      {sub && (
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.45)", marginTop: 10, lineHeight: 1.7, maxWidth: 620 }}>{L(sub)}</p>
      )}
    </div>
  );

  const servicesGrid = (list: Service[], accent: string, min = 260) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 20 }}>
      {list.map((s) => (
        <div key={s.title.en} style={{ ...card, padding: "30px 26px", transition: "border-color .3s, transform .3s, background .3s" }}
          onMouseEnter={(e) => {
            const el = e.currentTarget;
            el.style.borderColor = `${accent}80`;
            el.style.background = `${accent}0f`;
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
            background: `${accent}1f`, border: `1px solid ${accent}4d`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 23, marginBottom: 18,
          }}>{s.icon}</div>
          <h4 style={{ fontSize: 18, fontWeight: 800, marginBottom: 11, letterSpacing: "-0.3px" }}>{L(s.title)}</h4>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, marginBottom: 18 }}>{L(s.desc)}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {s.tags.map((tag) => (
              <span key={tag.en} style={{
                fontSize: 11, fontWeight: 700, color: accent,
                background: `${accent}14`, border: `1px solid ${accent}40`,
                borderRadius: 6, padding: "3px 10px", letterSpacing: 0.5,
              }}>{L(tag)}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const stepsGrid = (list: Step[], accent: string) => (
    <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
      {list.map((step, i) => (
        <div key={step.number} style={{ position: "relative" }}>
          {i < list.length - 1 && (
            <div className="step-connector" style={{
              position: "absolute", top: 32, left: "calc(100% - 12px)", right: "-12px",
              height: 1, background: `linear-gradient(90deg, ${accent}80, ${accent}1a)`,
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
              color: accent, background: `${accent}1a`,
              border: `1px solid ${accent}33`, borderRadius: 6,
              padding: "3px 10px", marginBottom: 14, letterSpacing: 0.5,
            }}>{L(step.detail)}</div>
            <h4 style={{ fontSize: 20, fontWeight: 800, marginBottom: 11, letterSpacing: "-0.3px" }}>{L(step.title)}</h4>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.75 }}>{L(step.desc)}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const projectCards = (list: Project[]) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {list.map((p) => (
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

              <h4 style={{
                fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 900,
                letterSpacing: "-0.8px", lineHeight: 1.15, marginBottom: 8,
                overflowWrap: "anywhere",
              }}>{L(p.name)}</h4>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.4)", marginBottom: 22 }}>{L(p.client)}</p>
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
  );

  const ctaBand = (title: TX, sub: TX, href: string, button: TX, onClick?: () => void) => (
    <div className="cta-band" style={{
      marginTop: 80,
      background: "linear-gradient(135deg, #1d4ed8 0%, #0f172a 60%, #1e40af 100%)",
      border: "1px solid rgba(96,165,250,0.2)", borderRadius: 24,
      padding: "64px 56px", textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <h3 style={{ ...h2, fontSize: "clamp(26px, 3.6vw, 42px)", marginBottom: 16, position: "relative" }}>
        {L(title)}
      </h3>
      <p style={{
        fontSize: 17, color: "rgba(255,255,255,0.7)", maxWidth: 540,
        margin: "0 auto 34px", lineHeight: 1.7, position: "relative",
      }}>{L(sub)}</p>
      <a href={href} onClick={onClick} style={{
        background: "#fff", color: "#1d4ed8", padding: "16px 40px", borderRadius: 12,
        fontWeight: 900, fontSize: 17, textDecoration: "none",
        display: "inline-block", position: "relative",
      }}>{L(button)} →</a>
    </div>
  );

  const chip = (activ: boolean): React.CSSProperties => ({
    background: activ ? "rgba(29,78,216,0.3)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${activ ? "#3b82f6" : "rgba(255,255,255,0.12)"}`,
    boxShadow: activ ? "0 0 0 1px #3b82f6 inset" : "none",
    color: activ ? "#fff" : "rgba(255,255,255,0.8)", borderRadius: 999, padding: "11px 18px",
    fontSize: 14.5, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
  });

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
          borderRadius: 999, padding: "7px 18px", position: "relative",
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
          fontSize: "clamp(38px, 6.2vw, 78px)", fontWeight: 900, position: "relative",
          lineHeight: 1.05, letterSpacing: "-2.5px", maxWidth: 900, marginBottom: 28,
        }}>
          {L(UI.heroTitle1)}{" "}
          <span style={{
            background: "linear-gradient(135deg, #60a5fa 0%, #0ea5e9 50%, #38bdf8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>{L(UI.heroTitle2)}</span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 19px)", color: "rgba(255,255,255,0.55)", position: "relative",
          maxWidth: 640, lineHeight: 1.75, marginBottom: 36,
        }}>{L(UI.heroSub)}</p>

        {/* Cele două uși: fiecare duce la zona ei, cu tot ce ține de ea */}
        <div className="doors" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
          maxWidth: 880, width: "100%", position: "relative",
        }}>
          {[
            { href: "#reclame", kicker: UI.doorAdsKicker, title: UI.doorAdsTitle, desc: UI.doorAdsDesc, accent: ACC_ADS, num: "01" },
            { href: "#sisteme", kicker: UI.doorSysKicker, title: UI.doorSysTitle, desc: UI.doorSysDesc, accent: ACC_SYS, num: "02" },
          ].map((d) => (
            <a key={d.href} href={d.href} style={{
              ...card, textAlign: "left", padding: "28px 26px", textDecoration: "none", color: "#fff",
              display: "flex", flexDirection: "column", gap: 10,
              border: `1px solid ${d.accent}4d`,
              background: `linear-gradient(160deg, ${d.accent}1a 0%, rgba(255,255,255,0.02) 70%)`,
              transition: "transform .25s, border-color .25s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = d.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = `${d.accent}4d`; }}
            >
              <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 2.5, textTransform: "uppercase", color: d.accent }}>
                {d.num} · {L(d.kicker)}
              </span>
              <span style={{ fontSize: "clamp(21px, 2.4vw, 25px)", fontWeight: 900, letterSpacing: "-0.6px", lineHeight: 1.2 }}>
                {L(d.title)}
              </span>
              <span style={{ fontSize: 14.5, color: "rgba(255,255,255,0.62)", lineHeight: 1.6 }}>{L(d.desc)}</span>
              <span style={{ marginTop: 6, fontWeight: 800, color: d.accent, fontSize: 15 }}>
                {lang === "ro" ? "Vezi detalii" : "See more"} →
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* ══════════════ 01 · RECLAME PLĂTITE ══════════════ */}
      <section id="reclame" style={{ padding: "110px 24px", borderTop: `1px solid ${ACC_ADS}26` }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          {catHead(UI.adsEyebrow, UI.adsTitle, UI.adsSub, ACC_ADS)}

          {servicesGrid(ADS_SERVICES, ACC_ADS)}

          {subHead(UI.adsHowTitle)}
          {stepsGrid(ADS_STEPS, ACC_ADS)}

          {subHead(UI.adsOfferTitle)}
          <div className="offer-grid" style={{
            ...card, padding: "40px 38px", display: "grid", gridTemplateColumns: "1fr 1.1fr", gap: 40,
            border: `1px solid ${ACC_ADS}4d`,
            background: `linear-gradient(160deg, ${ACC_ADS}14 0%, rgba(255,255,255,0.02) 70%)`,
          }}>
            <div>
              <h4 style={{ fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 900, letterSpacing: "-0.6px", lineHeight: 1.2, marginBottom: 14 }}>
                {L(UI.adsOfferName)}
              </h4>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.78)", lineHeight: 1.7, marginBottom: 16 }}>{L(UI.adsOfferPrice)}</p>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: 26 }}>{L(UI.adsOfferNote)}</p>
              <a href="/formular" style={{
                display: "inline-block", background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)",
                color: "#fff", padding: "15px 30px", borderRadius: 12, fontWeight: 800, fontSize: 16,
                textDecoration: "none", boxShadow: "0 0 40px rgba(29,78,216,0.4)",
              }}>{L(UI.adsCtaButton)} →</a>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14, justifyContent: "center" }}>
              {ADS_OFFER.map((f) => (
                <div key={f.en} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: 7, flexShrink: 0, display: "grid", placeItems: "center",
                    background: `${ACC_ADS}26`, color: ACC_ADS, fontSize: 13, fontWeight: 900,
                  }}>✓</span>
                  <span style={{ fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>{L(f)}</span>
                </div>
              ))}
            </div>
          </div>

          {subHead(UI.adsResultsTitle)}
          {projectCards(ADS_PROJECTS)}

          {ctaBand(UI.adsCtaTitle, UI.adsCtaSub, "/formular", UI.adsCtaButton)}
        </div>
      </section>

      {/* ══════════════ 02 · SISTEME LA COMANDĂ ══════════════ */}
      <section id="sisteme" style={{
        padding: "110px 24px", background: "rgba(255,255,255,0.015)",
        borderTop: `1px solid ${ACC_SYS}26`,
      }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          {catHead(UI.sysEyebrow, UI.sysTitle, UI.sysSub, ACC_SYS)}

          <div className="hero-stats" style={{
            display: "flex", flexWrap: "wrap",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, overflow: "hidden", marginBottom: 72,
          }}>
            {STATS.map((s, i) => (
              <div key={s.label.en} className="stat-item" style={{
                flex: "1 1 180px", padding: "24px 20px", textAlign: "center",
                borderRight: i < STATS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: ACC_SYS, marginBottom: 4 }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{L(s.label)}</div>
              </div>
            ))}
          </div>

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

          {/* Principiul care îl deosebește — merită spațiul lui.
              Tratat ca un citat, nu ca un card: o linie de un pixel și
              spațiu. Caseta colorată îl făcea să arate ca o alertă. */}
          <blockquote style={{
            margin: "34px 0 40px", padding: "4px 0 4px 26px",
            borderLeft: "1px solid rgba(96,165,250,0.45)", maxWidth: 760,
          }}>
            <p style={{
              fontSize: "clamp(17px, 2.1vw, 21px)", lineHeight: 1.6,
              color: "rgba(255,255,255,0.82)", fontWeight: 300,
            }}>
              {lang === "ro"
                ? "Un sistem care numește pe cineva după două zile e mai periculos decât unul care nu numește pe nimeni. Sub pragul lui de dovezi, CloseCheck tace — și spune de ce tace."
                : "A system that names someone after two days is more dangerous than one that names nobody. Below its evidence threshold, CloseCheck stays quiet — and tells you why."}
            </p>
          </blockquote>

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

          {subHead(UI.projectsTitle, UI.projectsSub)}
          {projectCards(SYS_PROJECTS)}

          {subHead(UI.sysServicesTitle)}
          {servicesGrid(SYS_SERVICES, ACC_SYS, 320)}

          {subHead(UI.sysHowTitle)}
          {stepsGrid(SYS_STEPS, ACC_SYS)}

          <div id="preturi">{subHead(UI.pricingTitle, UI.pricingSub)}</div>
          <div style={{ marginBottom: 44 }}>
            <h4 className="price-group" style={{
              fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)",
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 22,
            }}>{L(UI.pricingOneTime)}</h4>
            <div className="pricing-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16,
            }}>
              {PLANS.map(planCard)}
            </div>
          </div>

          <div>
            <h4 className="price-group" style={{
              fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)",
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 22,
            }}>{L(UI.pricingMonthly)}</h4>
            <div className="pricing-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16, maxWidth: 760,
            }}>
              {SUPPORT_PLANS.map(planCard)}
            </div>
          </div>

          {ctaBand(UI.ctaTitle, UI.ctaSub, "#contact", UI.ctaButton, () => setTopic("sys"))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="intrebari" style={{ padding: "110px 24px" }}>
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

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "0 24px 110px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={eyebrow}>{L(UI.contactEyebrow)}</p>
            <h2 style={{ ...h2, marginBottom: 16 }}>{L(UI.contactTitle)}</h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{L(UI.contactSub)}</p>
          </div>

          <form ref={formRef} style={{ display: "flex", flexDirection: "column", gap: 14 }} onSubmit={handleSubmit}>
            <fieldset style={{ border: "none", padding: 0, margin: "0 0 4px" }}>
              <legend style={{ fontSize: 15, fontWeight: 700, marginBottom: 10, padding: 0 }}>{L(UI.fTopic)}</legend>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {([["ads", UI.tAds], ["sys", UI.tSys], ["both", UI.tBoth]] as [Topic, TX][]).map(([k, lbl]) => (
                  <button key={k} type="button" aria-pressed={topic === k}
                    onClick={() => setTopic(topic === k ? "" : k)} style={chip(topic === k)}>
                    {topic === k && <span aria-hidden="true" style={{ marginRight: 6 }}>✓</span>}
                    {L(lbl)}
                  </button>
                ))}
              </div>
            </fieldset>
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
            <p style={{ textAlign: "center", fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
              {lang === "ro" ? "Sau scrie-ne direct la " : "Or email us directly at "}
              <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "#60a5fa", fontWeight: 700, textDecoration: "none" }}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </form>
        </div>
      </section>

      {/* Pe telefon meniul de sus dispare, așa că după primul ecran
          apare jos o bară cu cele două zone și contactul. */}
      <nav className="mobile-tabs" aria-label={lang === "ro" ? "Secțiuni" : "Sections"} style={{
        position: "fixed", left: "50%", bottom: 14, transform: `translateX(-50%) translateY(${scrolled ? 0 : 90}px)`,
        transition: "transform .35s ease", zIndex: 90, display: "none", gap: 4, padding: 5,
        background: "rgba(8,20,44,0.92)", backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999,
        boxShadow: "0 14px 40px rgba(0,0,0,0.5)",
      }}>
        {[
          { id: "reclame", label: UI.navAds, accent: ACC_ADS },
          { id: "sisteme", label: UI.navSystems, accent: ACC_SYS },
          { id: "contact", label: UI.navContact, accent: "#60a5fa" },
        ].map((t) => (
          <a key={t.id} href={`#${t.id}`} style={{
            display: "flex", alignItems: "center", gap: 7, padding: "10px 15px", borderRadius: 999,
            color: "#fff", textDecoration: "none", fontSize: 14, fontWeight: 700, whiteSpace: "nowrap",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.accent }} />
            {L(t.label)}
          </a>
        ))}
      </nav>

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
        section[id] { scroll-margin-top: 64px; }
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
          .doors { grid-template-columns: 1fr !important; }
          .mobile-tabs { display: flex !important; }
          footer { padding-bottom: 96px !important; }
          .offer-grid { grid-template-columns: 1fr !important; padding: 30px 22px !important; gap: 28px !important; }
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
