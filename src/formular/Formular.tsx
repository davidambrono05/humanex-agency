import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";

/* Pagina humanex.space/formular — aici ajung oamenii care apasă pe
   reclamele HUMANEX. Cererea pleacă pe email prin același cont EmailJS
   ca formularul de contact de pe prima pagină, cu aceleași câmpuri
   (name, email, phone, business, message), deci șablonul existent o
   afișează fără nicio modificare. */

const EMAILJS_SERVICE = "service_vgg5fdg";
const EMAILJS_TEMPLATE = "template_asjlv4r";
const EMAILJS_KEY = "km3Un_Nuwq0eqaiPP";

/* Formularul nu cere email (doar telefonul), dar șablonul are un câmp de
   email. Îl completăm cu adresa HUMANEX, ca emailul să plece oricum. */
const EMAIL_HUMANEX = "humanex23@gmail.com";

/* Pixelii pentru reclame. Lasă-le goale până ai ID-urile:
   - Meta: Events Manager → Surse de date → ID-ul pixelului (doar cifre)
   - TikTok: Ads Manager → Instrumente → Evenimente → ID-ul pixelului
   Cât timp sunt goale, pagina nu încarcă nimic de la Meta sau TikTok și
   nu afișează bara de cookie-uri. */
const META_PIXEL_ID = "";
const TIKTOK_PIXEL_ID = "";
const ARE_PIXELI = Boolean(META_PIXEL_ID || TIKTOK_PIXEL_ID);
const CHEIE_COOKIES = "humanex-cookies";

const PLATFORME = ["Facebook și Instagram", "TikTok", "ChatGPT", "Nu știu încă"];
const NU_STIU = "Nu știu încă";
const BUGETE = ["Sub 1.000 lei", "1.000 – 3.000 lei", "Peste 3.000 lei", "Nu știu încă"];

type Fereastra = Window & {
  fbq?: (...a: unknown[]) => void;
  ttq?: { track: (...a: unknown[]) => void };
};

function pornestePixeli() {
  if (!ARE_PIXELI || document.getElementById("hx-pixeli")) return;
  let cod = "";
  if (META_PIXEL_ID) {
    cod += `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`;
  }
  if (TIKTOK_PIXEL_ID) {
    cod += `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=d.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=d.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${TIKTOK_PIXEL_ID}');ttq.page();}(window,document,'ttq');`;
  }
  const s = document.createElement("script");
  s.id = "hx-pixeli";
  s.text = cod;
  document.head.appendChild(s);
}

/* Le spunem reclamelor că a venit o cerere — doar dacă omul a acceptat
   cookie-urile și pixelii sunt porniți. */
function anuntaCererea() {
  const w = window as Fereastra;
  w.fbq?.("track", "Lead");
  w.ttq?.track("SubmitForm");
}

function citesteCookies(): string | null {
  try {
    return localStorage.getItem(CHEIE_COOKIES);
  } catch {
    return null;
  }
}

/* De unde a venit omul: parametrii utm din linkul reclamei. Îi scriem în
   email ca să știi care reclamă a adus cererea. */
function sursa(): string {
  const p = new URLSearchParams(window.location.search);
  const parti = ["utm_source", "utm_medium", "utm_campaign", "utm_content"]
    .map((k) => (p.get(k) ? `${k.replace("utm_", "")}: ${p.get(k)}` : ""))
    .filter(Boolean);
  if (p.get("fbclid")) parti.push("click din Facebook/Instagram");
  if (p.get("ttclid")) parti.push("click din TikTok");
  return parti.length ? parti.join(" · ") : "direct (fără date de reclamă)";
}

const cifre = (s: string) => s.replace(/\D/g, "");

