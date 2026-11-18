/* Numărul HUMANEX de WhatsApp, în format internațional, fără + și fără
   spații (ex: 40722123456). După ce cineva trimite un formular, îl ducem
   în WhatsApp cu un mesaj deja scris către numărul ăsta. */
export const WHATSAPP_NR = "40774079186";

export const areWhatsApp = /^\d{10,15}$/.test(WHATSAPP_NR);

export const linkWhatsApp = (text: string) =>
  `https://wa.me/${WHATSAPP_NR}?text=${encodeURIComponent(text)}`;

/* Câte milisecunde așteptăm pe ecranul de confirmare înainte să deschidem
   WhatsApp singuri. Omul vede întâi că cererea a plecat, apoi ajunge în
   conversație cu mesajul gata scris — trebuie doar să apese Trimite. */
export const PAUZA_WHATSAPP = 2500;