export default function Formular() {
  const [nume, setNume] = useState("");
  const [telefon, setTelefon] = useState("");
  const [afacere, setAfacere] = useState("");
  const [platforme, setPlatforme] = useState<string[]>([]);
  const [buget, setBuget] = useState("");
  const [acord, setAcord] = useState(false);
  const [capcana, setCapcana] = useState("");

  const [trimis, setTrimis] = useState(false);
  const [seTrimite, setSeTrimite] = useState(false);
  const [eroare, setEroare] = useState("");
  const [incercat, setIncercat] = useState(false);
  const [cookies, setCookies] = useState<string | null>(citesteCookies);

  useEffect(() => {
    if (cookies === "da") pornestePixeli();
  }, [cookies]);

  const alegeCookies = (v: "da" | "nu") => {
    try {
      localStorage.setItem(CHEIE_COOKIES, v);
    } catch {
      /* fără localStorage, alegerea ține doar cât e pagina deschisă */
    }
    setCookies(v);
  };

  const comutaPlatforma = (p: string) => {
    setPlatforme((curent) => {
      if (curent.includes(p)) return curent.filter((x) => x !== p);
      if (p === NU_STIU) return [NU_STIU];
      return [...curent.filter((x) => x !== NU_STIU), p];
    });
  };

  const telOk = cifre(telefon).length >= 9 && cifre(telefon).length <= 13;
  const greseli = {
    nume: !nume.trim(),
    telefon: !telOk,
    afacere: !afacere.trim(),
    acord: !acord,
  };
  const valid = !Object.values(greseli).some(Boolean);

  const trimite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIncercat(true);
    setEroare("");
    if (!valid) return;
    /* Câmpul ascuns e completat doar de roboți — ne prefacem că a mers. */
    if (capcana) {
      setTrimis(true);
      return;
    }
    setSeTrimite(true);
    const data = new Date().toLocaleString("ro-RO", { timeZone: "Europe/Bucharest" });
    const mesaj = [
      "CERERE NOUĂ DIN RECLAMĂ (humanex.space/formular)",
      "",
      `Nume: ${nume.trim()}`,
      `Telefon: ${telefon.trim()}`,
      `Afacere: ${afacere.trim()}`,
      `Unde vrea reclame: ${platforme.length ? platforme.join(", ") : "nu a ales"}`,
      `Buget lunar pentru reclame: ${buget || "nu a ales"}`,
      "",
      `De unde a venit: ${sursa()}`,
      `Trimis la: ${data}`,
      "A fost de acord să fie contactat telefonic sau pe WhatsApp.",
    ].join("\n");
    try {
      await emailjs.send(
        EMAILJS_SERVICE,
        EMAILJS_TEMPLATE,
        {
          name: nume.trim(),
          email: EMAIL_HUMANEX,
          phone: telefon.trim(),
          business: afacere.trim(),
          message: mesaj,
        },
        { publicKey: EMAILJS_KEY },
      );
      anuntaCererea();
      setTrimis(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setEroare("Nu s-a putut trimite. Verifică internetul și mai încearcă o dată.");
    } finally {
      setSeTrimite(false);
    }
  };

  const arata = (k: keyof typeof greseli) => incercat && greseli[k];

  return (
    <div style={S.pagina}>
      <div style={S.grila} aria-hidden="true" />
      <div style={S.lumina} aria-hidden="true" />

      <main style={S.continut}>
        <a href="https://humanex.space" style={S.brand} aria-label="HUMANEX, pagina principală">
          <Logo />
          <span>
            <span style={S.brandNume}>HUMANEX</span>
            <span style={S.brandSub}>Reclame plătite</span>
          </span>
        </a>

        {trimis ? (
          <section style={{ ...S.card, textAlign: "center", padding: "44px 26px" }} aria-live="polite">
            <div style={S.bifa} aria-hidden="true">✓</div>
            <h1 style={{ ...S.titlu, fontSize: 32 }}>Gata, am primit!</h1>
            <p style={S.sub}>
              Te sunăm noi în cel mult o zi lucrătoare, de pe un număr de mobil.
              Ține telefonul aproape.
            </p>
            <p style={{ ...S.sub, marginTop: 14 }}>
              În primul apel aflăm ce vinzi și cui, și îți spunem sincer dacă reclamele
              au sens pentru afacerea ta. Nu plătești nimic pentru apel.
            </p>
            <a href="https://humanex.space" style={S.legaturaInapoi}>Vezi site-ul HUMANEX →</a>
          </section>
        ) : (
          <>
            <p style={S.eticheta}>Meta · TikTok · ChatGPT</p>
            <h1 style={S.titlu}>
              Hai să-ți aducem <span style={S.albastru}>clienți din reclame.</span>
            </h1>
            <p style={S.sub}>
              Completezi în 30 de secunde și te sunăm noi. Primul apel e gratuit și fără
              obligații.
            </p>

            <form onSubmit={trimite} noValidate style={{ ...S.card, marginTop: 28 }}>
              <Camp eticheta="Cum te numești?" eroare={arata("nume") ? "Scrie-ți numele." : ""}>
                <input
                  id="nume" name="nume" type="text" autoComplete="name"
                  placeholder="Ex: Andrei Popescu" value={nume}
                  onChange={(e) => setNume(e.target.value)}
                  style={{ ...S.input, ...(arata("nume") ? S.inputRau : {}) }}
                />
              </Camp>

              <Camp
                eticheta="Numărul de telefon"
                nota="Te sunăm sau îți scriem pe WhatsApp."
                eroare={arata("telefon") ? "Verifică numărul. Ex: 0722 123 456" : ""}
              >
                <input
                  id="telefon" name="telefon" type="tel" inputMode="tel" autoComplete="tel"
                  placeholder="07xx xxx xxx" value={telefon}
                  onChange={(e) => setTelefon(e.target.value)}
                  style={{ ...S.input, ...(arata("telefon") ? S.inputRau : {}) }}
                />
              </Camp>

              <Camp
                eticheta="Ce afacere ai?"
                eroare={arata("afacere") ? "Spune-ne pe scurt ce afacere ai." : ""}
              >
                <input
                  id="afacere" name="afacere" type="text" autoComplete="organization"
                  placeholder="Ex: salon, service auto, magazin online"
                  value={afacere} onChange={(e) => setAfacere(e.target.value)}
                  style={{ ...S.input, ...(arata("afacere") ? S.inputRau : {}) }}
                />
              </Camp>

              <Grup eticheta="Unde vrei să apară reclamele?" nota="Poți alege mai multe.">
                {PLATFORME.map((p) => (
                  <Cip key={p} activ={platforme.includes(p)} onClick={() => comutaPlatforma(p)}>
                    {p}
                  </Cip>
                ))}
              </Grup>

              <Grup
                eticheta="Cât ai vrea să investești lunar în reclame?"
                nota="Banii de reclamă îi plătești direct platformei. Ne ajută doar să-ți dăm un sfat potrivit."
              >
                {BUGETE.map((b) => (
                  <Cip key={b} activ={buget === b} onClick={() => setBuget(buget === b ? "" : b)}>
                    {b}
                  </Cip>
                ))}
              </Grup>

              {/* Capcană pentru roboți: un om nu vede câmpul ăsta. */}
              <div style={S.ascuns} aria-hidden="true">
                <label htmlFor="site">Nu completa</label>
                <input id="site" name="site" tabIndex={-1} autoComplete="off"
                  value={capcana} onChange={(e) => setCapcana(e.target.value)} />
              </div>

              <label style={{ ...S.acord, ...(arata("acord") ? { borderColor: "rgba(248,113,113,0.6)" } : {}) }}>
                <input
                  type="checkbox" checked={acord} onChange={(e) => setAcord(e.target.checked)}
                  style={S.bifaInput}
                />
                <span>
                  Sunt de acord ca HUMANEX să mă contacteze telefonic sau pe WhatsApp în legătură
                  cu această cerere.
                </span>
              </label>
              {arata("acord") && <p style={S.eroare}>Bifează căsuța ca să te putem suna.</p>}

              {eroare && <p style={{ ...S.eroare, ...S.cutieEroare }} role="alert">{eroare}</p>}

              <button type="submit" disabled={seTrimite} style={{ ...S.buton, opacity: seTrimite ? 0.7 : 1 }}>
                {seTrimite ? "Se trimite…" : "Vreau să fiu sunat →"}
              </button>

              <p style={S.mic}>Durează 30 de secunde. Nu primești spam.</p>
            </form>

            <ul style={S.avantaje}>
              {[
                ["Primul apel e gratuit", "Aflăm ce vinzi și îți spunem sincer dacă reclamele te ajută."],
                ["Facem și clipurile", "Nu trebuie să filmezi sau să scrii nimic tu."],
                ["Vezi clar ce primești", "Raport simplu: câți oameni au văzut, câți au sunat, câți au cumpărat."],
              ].map(([t, d]) => (
                <li key={t} style={S.avantaj}>
                  <span style={S.punct} aria-hidden="true">✓</span>
                  <span>
                    <strong style={{ display: "block", fontSize: 15, marginBottom: 3 }}>{t}</strong>
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, lineHeight: 1.55 }}>{d}</span>
                  </span>
                </li>
              ))}
            </ul>

            <details style={S.date}>
              <summary style={S.dateTitlu}>Ce facem cu datele tale</summary>
              <div style={S.dateText}>
                <p>
                  Datele din formular (nume, telefon, afacerea ta și ce ai ales) ajung doar la
                  HUMANEX (AMBRONUS SRL, Brașov). Le folosim ca să te contactăm în legătură cu
                  cererea ta și nu le vindem și nu le dăm nimănui.
                </p>
                <p>
                  Le păstrăm cel mult 12 luni dacă nu lucrăm împreună. Poți cere oricând să le
                  vezi, să le corectăm sau să le ștergem, scriindu-ne la{" "}
                  <a href={`mailto:${EMAIL_HUMANEX}`} style={{ color: "#60a5fa" }}>{EMAIL_HUMANEX}</a>.
                  Ai și dreptul să te plângi la ANSPDCP (dataprotection.ro).
                </p>
                {ARE_PIXELI && (
                  <p>
                    Dacă accepți cookie-urile, folosim pixelii Meta și TikTok ca să aflăm care
                    reclamă a adus cererea.{" "}
                    <button type="button" onClick={() => setCookies(null)} style={S.butonText}>
                      Schimbă alegerea
                    </button>
                  </p>
                )}
              </div>
            </details>
          </>
        )}

        <footer style={S.subsol}>© {new Date().getFullYear()} HUMANEX · AMBRONUS SRL · Brașov</footer>
      </main>

      {ARE_PIXELI && cookies === null && (
        <div style={S.cookies} role="dialog" aria-label="Cookie-uri">
          <p style={{ fontSize: 14, lineHeight: 1.5, color: "rgba(255,255,255,0.8)" }}>
            Folosim cookie-uri ca să știm care reclamă te-a adus aici. Accepți?
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button type="button" onClick={() => alegeCookies("da")} style={S.cookieDa}>Accept</button>
            <button type="button" onClick={() => alegeCookies("nu")} style={S.cookieNu}>Nu, mulțumesc</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Camp({ eticheta, nota, eroare, children }: {
  eticheta: string; nota?: string; eroare?: string; children: React.ReactElement<{ id: string }>;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label htmlFor={children.props.id} style={S.label}>{eticheta}</label>
      {nota && <p style={S.nota}>{nota}</p>}
      {children}
      {eroare && <p style={S.eroare}>{eroare}</p>}
    </div>
  );
}

function Grup({ eticheta, nota, children }: { eticheta: string; nota?: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: "none", margin: "0 0 20px", padding: 0 }}>
      <legend style={{ ...S.label, padding: 0 }}>
        {eticheta} <span style={{ color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>(opțional)</span>
      </legend>
      {nota && <p style={S.nota}>{nota}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
    </fieldset>
  );
}

function Cip({ activ, onClick, children }: {
  activ: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      type="button" onClick={onClick}
      aria-pressed={activ}
      style={{
        ...S.cip,
        ...(activ ? S.cipActiv : {}),
      }}
    >
      {activ && <span aria-hidden="true" style={{ marginRight: 6 }}>✓</span>}
      {children}
    </button>
  );
}

function Logo() {
  return (
    <svg width={40} height={40} viewBox="0 0 42 42" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="lgf" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <path d="M21 2L38 11.5V30.5L21 40L4 30.5V11.5L21 2Z" fill="url(#lgf)" opacity="0.15" />
      <path d="M21 2L38 11.5V30.5L21 40L4 30.5V11.5L21 2Z" stroke="url(#lgf)" strokeWidth="1.5" fill="none" />
      <text x="21" y="27" textAnchor="middle" fill="white" fontSize="18" fontWeight="900"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">H</text>
      <circle cx="21" cy="2" r="2" fill="#0ea5e9" opacity="0.8" />
    </svg>
  );
}

const S: Record<string, React.CSSProperties> = {
  pagina: { minHeight: "100vh", background: "#040d1f", color: "#fff", position: "relative", overflowX: "hidden" },
  grila: {
    position: "fixed", inset: 0, pointerEvents: "none",
    backgroundImage:
      "linear-gradient(rgba(96,165,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.06) 1px, transparent 1px)",
    backgroundSize: "44px 44px",
    maskImage: "radial-gradient(ellipse at top, #000 30%, transparent 75%)",
    WebkitMaskImage: "radial-gradient(ellipse at top, #000 30%, transparent 75%)",
  },
  lumina: {
    position: "fixed", top: -220, left: "50%", transform: "translateX(-50%)",
    width: 640, height: 640, borderRadius: "50%", pointerEvents: "none",
    background: "radial-gradient(circle, rgba(29,78,216,0.28) 0%, transparent 65%)",
  },
  continut: { position: "relative", maxWidth: 560, margin: "0 auto", padding: "26px 16px 40px" },
  brand: { display: "inline-flex", alignItems: "center", gap: 10, color: "#fff", textDecoration: "none", marginBottom: 34 },
  brandNume: { display: "block", fontWeight: 900, fontSize: 17, letterSpacing: 0.5 },
  brandSub: { display: "block", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 2, textTransform: "uppercase" },
  eticheta: { fontSize: 12, fontWeight: 700, color: "#60a5fa", letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 },
  titlu: { fontSize: "clamp(32px, 8vw, 46px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.08, marginBottom: 14 },
  albastru: {
    background: "linear-gradient(135deg, #3b82f6, #0ea5e9)",
    WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
  },
  sub: { fontSize: 17, color: "rgba(255,255,255,0.65)", lineHeight: 1.6 },
  card: {
    background: "rgba(10,22,48,0.72)", border: "1px solid rgba(96,165,250,0.16)",
    borderRadius: 20, padding: "26px 20px", backdropFilter: "blur(6px)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
  },
  label: { display: "block", fontSize: 15, fontWeight: 700, marginBottom: 8 },
  nota: { fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "-3px 0 9px", lineHeight: 1.5 },
  input: {
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12, padding: "15px 16px", color: "#fff", fontSize: 16,
    outline: "none", fontFamily: "inherit", width: "100%",
  },
  inputRau: { borderColor: "rgba(248,113,113,0.7)" },
  eroare: { color: "#f87171", fontSize: 13, fontWeight: 600, marginTop: 7 },
  cutieEroare: {
    background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
    borderRadius: 12, padding: "12px 14px", marginTop: 14,
  },
  cip: {
    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.14)",
    color: "rgba(255,255,255,0.85)", borderRadius: 999, padding: "11px 16px",
    fontSize: 15, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", lineHeight: 1.2,
  },
  cipActiv: {
    background: "rgba(29,78,216,0.3)", borderColor: "#3b82f6", color: "#fff",
    boxShadow: "0 0 0 1px #3b82f6 inset",
  },
  acord: {
    display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14, lineHeight: 1.5,
    color: "rgba(255,255,255,0.75)", cursor: "pointer", padding: "14px",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, marginTop: 4,
  },
  bifaInput: { width: 20, height: 20, marginTop: 1, flexShrink: 0, accentColor: "#3b82f6" },
  buton: {
    width: "100%", marginTop: 18, padding: "18px", borderRadius: 14, border: "none",
    background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)", color: "#fff",
    fontWeight: 900, fontSize: 18, fontFamily: "inherit", cursor: "pointer",
    boxShadow: "0 0 50px rgba(29,78,216,0.45)",
  },
  mic: { textAlign: "center", fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 12 },
  ascuns: { position: "absolute", left: -9999, width: 1, height: 1, overflow: "hidden" },
  avantaje: { listStyle: "none", padding: 0, margin: "30px 0 0", display: "grid", gap: 16 },
  avantaj: { display: "flex", gap: 12, alignItems: "flex-start" },
  punct: {
    width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "grid", placeItems: "center",
    background: "rgba(29,78,216,0.25)", color: "#60a5fa", fontSize: 14, fontWeight: 900,
  },
  date: { marginTop: 30, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 18 },
  dateTitlu: { cursor: "pointer", fontSize: 14, fontWeight: 700, color: "rgba(255,255,255,0.7)" },
  dateText: { display: "grid", gap: 10, marginTop: 12, fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.55)" },
  butonText: {
    background: "none", border: "none", padding: 0, color: "#60a5fa", fontSize: 13,
    textDecoration: "underline", cursor: "pointer", fontFamily: "inherit",
  },
  bifa: {
    width: 64, height: 64, borderRadius: "50%", margin: "0 auto 20px", display: "grid", placeItems: "center",
    background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)", fontSize: 30, fontWeight: 900,
    boxShadow: "0 0 50px rgba(29,78,216,0.5)",
  },
  legaturaInapoi: { display: "inline-block", marginTop: 26, color: "#60a5fa", fontWeight: 700, textDecoration: "none" },
  subsol: { textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.28)", marginTop: 34 },
  cookies: {
    position: "fixed", left: 12, right: 12, bottom: 12, maxWidth: 520, margin: "0 auto",
    background: "#0b1a3a", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 16,
    padding: "16px 18px", boxShadow: "0 20px 60px rgba(0,0,0,0.5)", zIndex: 10,
  },
  cookieDa: {
    flex: 1, padding: "12px", borderRadius: 10, border: "none", fontWeight: 800, fontSize: 15,
    background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)", color: "#fff", cursor: "pointer", fontFamily: "inherit",
  },
  cookieNu: {
    flex: 1, padding: "12px", borderRadius: 10, fontWeight: 700, fontSize: 15,
    background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.8)",
    cursor: "pointer", fontFamily: "inherit",
  },
};
