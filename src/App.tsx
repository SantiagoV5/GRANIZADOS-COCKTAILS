import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

// ── assets (WebP optimizados; regenerar con `python3 scripts/optimize-images.py`) ──
import logoNeon from "@/imports/web/logo-neon.webp";
import logoBlanco from "@/imports/web/logo-blanco.webp";
import iconCasa from "@/imports/web/icon-casa.webp";
import iconEdificio from "@/imports/web/icon-edificio.webp";
import iconRedes from "@/imports/web/icon-redes.webp";
import iconMenu from "@/imports/web/icon-menu.webp";
import iconIG from "@/imports/web/icon-instagram.webp";
import iconWA from "@/imports/web/icon-whatsapp.webp";
import iconTT from "@/imports/web/icon-tiktok.webp";
import iconFB from "@/imports/web/icon-facebook.webp";
import iconMoon from "@/imports/web/icon-moon.webp";
import iconSun from "@/imports/web/icon-sun.webp";

import promoJueves from "@/imports/web/promo-jueves.webp";
import promoMartes from "@/imports/web/promo-martes.webp";
import promoViernes from "@/imports/web/promo-viernes.webp";

import imgPocima from "@/imports/web/la-pocima.webp";
import imgMexicano from "@/imports/web/mexicano.webp";
import imgMangonada from "@/imports/web/mangonada.webp";
import imgFresada from "@/imports/web/fresada.webp";
import imgCombi from "@/imports/web/combi-completa.webp";
import imgNocheArdiente from "@/imports/web/noche-ardiente.webp";
import imgMoraAzul from "@/imports/web/mora-azul.webp";
import imgFrutosRojos from "@/imports/web/frutos-rojos.webp";
import imgFrutosIntensos from "@/imports/web/frutos-intensos.webp";
import imgMaracumango from "@/imports/web/maracumango.webp";
import imgSmirnoff from "@/imports/web/smirnoff.webp";
import imgPanteraRosa from "@/imports/web/pantera-rosa.webp";
import imgJagermeister from "@/imports/web/jagermeister.webp";
import imgMiamiNight from "@/imports/web/miami-night.webp";
import imgMargarita from "@/imports/web/margarita-tequila.webp";
import imgCremosoBaileys from "@/imports/web/cremoso-baileys.webp";
import imgChicle from "@/imports/web/chicle.webp";
import imgMangomanzana from "@/imports/web/mangomanzana.webp";
import imgFrutosRojosGomas from "@/imports/web/frutos-rojos-gomas.webp";
import imgJagermeisterGomas from "@/imports/web/jagermeister-gomas.webp";
import imgMangomanzanaGomas from "@/imports/web/mangomanzana-gomas.webp";
import imgMaracumangoGomas from "@/imports/web/maracumango-gomas.webp";
import imgMargaritaGomas from "@/imports/web/margarita-tequila-gomas.webp";
import imgMiamiNightGomas from "@/imports/web/miami-night-gomas.webp";
import imgMoraAzulGomas from "@/imports/web/mora-azul-gomas.webp";
import imgNocheArdienteGomas from "@/imports/web/noche-ardiente-gomas.webp";
import imgPanteraRosaGomas from "@/imports/web/pantera-rosa-gomas.webp";
import imgSmirnoffGomas from "@/imports/web/smirnoff-gomas.webp";
import imgChicleGomas from "@/imports/web/chicle-gomas.webp";
import imgFrutosIntensosGomas from "@/imports/web/frutos-intensos-gomas.webp";
import imgCremososOreoChocorramo from "@/imports/web/cremosos-oreo-chocorramo.webp";
import imgCremososCafeMilo from "@/imports/web/cremosos-cafe-milo.webp";
import imgNeveraLaTentadora from "@/imports/web/nevera-la-tentadora.webp";
import imgNeveraLaPecadora from "@/imports/web/nevera-la-pecadora.webp";
import imgNeveraLaProhibida from "@/imports/web/nevera-la-prohibida.webp";
import imgFrutosRojosSolo from "@/imports/web/frutos-rojos-solo.webp";
import imgJagermeisterSolo from "@/imports/web/jagermeister-solo.webp";
import imgMangomanzanaSolo from "@/imports/web/mangomanzana-solo.webp";
import imgMaracumangoSolo from "@/imports/web/maracumango-solo.webp";
import imgMargaritaSolo from "@/imports/web/margarita-tequila-solo.webp";
import imgMiamiNightSolo from "@/imports/web/miami-night-solo.webp";
import imgMoraAzulSolo from "@/imports/web/mora-azul-solo.webp";
import imgNocheArdienteSolo from "@/imports/web/noche-ardiente-solo.webp";
import imgPanteraRosaSolo from "@/imports/web/pantera-rosa-solo.webp";
import imgSmirnoffSolo from "@/imports/web/smirnoff-solo.webp";

// ═════════════════════════════════════════════════════════════════════════════
// 1. STORAGE + THEME
// ═════════════════════════════════════════════════════════════════════════════

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento bloqueado (modo privado): el sitio sigue funcionando sin persistir */
  }
}

const THEME_KEY = "gc-theme";

function useTheme() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) !== "light";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light-mode", !dark);
    root.style.colorScheme = dark ? "dark" : "light";
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? "#000000" : "#ffffff");
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {
      /* noop */
    }
  }, [dark]);

  const toggle = useCallback(() => {
    // Las transiciones de color sólo se activan durante el cambio de tema (no en cada hover).
    const root = document.documentElement;
    root.classList.add("theme-anim");
    window.setTimeout(() => root.classList.remove("theme-anim"), 600);
    setDark((d) => !d);
  }, []);

  return { dark, toggle };
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. DATA
// ═════════════════════════════════════════════════════════════════════════════

// ── horario ──────────────────────────────────────────────────────────────────
// ── sedes ────────────────────────────────────────────────────────────────────
type BranchId = "tulua" | "buga";
type Branch = {
  id: BranchId;
  name: string;
  tag: string;
  address: string;
  city: string;
  whatsapp: string; // formato wa.me: 57 + número, sin + ni espacios
  mapsQuery: string;
  mapsCoordinates?: string;
};

const BRANCHES: Record<BranchId, Branch> = {
  tulua: {
    id: "tulua",
    name: "Tuluá",
    tag: "Sede principal",
    address: "Cra 27A #41A-39 Av. Cali",
    city: "Tuluá, Valle del Cauca",
    whatsapp: "573117672353",
    mapsQuery: "Carrera 27A #41A-39, Tuluá, Valle del Cauca, Colombia",
    mapsCoordinates: "4.070173,-76.196872",
  },
  buga: {
    id: "buga",
    name: "Buga",
    tag: "Nueva sede",
    address: "Calle 1 #10-47 Estambul",
    city: "Buga, Valle del Cauca",
    whatsapp: "573105047962",
    mapsQuery: "Calle 1 #10-47, Buga, Valle del Cauca, Colombia",
  },
};
const BRANCH_IDS: BranchId[] = ["tulua", "buga"];
type ScheduleEntry = { open: number; close: number; label: string; hours: string };
const BRANCH_SCHEDULE: Record<BranchId, Record<number, ScheduleEntry>> = {
  tulua: {
    0: { open: 16, close: 24, label: "Domingo", hours: "4:00 PM – 12:00 AM" },
    1: { open: 16, close: 24, label: "Lun – Jue", hours: "4:00 PM – 12:00 AM" },
    2: { open: 16, close: 24, label: "Lun – Jue", hours: "4:00 PM – 12:00 AM" },
    3: { open: 16, close: 24, label: "Lun – Jue", hours: "4:00 PM – 12:00 AM" },
    4: { open: 16, close: 24, label: "Lun – Jue", hours: "4:00 PM – 12:00 AM" },
    5: { open: 16, close: 25, label: "Viernes", hours: "4:00 PM – 1:00 AM" },
    6: { open: 16, close: 26, label: "Sábado", hours: "4:00 PM – 2:00 AM" },
  },
  buga: {
    0: { open: 15, close: 25, label: "Domingo", hours: "3:00 PM – 1:00 AM" },
    1: { open: 16, close: 24, label: "Lun – Jue", hours: "4:00 PM – 12:00 AM" },
    2: { open: 16, close: 24, label: "Lun – Jue", hours: "4:00 PM – 12:00 AM" },
    3: { open: 16, close: 24, label: "Lun – Jue", hours: "4:00 PM – 12:00 AM" },
    4: { open: 16, close: 24, label: "Lun – Jue", hours: "4:00 PM – 12:00 AM" },
    5: { open: 16, close: 27, label: "Viernes", hours: "4:00 PM – 3:00 AM" },
    6: { open: 16, close: 27, label: "Sábado", hours: "4:00 PM – 3:00 AM" },
  },
};
const SCHEDULE_DAY_ORDER = [1, 5, 6, 0];

// ── productos ────────────────────────────────────────────────────────────────
type Variant = { id: string; label: string; price: number; photo?: string };
type Product = {
  id: string;
  name: string;
  desc: string;
  photo?: string;
  idlePhoto?: string;
  /** Foto 2:3 (vaso completo); sin definir = 3:4. */
  tall?: boolean;
  glow?: boolean;
  badge?: string;
  /** Categoría legible (se usa en el pedido y en el mensaje de WhatsApp). */
  context?: string;
  variants: Variant[];
};

const K = (n: number) => n * 1000;
const single = (price: number): Variant[] => [{ id: "u", label: "", price }];
const conSinLicor = (price: number): Variant[] => [
  { id: "con", label: "Con licor", price },
  { id: "sin", label: "Sin licor", price },
];
// Precios de la carta: GOMAS 15K · GOMAS, PERLAS EXPLOSIVAS, FRUTAS 18K
const GRANIZADO_VARIANTS: Variant[] = [
  { id: "gomas", label: "Con gomas", price: K(15) },
  { id: "full", label: "Gomas, perlas explosivas y frutas", price: K(18) },
];

const recommended: Product[] = [
  { id: "rec-pocima", name: "LA POCIMA", photo: imgPocima, tall: true, glow: true, badge: "Granizado Fest 2026", context: "Recomendado", desc: "Mango biche manzana, Tequila, Four Loko, Jäger, Smirnoff Tamarindo", variants: single(K(20)) },
  { id: "rec-combi", name: "LA COMBI COMPLETA", photo: imgCombi, tall: true, glow: true, context: "Recomendado", desc: "Combinación deliciosa de todos los sabores", variants: single(K(20)) },
  { id: "rec-mexicano", name: "MEXICANO", photo: imgMexicano, tall: true, glow: true, context: "Recomendado", desc: "Tequila, Smirnoff de limón y chamoy", variants: single(K(20)) },
  { id: "rec-mangonada", name: "MANGONADA", photo: imgMangonada, tall: true, glow: true, badge: "Con o sin licor", context: "Recomendado", desc: "Michelada con salsa de chamoy mexicana, tajín y gomas enchiladas", variants: conSinLicor(K(20)) },
  { id: "rec-fresada", name: "FRESADA", photo: imgFresada, tall: true, glow: true, badge: "Con o sin licor", context: "Recomendado", desc: "Granizado de fresa con chamoy, tajín y gomas enchiladas", variants: conSinLicor(K(20)) },
];

const granizado = (id: string, name: string, desc: string, photo: string, context: string, idlePhoto: string, gomasPhoto: string): Product => ({
  id,
  name,
  desc,
  photo,
  idlePhoto,
  tall: true,
  context,
  variants: GRANIZADO_VARIANTS.map((v) => (v.id === "gomas" ? { ...v, photo: gomasPhoto } : v)),
});

const granizadoCategories: { id: string; label: string; items: Product[] }[] = [
  {
    id: "licor",
    label: "Con licor",
    items: [
      granizado("gl-noche-ardiente", "NOCHE ARDIENTE", "Jägermeister, Bombombun, Tequila, Four Loko", imgNocheArdiente, "Granizado con licor", imgNocheArdienteSolo, imgNocheArdienteGomas),
      granizado("gl-mora-azul", "MORA AZUL", "Blueberry, Vodka", imgMoraAzul, "Granizado con licor", imgMoraAzulSolo, imgMoraAzulGomas),
      granizado("gl-frutos-rojos", "FRUTOS ROJOS", "Bombombun, Fresa, Whisky", imgFrutosRojos, "Granizado con licor", imgFrutosRojosSolo, imgFrutosRojosGomas),
      granizado("gl-maracumango", "MARACUMANGO", "Mango, Maracuyá, Tequila", imgMaracumango, "Granizado con licor", imgMaracumangoSolo, imgMaracumangoGomas),
      granizado("gl-smirnoff", "SMIRNOFF", "Lulo, Smirnoff, Vodka", imgSmirnoff, "Granizado con licor", imgSmirnoffSolo, imgSmirnoffGomas),
      granizado("gl-pantera-rosa", "PANTERA ROSA", "Champagne, Nüvo, Vodka", imgPanteraRosa, "Granizado con licor", imgPanteraRosaSolo, imgPanteraRosaGomas),
      granizado("gl-jagermeister", "JÄGERMEISTER", "Naranja, Jägermeister, Whisky", imgJagermeister, "Granizado con licor", imgJagermeisterSolo, imgJagermeisterGomas),
      granizado("gl-miami-night", "MIAMI NIGHT", "Uva, Triple sec, Tequila", imgMiamiNight, "Granizado con licor", imgMiamiNightSolo, imgMiamiNightGomas),
      granizado("gl-margarita", "MARGARITA TEQUILA", "Cereza, Maracuyá, Tequila", imgMargarita, "Granizado con licor", imgMargaritaSolo, imgMargaritaGomas),
      granizado("gl-mangomanzana", "MANGOMANZANA", "Mango biche manzana, Tequila, Four Loko", imgMangomanzana, "Granizado con licor", imgMangomanzanaSolo, imgMangomanzanaGomas),
    ],
  },
  {
    id: "sinLicor",
    label: "Sin licor",
    items: [
      granizado("gs-frutos-intensos", "FRUTOS INTENSOS", "Fresa, Bombombun", imgFrutosIntensos, "Granizado sin licor", imgFrutosIntensosGomas, imgFrutosIntensosGomas),
      granizado("gs-chicle", "CHICLE", "Sirope de chicle", imgChicle, "Granizado sin licor", imgChicleGomas, imgChicleGomas),
    ],
  },
  {
    id: "cremosos",
    label: "Cremosos",
    items: [
      { id: "cr-baileys", name: "CREMOSO DE BAILEYS", desc: "Licor de café, Baileys, Amaretto", photo: imgCremosoBaileys, context: "Cremoso", variants: single(K(18)) },
      { id: "cr-oreo-chocorramo", name: "OREO & CHOCORRAMO", desc: "Oreo · Chocorramo", photo: imgCremososOreoChocorramo, context: "Cremoso", variants: ["Oreo", "Chocorramo"].map((f) => ({ id: f.toLowerCase(), label: f, price: K(18) })) },
      { id: "cr-cafe-milo", name: "CAFÉ & MILO", desc: "Café · Milo", photo: imgCremososCafeMilo, context: "Cremoso", variants: ["Café", "Milo"].map((f) => ({ id: f.toLowerCase(), label: f, price: K(18) })) },
    ],
  },
  {
    id: "paraCompartir",
    label: "Para compartir",
    items: [
      { id: "nevera-tentadora", name: "La Tentadora (3-4 personas)", desc: "Granizado de preferencia, jeringas de licor, gomas y dulces", photo: imgNeveraLaTentadora, context: "Para compartir", variants: single(K(45)) },
      { id: "nevera-pecadora", name: "La Pecadora (3-4 personas)", desc: "Granizado de preferencia, 2 coronitas, jeringas de licor, gomas y dulces", photo: imgNeveraLaPecadora, context: "Para compartir", variants: single(K(75)) },
      { id: "nevera-prohibida", name: "La Prohibida (5-6 personas)", desc: "Granizado de preferencia, 1 four loko, jeringas de licor, gomas y dulces", photo: imgNeveraLaProhibida, context: "Para compartir", variants: single(K(105)) },
    ],
  },
];

// ── promociones ──────────────────────────────────────────────────────────────
type Promo = { day: string; weekday: number; photo: string; color: string; alt: string; product: Product | null };

const promos: Promo[] = [
  {
    day: "VIERNES",
    weekday: 5,
    photo: promoViernes,
    color: "#FF00FF",
    alt: "Viernes de promo: 2 granizados por $20.000, 3 por $30.000, 4 por $40.000. Solo gomas.",
    product: {
      id: "promo-viernes",
      name: "PROMO VIERNES · GRANIZADOS CON GOMAS",
      desc: "Solo gomas. Escribe los sabores en las notas del pedido.",
      context: "Promo viernes",
      photo: promoViernes,
      variants: [
        { id: "2", label: "2 granizados", price: K(20) },
        { id: "3", label: "3 granizados", price: K(30) },
        { id: "4", label: "4 granizados", price: K(40) },
      ],
    },
  },
  {
    day: "MARTES",
    weekday: 2,
    photo: promoMartes,
    color: "#FF00FF",
    alt: "Martes de promo en cremosos: 2 por $30.000. Sabores Milo, Café, Oreo, Chocorramo y Baileys.",
    product: {
      id: "promo-martes",
      name: "PROMO MARTES · 2 CREMOSOS",
      desc: "Sabores: Milo, Café, Oreo, Chocorramo o Baileys. Escribe los sabores en las notas del pedido.",
      context: "Promo martes",
      photo: promoMartes,
      variants: single(K(30)),
    },
  },
  {
    day: "JUEVES",
    weekday: 4,
    photo: promoJueves,
    color: "#0066FF",
    alt: "Jueves: domicilio gratis.",
    product: null,
  },
];

/** Catálogo único: el pedido guarda sólo {productId, variantId, quantity} y resuelve aquí. */
const CATALOG = new Map<string, Product>(
  [
    ...recommended,
    ...granizadoCategories.flatMap((c) => c.items),
    ...promos.flatMap((p) => (p.product ? [p.product] : [])),
  ].map((p) => [p.id, p]),
);

// ── redes ────────────────────────────────────────────────────────────────────
const INSTAGRAM_URL = "https://www.instagram.com/granizados.buga.tulua";

const socials = [
  { id: "ig", name: "Instagram", handle: "@granizados.buga.tulua", followers: "+4K", icon: iconIG, color: "#E1306C", url: INSTAGRAM_URL, backdrop: false },
  { id: "tt", name: "TikTok", handle: "@granizados.tulua", followers: "+1K", icon: iconTT, color: "#FF00FF", url: "https://www.tiktok.com/@granizados.tulua", backdrop: true },
  { id: "fb", name: "Facebook", handle: "Granizados Tuluá", followers: "+1K", icon: iconFB, color: "#0066FF", url: "https://www.facebook.com/share/1DhQAddCnE/", backdrop: false },
];

const SECTIONS = [
  { id: "inicio", label: "Inicio", icon: iconCasa },
  { id: "menu", label: "Menú", icon: iconMenu },
  { id: "sucursales", label: "Sucursales", icon: iconEdificio },
  { id: "redes", label: "Redes", icon: iconRedes },
];

// ═════════════════════════════════════════════════════════════════════════════
// 3. HELPERS
// ═════════════════════════════════════════════════════════════════════════════

const money = (n: number) => `$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
const fmtK = (n: number) => `${n / 1000}K`;
const fmtPhone = (wa: string) => wa.slice(2).replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
const normalize = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function priceLabel(p: Product) {
  const prices = p.variants.map((v) => v.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? fmtK(min) : `${fmtK(min)} – ${fmtK(max)}`;
}

function fmtHour(h: number) {
  const hh = h % 24;
  const suffix = hh >= 12 ? "PM" : "AM";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:00 ${suffix}`;
}

type OpenStatus = { open: boolean; detail: string; /** día "comercial" (la madrugada cuenta como el día anterior) */ sessionDay: number; label?: string };
type OpenStatuses = Record<BranchId, OpenStatus>;

const COLOMBIA_TIME_ZONE = "America/Bogota";
const colombiaTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: COLOMBIA_TIME_ZONE,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
const WEEKDAY_INDEX: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function getColombiaParts(date: Date) {
  const parts = Object.fromEntries(colombiaTimeFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  return { day: WEEKDAY_INDEX[parts.weekday], minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

function getOpenStatus(date: Date, branchId: BranchId): OpenStatus {
  const { day, minutes } = getColombiaParts(date);
  const schedule = BRANCH_SCHEDULE[branchId];
  const today = schedule[day];
  if (minutes >= today.open * 60) return { open: true, detail: `Cierra a las ${fmtHour(today.close)}`, sessionDay: day };

  const previousDay = (day + 6) % 7;
  const previous = schedule[previousDay];
  if (previous.close > 24 && minutes < (previous.close - 24) * 60) {
    return { open: true, detail: `Cierra a las ${fmtHour(previous.close)}`, sessionDay: previousDay };
  }

  return { open: false, detail: `Abrimos hoy a las ${fmtHour(today.open)}`, sessionDay: day };
}

/** Devuelve el estado de ambas sedes usando siempre la hora de Colombia. */
function getOpenStatuses(date: Date): OpenStatuses {
  return { tulua: getOpenStatus(date, "tulua"), buga: getOpenStatus(date, "buga") };
}

function getScheduleDate() {
  if (import.meta.env.DEV) {
    const value = new URLSearchParams(window.location.search).get("simular");
    const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (match) {
      const [, year, month, day, hour, minute] = match.map(Number);
      if (hour < 24 && minute < 60) return new Date(Date.UTC(year, month - 1, day, hour + 5, minute));
    }
  }
  return new Date();
}

/** Re-evalúa el estado abierto/cerrado cada minuto. */
function useOpenStatuses() {
  const [statuses, setStatuses] = useState(() => getOpenStatuses(getScheduleDate()));
  useEffect(() => {
    const id = window.setInterval(() => setStatuses(getOpenStatuses(getScheduleDate())), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return statuses;
}

function getNavbarStatus(statuses: OpenStatuses): OpenStatus {
  const tuluaOpen = statuses.tulua.open;
  const bugaOpen = statuses.buga.open;
  const label = tuluaOpen && bugaOpen
    ? "Abierto"
    : bugaOpen
      ? "Abierto en Buga"
      : tuluaOpen
        ? "Abierto en Tuluá"
        : "Cerrado";
  return { ...statuses.tulua, open: tuluaOpen || bugaOpen, label };
}

const waChatUrl = (branch: Branch, text?: string) =>
  `https://wa.me/${branch.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const mapsSearchUrl = (b: Branch) => `https://www.google.com/maps/search/?api=1&query=${b.mapsCoordinates ?? encodeURIComponent(b.mapsQuery)}`;
const mapsDirectionsUrl = (b: Branch) => `https://www.google.com/maps/dir/?api=1&destination=${b.mapsCoordinates ?? encodeURIComponent(b.mapsQuery)}`;
// Embed sin API key (modo "q"): Google geocodifica la dirección y pone el pin.
const mapsEmbedUrl = (b: Branch) => b.mapsCoordinates
  ? `https://www.google.com/maps?q=${b.mapsCoordinates}&output=embed`
  : `https://maps.google.com/maps?q=${encodeURIComponent(b.mapsQuery)}&z=16&output=embed`;

function useInView<T extends Element>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, rootMargin]);
  return [ref, inView] as const;
}

// ── pedido ───────────────────────────────────────────────────────────────────
type CartLine = { productId: string; variantId: string; quantity: number };
type CartAction =
  | { type: "add"; productId: string; variantId: string; quantity?: number }
  | { type: "setQty"; productId: string; variantId: string; quantity: number }
  | { type: "clear" };

const CART_KEY = "gc-cart-v1";
const MAX_QTY = 30;

function resolveLine(line: CartLine) {
  const product = CATALOG.get(line.productId);
  const variant = product?.variants.find((v) => v.id === line.variantId);
  return product && variant ? { ...line, product, variant } : null;
}
type ResolvedLine = NonNullable<ReturnType<typeof resolveLine>>;

function sanitizeCart(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((l): l is CartLine => !!l && typeof l === "object" && typeof l.productId === "string" && typeof l.variantId === "string" && Number.isInteger(l.quantity) && l.quantity > 0)
    .filter((l) => resolveLine(l) !== null)
    .map((l) => ({ ...l, quantity: Math.min(l.quantity, MAX_QTY) }));
}

function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "add": {
      const qty = action.quantity ?? 1;
      const existing = state.find((l) => l.productId === action.productId && l.variantId === action.variantId);
      if (existing) {
        return state.map((l) => (l === existing ? { ...l, quantity: Math.min(l.quantity + qty, MAX_QTY) } : l));
      }
      return [...state, { productId: action.productId, variantId: action.variantId, quantity: Math.min(qty, MAX_QTY) }];
    }
    case "setQty": {
      if (action.quantity <= 0) {
        return state.filter((l) => !(l.productId === action.productId && l.variantId === action.variantId));
      }
      return state.map((l) =>
        l.productId === action.productId && l.variantId === action.variantId ? { ...l, quantity: Math.min(action.quantity, MAX_QTY) } : l,
      );
    }
    case "clear":
      return [];
  }
}

// ── formulario de pedido ─────────────────────────────────────────────────────
type DeliveryMode = "domicilio" | "recoger";
type PaymentMethod = "cash" | "transfer";
type OrderForm = { branch: BranchId; delivery: DeliveryMode; address: string; payment: PaymentMethod; notes: string };

const ORDER_KEY = "gc-order-v1";
const PAYMENT_LABEL: Record<PaymentMethod, string> = { cash: "Efectivo", transfer: "Transferencia" };

function loadOrder(): OrderForm {
  const raw = load<Partial<OrderForm>>(ORDER_KEY, {});
  return {
    branch: raw.branch === "buga" ? "buga" : "tulua",
    delivery: raw.delivery === "recoger" ? "recoger" : "domicilio",
    address: typeof raw.address === "string" ? raw.address : "",
    payment: raw.payment === "transfer" ? "transfer" : "cash",
    notes: "", // las notas son de un solo pedido: no se guardan
  };
}

function buildOrderWhatsAppMessage(items: ResolvedLine[], form: OrderForm, freeDelivery: boolean) {
  const branch = BRANCHES[form.branch];
  const total = items.reduce((sum, l) => sum + l.variant.price * l.quantity, 0);
  const lines = items.map(({ product, variant, quantity }) => {
    const detail = [variant.label, product.context].filter(Boolean).join(" - ");
    return `- ${quantity}x ${product.name}${detail ? ` (${detail})` : ""} - ${money(variant.price * quantity)}`;
  });
  const isDelivery = form.delivery === "domicilio";

  const sections = [
    "*NUEVO PEDIDO - GRANIZADOS COCKTAILS*",
    "",
    `*Sede:* ${branch.name}`,
    "",
    "*Productos:*",
    ...lines,
    "",
    "*Entrega:*",
    isDelivery
      ? `  ${freeDelivery ? "Domicilio gratis" : "Domicilio"}`
      : `  Recojo en la sede ${branch.name}`,
    ...(isDelivery ? ["", "*Dirección:*", `  ${form.address.trim()}`] : []),
    "",
    "*Método de pago:*",
    `  ${PAYMENT_LABEL[form.payment]}`,
  ];

  if (form.notes.trim()) {
    sections.push("");
    sections.push("*Notas especiales:*");
    sections.push(`  ${form.notes.trim()}`);
  }

  sections.push("");
  sections.push(`*Total:* ${money(total)}`);
  sections.push("");
  sections.push(
    isDelivery && !freeDelivery
      ? "¿Confirman disponibilidad y valor del domicilio? ¡Gracias!"
      : "¿Confirman disponibilidad? ¡Gracias!"
  );

  return sections.join("\n");
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. UI PRIMITIVES
// ═════════════════════════════════════════════════════════════════════════════

const ICON_PATHS = {
  bag: "M6 7h12l-1 13H7L6 7Zm3 0V6a3 3 0 0 1 6 0v1",
  plus: "M12 5v14M5 12h14",
  minus: "M5 12h14",
  close: "M6 6l12 12M18 6 6 18",
  check: "m5 12 5 5 9-10",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  pin: "M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Zm0-9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  route: "M6 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12-10a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM6 15V9a4 4 0 0 1 4-4h2M18 9v6a4 4 0 0 1-4 4h-2",
  search: "m20 20-4.2-4.2M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z",
  play: "M8 5v14l11-7L8 5Z",
  external: "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
} as const;

function Icon({ name, size = 20, strokeWidth = 2 }: { name: keyof typeof ICON_PATHS; size?: number; strokeWidth?: number }) {
  const filled = name === "play";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false"
      fill={filled ? "currentColor" : "none"} stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

/** Pinta un PNG/WebP con un color exacto usando máscara CSS (sirve para el logo de WhatsApp). */
function MaskIcon({ src, color = "currentColor", size = 18 }: { src: string; color?: string; size?: number }) {
  return (
    <span aria-hidden="true" className="mask-icon"
      style={{ width: size, height: size, backgroundColor: color, WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }} />
  );
}

// Un único IntersectionObserver compartido para todas las animaciones de entrada.
let revealObserver: IntersectionObserver | null = null;
function getRevealObserver() {
  if (revealObserver || typeof IntersectionObserver === "undefined") return revealObserver;
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObserver?.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.04 },
  );
  return revealObserver;
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = getRevealObserver();
    if (!obs) {
      el.classList.add("is-visible");
      return;
    }
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`} style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}>
      {children}
    </div>
  );
}

function SectionHeading({ id, eyebrow, title, children, className }: { id: string; eyebrow?: string; title: string; children?: ReactNode; className?: string }) {
  return (
    <div className={`section-heading${className ? ` ${className}` : ""}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} tabIndex={-1}>{title}</h2>
      {children}
    </div>
  );
}

function StatusPill({ status, showDetail = false }: { status: OpenStatus; showDetail?: boolean }) {
  const label = status.label ?? (status.open ? "Abierto" : "Cerrado");
  return (
    <span className={`status-pill ${status.open ? "is-open" : "is-closed"}`} aria-label={`${label}. ${status.detail}`}>
      <span className="status-dot" aria-hidden="true" />
      <span>{label}</span>
      {showDetail ? <span className="status-detail">· {status.detail}</span> : <span className="sr-only">. {status.detail}</span>}
    </span>
  );
}

/** Diálogo modal nativo (<dialog>): trampa de foco, Escape y restauración de foco incluidos. */
function Sheet({ open, onClose, labelledBy, children, className = "" }: {
  open: boolean; onClose: () => void; labelledBy: string; children: ReactNode; className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} className={`sheet ${className}`} aria-labelledby={labelledBy}
      onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClose={() => { if (open) onClose(); }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {open && <div className="sheet-panel">{children}</div>}
    </dialog>
  );
}

type AddHandler = (product: Product, variantId?: string) => void;

// ═════════════════════════════════════════════════════════════════════════════
// 5. COMPONENTS
// ═════════════════════════════════════════════════════════════════════════════

// ── header ───────────────────────────────────────────────────────────────────
function Header({ dark, onToggleTheme, status, active, cartCount, onOpenCart }: {
  dark: boolean; onToggleTheme: () => void; status: OpenStatus; active: string; cartCount: number; onOpenCart: () => void;
}) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      progressRef.current?.style.setProperty("transform", `scaleX(${p})`);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="app-header">
      <a href="#inicio" className="header-logo" aria-label="Granizados-Cocktails, ir al inicio">
        <img src={logoBlanco} alt="" width={134} height={38} className="logo-wordmark" fetchPriority="high" />
      </a>

      <nav className="header-nav" aria-label="Secciones">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? "true" : undefined}>{s.label}</a>
        ))}
      </nav>

      <div className="header-actions">
        <StatusPill status={status} />
        <button type="button" className="icon-btn cart-btn" onClick={onOpenCart}
          aria-label={cartCount ? `Abrir pedido, ${cartCount} ${cartCount === 1 ? "producto" : "productos"}` : "Abrir pedido, vacío"}>
          <Icon name="bag" />
          {cartCount > 0 && <span key={cartCount} className="cart-badge" aria-hidden="true">{cartCount}</span>}
        </button>
        <button type="button" className="icon-btn theme-toggle" onClick={onToggleTheme}
          aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"} aria-pressed={!dark}>
          <img src={dark ? iconSun : iconMoon} alt="" width={18} height={18} />
        </button>
      </div>
      <div className="scroll-progress" aria-hidden="true"><div ref={progressRef} /></div>
    </header>
  );
}

// ── inicio ───────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <div className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-orb hero-orb--pink" aria-hidden="true" />
      <div className="hero-orb hero-orb--blue" aria-hidden="true" />
      <img src={logoNeon} alt="" width={104} height={104} className="hero-logo" fetchPriority="high" />
      <h1 className="hero-title">
        <span className="neon-text">GRANIZADOS</span>
        <span className="hero-title-sep">-</span>
        <span className="neon-text neon-text--blue">COCKTAILS</span>
      </h1>
      <p className="hero-tagline">Los mejores granizados de Tuluá y Buga</p>
      <div className="hero-ctas">
        <a className="btn-neon" href="#menu">Ver menú</a>
        <a className="btn-ghost" href="#sucursales">Sucursales</a>
      </div>
    </div>
  );
}

function PromoCard({ promo, onAdd }: { promo: Promo; onAdd: AddHandler }) {
  const style = { "--promo-color": promo.color, "--promo-ink": promo.color === "#0066FF" ? "#fff" : "#000" } as CSSProperties;
  return (
    <article className="promo-card" style={style}>
      <span className="promo-day">{promo.day}</span>
      <span className="promo-image">
        <img src={promo.photo} alt={promo.alt} width={320} height={420} loading="lazy" decoding="async" />
      </span>
      {promo.product && (
        <button type="button" className="add-btn stretched promo-add" onClick={() => onAdd(promo.product!)}
          aria-label={`Agregar ${promo.product.name} al pedido`}>
          <Icon name="plus" size={16} strokeWidth={2.5} />
          <span>Agregar</span>
        </button>
      )}
    </article>
  );
}

function ProductCard({ product, onAdd, compact = false }: { product: Product; onAdd: AddHandler; compact?: boolean }) {
  const [added, setAdded] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const multi = product.variants.length > 1;

  const handle = () => {
    onAdd(product);
    if (!multi) {
      setAdded(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setAdded(false), 1400);
    }
  };

  return (
    <article className={`product-card${compact ? " product-card--compact" : ""}${added ? " is-added" : ""}`}>
      {product.photo && (
        <div className={`product-media${product.tall ? " product-media--tall" : ""}${product.glow ? " product-media--glow" : ""}`}>
          <img src={product.photo} alt="" width={300} height={product.tall ? 450 : 400} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <div className="product-foot">
          <div className="price-with-badge">
            <span className="price">{priceLabel(product)}</span>
          </div>
          <button type="button" className="add-btn stretched" onClick={handle}
            aria-label={`${multi ? "Elegir opción de" : "Agregar"} ${product.name} al pedido, ${priceLabel(product)}`}>
            <Icon name={added ? "check" : "plus"} size={16} strokeWidth={2.5} />
            <span>{added ? "Listo" : "Agregar"}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function GranizadoCard({ product, onAdd }: { product: Product; onAdd: AddHandler }) {
  const [variantId, setVariantId] = useState<string | null>(null);
  const variant = variantId ? product.variants.find((v) => v.id === variantId) : undefined;
  const photo = variant?.photo ?? (variantId === "full" ? product.photo : product.idlePhoto ?? product.photo);
  const glow = variantId !== "full" && !!photo;

  return (
    <article className="product-card">
      {photo && (
        <div className={`product-media${product.tall ? " product-media--tall" : ""}${glow ? " product-media--glow" : ""}`}>
          <img src={photo} alt="" width={300} height={product.tall ? 450 : 400} loading="lazy" decoding="async" />
        </div>
      )}
      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-desc">{product.desc}</p>
        <div className="product-foot">
          <div className="variant-price-buttons" role="group" aria-label={`Precio de ${product.name}`}>
            {product.variants.map((v) => (
              <button key={v.id} type="button" className="variant-price-button" aria-pressed={variantId === v.id}
                onClick={(e) => { e.stopPropagation(); setVariantId((current) => current === v.id ? null : v.id); }}>
                {fmtK(v.price)}
              </button>
            ))}
          </div>
          <button type="button" className="add-btn stretched" onClick={() => onAdd(product, variantId ?? undefined)}
            aria-label={`${variant ? "Elegir opción de" : "Agregar"} ${product.name}${variant ? `, ${fmtK(variant.price)}` : ""}`}>
            <Icon name="plus" size={16} strokeWidth={2.5} />
            <span>Agregar</span>
          </button>
        </div>
      </div>
    </article>
  );
}

function SectionInicio({ onAdd }: { onAdd: AddHandler }) {
  return (
    <section id="inicio" className="section section--inicio" aria-label="Inicio">
      <Hero />

      <div className="section-inner">
        <Reveal>
          <SectionHeading id="promos-title" eyebrow="Cada semana" title="Promociones" />
        </Reveal>
        <Reveal delay={60}>
          <div className="rail rail--promos" role="list" aria-labelledby="promos-title">
            {promos.map((p) => (
              <div role="listitem" key={p.day} className="rail-item">
                <PromoCard promo={p} onAdd={onAdd} />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <SectionHeading id="rec-title" eyebrow="Los favoritos" title="Recomendados">
            <span className="section-heading-subtitle">(VASO 14 ONZAS)</span>
          </SectionHeading>
        </Reveal>
        <Reveal delay={60}>
          <div className="rail rail--products" role="list" aria-labelledby="rec-title">
            {recommended.map((p) => (
              <div role="listitem" key={p.id} className="rail-item">
                <ProductCard product={p} onAdd={onAdd} compact />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ── menú ─────────────────────────────────────────────────────────────────────
function MenuRow({ product, onAdd }: { product: Product; onAdd: AddHandler }) {
  return (
    <li className="menu-row">
      <div className="menu-row-text">
        <span className="menu-row-name">{product.name}</span>
        {product.desc && <span className="menu-row-desc">{product.desc}</span>}
      </div>
      <span className="menu-row-price">{priceLabel(product)}</span>
      <button type="button" className="row-add-btn" onClick={() => onAdd(product)}
        aria-label={`Agregar ${product.name} (${product.context ?? ""}) al pedido, ${priceLabel(product)}`}>
        <Icon name="plus" size={16} strokeWidth={2.5} />
      </button>
    </li>
  );
}

const SEARCHABLE: { product: Product; haystack: string }[] = [...CATALOG.values()].map((p) => ({
  product: p,
  haystack: normalize(`${p.name} ${p.desc} ${p.context ?? ""} ${p.variants.map((v) => v.label).join(" ")}`),
}));

function SectionMenu({ onAdd }: { onAdd: AddHandler }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);
    if (!tokens.length) return null;
    return SEARCHABLE.filter((s) => tokens.every((t) => s.haystack.includes(t))).map((s) => s.product);
  }, [query]);

  return (
    <section id="menu" className="section" aria-labelledby="menu-title">
      <div className="section-inner">
        <Reveal>
          <SectionHeading id="menu-title" eyebrow="Arma tu pedido" title="Menú" />
        </Reveal>

        {results ? (
          <div className="search-results">
            {results.length ? (
              <ul className="menu-rows">
                {results.map((p) => <MenuRow key={p.id} product={p} onAdd={onAdd} />)}
              </ul>
            ) : (
              <p className="empty-note">No encontramos “{query}”. Prueba con otro sabor o licor.</p>
            )}
          </div>
        ) : (
          <>
            <div className="menu-panel">
              <h3 className="price-notice-title menu-subtitle">MENÚ GRANIZADOS</h3>
              <div className="price-notice">
                <h3 className="price-notice-title">PRECIOS GRANIZADOS (VASO 14 ONZAS)</h3>
                <dl className="price-notice-list">
                  <div><dt>Gomas</dt><dd>15K</dd></div>
                  <div><dt>Gomas, perlas explosivas, frutas</dt><dd>18K</dd></div>
                  <div><dt>Cremosos</dt><dd>18K</dd></div>
                  <div><dt>Recomendados</dt><dd>20K</dd></div>
                </dl>
              </div>

              {granizadoCategories.map((category) => (
                <section key={category.id} className="menu-category" aria-labelledby={`menu-category-${category.id}`}>
                  <h3 id={`menu-category-${category.id}`} className="price-notice-title">{category.label}</h3>
                  <div className="product-grid">
                    {category.items.map((p, i) => (
                      <div key={p.id} className="grid-item" style={{ "--i": i } as CSSProperties}>
                        {p.variants.some((v) => v.id === "gomas") && p.variants.some((v) => v.id === "full")
                          ? <GranizadoCard product={p} onAdd={onAdd} />
                          : <ProductCard product={p} onAdd={onAdd} />}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

// ── sucursales ───────────────────────────────────────────────────────────────
function BranchMap({ branch }: { branch: Branch }) {
  const [ref, inView] = useInView<HTMLDivElement>("300px");
  return (
    <div ref={ref} className="map-frame">
      {inView ? (
        <iframe title={`Mapa de la sede ${branch.name}: ${branch.address}`} src={mapsEmbedUrl(branch)}
          loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="map-placeholder" aria-hidden="true"><Icon name="pin" size={28} /></div>
      )}
    </div>
  );
}

function SectionSucursales({ statuses, onOrderHere }: { statuses: Record<BranchId, OpenStatus>; onOrderHere: (id: BranchId) => void }) {
  return (
    <section id="sucursales" className="section" aria-labelledby="sucursales-title">
      <div className="section-inner">
        <Reveal>
          <SectionHeading id="sucursales-title" eyebrow="Visítanos" title="Sucursales" />
        </Reveal>
        <div className="branch-grid">
          {BRANCH_IDS.map((id, i) => {
            const b = BRANCHES[id];
            return (
              <Reveal key={id} delay={i * 80}>
                <article className="branch-card" aria-labelledby={`branch-${id}`}>
                  <header className="branch-head">
                    <img src={iconEdificio} alt="" width={28} height={28} className="theme-icon" />
                    <div>
                      <h3 id={`branch-${id}`} className="branch-name">{b.name.toUpperCase()}</h3>
                      <p className="branch-tag">{b.tag}</p>
                    </div>
                    <StatusPill status={statuses[id]} />
                  </header>

                  <BranchMap branch={b} />

                  <address className="branch-address">
                    <span className="label">Dirección</span>
                    <strong>{b.address}</strong>
                    <span>{b.city}</span>
                  </address>

                  <div className="branch-links">
                    <a className="btn-outline" href={mapsSearchUrl(b)} target="_blank" rel="noopener noreferrer">
                      <Icon name="pin" size={16} /> Ir a Google Maps<span className="sr-only"> (abre en una pestaña nueva)</span>
                    </a>
                    <a className="btn-outline" href={mapsDirectionsUrl(b)} target="_blank" rel="noopener noreferrer">
                      <Icon name="route" size={16} /> Cómo llegar<span className="sr-only"> (abre en una pestaña nueva)</span>
                    </a>
                  </div>

                  <div className="schedule">
                    <h4 className="label">Horario</h4>
                    <dl>
                      {SCHEDULE_DAY_ORDER.map((day) => {
                        const row = BRANCH_SCHEDULE[id][day];
                        return <div key={`${row.label}-${day}`}><dt>{row.label}</dt><dd>{row.hours}</dd></div>;
                      })}
                    </dl>
                  </div>

                  <button type="button" className="btn-wa" onClick={() => onOrderHere(id)}>
                    <MaskIcon src={iconWA} size={18} /> Pedir a {b.name} · {fmtPhone(b.whatsapp)}
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── redes ────────────────────────────────────────────────────────────────────
function SectionRedes({ onOpenWhatsApp }: { onOpenWhatsApp: () => void }) {
  return (
    <section id="redes" className="section section--redes" aria-labelledby="redes-title">
      <div className="section-inner">
        <Reveal>
          <div className="redes-hero">
            <img src={logoNeon} alt="" width={80} height={80} loading="lazy" className="redes-logo" />
            <SectionHeading id="redes-title" eyebrow="Comunidad" title="Síguenos">
              <p className="section-lead">Conoce todo de Granizados-Cocktails: promociones, nuevos sabores y más.</p>
            </SectionHeading>
          </div>
        </Reveal>

        <ul className="social-grid">
          {socials.map((s, i) => (
            <li key={s.id}>
              <Reveal delay={i * 60}>
                <a className="social-card" href={s.url} target="_blank" rel="noopener noreferrer" style={{ "--social-color": s.color } as CSSProperties}>
                  <span className={`social-icon${s.backdrop ? " social-icon--backdrop" : ""}`}>
                    <img src={s.icon} alt="" width={44} height={44} loading="lazy" />
                  </span>
                  <span className="social-name">{s.name}</span>
                  <span className="social-handle">{s.handle}</span>
                  <span className="social-followers">{s.followers} <span className="sr-only">seguidores</span></span>
                  <span className="social-cta">Síguenos<span className="sr-only"> (abre en una pestaña nueva)</span></span>
                </a>
              </Reveal>
            </li>
          ))}
          <li>
            <Reveal delay={180}>
              <a className="social-card" href="#whatsapp" onClick={(e) => { e.preventDefault(); onOpenWhatsApp(); }} style={{ "--social-color": "#25D366" } as CSSProperties}>
                <span className="social-icon"><MaskIcon src={iconWA} color="#25D366" size={44} /></span>
                <span className="social-name">WhatsApp</span>
                <span className="social-handle">Sede Tuluá<br />{fmtPhone(BRANCHES.tulua.whatsapp)}</span>
                <span className="social-handle">Sede Buga<br />{fmtPhone(BRANCHES.buga.whatsapp)}</span>
                <span className="social-cta">Escríbenos</span>
              </a>
            </Reveal>
          </li>
        </ul>
      </div>
    </section>
  );
}

// ── selector de variante ─────────────────────────────────────────────────────
function VariantPicker({ product, initialVariantId, status, onClose, onConfirm }: {
  product: Product | null; initialVariantId?: string; status: OpenStatus; onClose: () => void; onConfirm: (p: Product, variantId: string, qty: number) => void;
}) {
  const [variantId, setVariantId] = useState("");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      setVariantId(initialVariantId && product.variants.some((v) => v.id === initialVariantId) ? initialVariantId : product.variants[0].id);
      setQty(1);
    }
  }, [product, initialVariantId]);

  const promo = product ? promos.find((p) => p.product?.id === product.id) : undefined;
  const variant = product?.variants.find((v) => v.id === variantId) ?? product?.variants[0];
  const variantPhoto = variant?.photo ?? product?.photo;

  return (
    <Sheet open={!!product} onClose={onClose} labelledBy="picker-title" className="sheet--picker">
      {product && variant && (
        <form onSubmit={(e) => { e.preventDefault(); onConfirm(product, variant.id, qty); }}>
          <div className="sheet-head">
            <h2 id="picker-title">{product.name}</h2>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar"><Icon name="close" /></button>
          </div>
          <div className="sheet-body">
            {variantPhoto && !promo && (
              <img className={`picker-photo${variant?.photo ? " product-media--glow" : ""}`} src={variantPhoto} alt="" width={120} height={160} />
            )}
            <p className="picker-desc">{product.desc}</p>
            {promo && status.sessionDay !== promo.weekday && (
              <p className="notice notice--warn">Esta promo aplica solo los {promo.day.toLowerCase()}.</p>
            )}

            {product.variants.length > 1 && (
              <fieldset className="options">
                <legend>Elige una opción</legend>
                {product.variants.map((v) => (
                  <label key={v.id} className="option">
                    <input type="radio" name="variant" value={v.id} checked={variantId === v.id} onChange={() => setVariantId(v.id)} />
                    <span className="option-label">{v.label}</span>
                    <span className="option-price">{money(v.price)}</span>
                  </label>
                ))}
              </fieldset>
            )}

            <div className="qty-row">
              <span id="picker-qty-label">Cantidad</span>
              <div className="stepper" role="group" aria-labelledby="picker-qty-label">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="Quitar uno"><Icon name="minus" size={16} /></button>
                <output aria-live="polite">{qty}</output>
                <button type="button" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} disabled={qty >= MAX_QTY} aria-label="Agregar uno"><Icon name="plus" size={16} /></button>
              </div>
            </div>
          </div>
          <div className="sheet-foot">
            <button type="submit" className="btn-primary">Agregar al pedido · {money(variant.price * qty)}</button>
          </div>
        </form>
      )}
    </Sheet>
  );
}

// ── pedido ───────────────────────────────────────────────────────────────────
type CartStep = "items" | "delivery" | "review";
const CART_STEPS: { id: CartStep; label: string }[] = [
  { id: "items", label: "Pedido" },
  { id: "delivery", label: "Entrega" },
  { id: "review", label: "Confirmar" },
];

function RadioCards<T extends string>({ legend, name, value, options, onChange }: {
  legend: string; name: string; value: T; options: { value: T; label: string; hint?: string }[]; onChange: (v: T) => void;
}) {
  return (
    <fieldset className="radio-cards">
      <legend>{legend}</legend>
      <div className="radio-cards-row">
        {options.map((o) => (
          <label key={o.value} className="radio-card">
            <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} />
            <span className="radio-card-label">{o.label}</span>
            {o.hint && <span className="radio-card-hint">{o.hint}</span>}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CartSheet({ open, onClose, cart, dispatch, order, setOrder, status }: {
  open: boolean; onClose: () => void; cart: CartLine[]; dispatch: Dispatch<CartAction>;
  order: OrderForm; setOrder: Dispatch<SetStateAction<OrderForm>>; status: OpenStatus;
}) {
  const items = cart.map(resolveLine).filter((l): l is ResolvedLine => l !== null);
  const total = items.reduce((sum, l) => sum + l.variant.price * l.quantity, 0);
  const [step, setStep] = useState<CartStep>("items");
  const [addressError, setAddressError] = useState(false);
  const [sent, setSent] = useState(false);
  const addressRef = useRef<HTMLTextAreaElement>(null);
  const freeDelivery = status.sessionDay === 4;
  const isDelivery = order.delivery === "domicilio";
  const branch = BRANCHES[order.branch];
  const canDeliver = items.length > 0;

  useEffect(() => {
    if (!open) {
      setSent(false);
      setAddressError(false);
      setStep("items");
    }
  }, [open]);

  useEffect(() => {
    if (!canDeliver && order.delivery === "domicilio") setOrder((o) => ({ ...o, delivery: "recoger" }));
  }, [canDeliver, order.delivery, setOrder]);

  const update = <F extends keyof OrderForm>(field: F, value: OrderForm[F]) => setOrder((o) => ({ ...o, [field]: value }));

  function send() {
    if (!items.length) return;
    if (isDelivery && order.address.trim().length < 5) {
      setAddressError(true);
      setStep("delivery");
      addressRef.current?.focus();
      return;
    }
    window.open(waChatUrl(branch, buildOrderWhatsAppMessage(items, order, freeDelivery)), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  /** Avanza de paso; en "entrega" valida la dirección antes de dejar pasar a "confirmar". */
  function goNext() {
    if (step === "items") { setStep("delivery"); return; }
    if (step === "delivery") {
      if (isDelivery && order.address.trim().length < 5) {
        setAddressError(true);
        addressRef.current?.focus();
        return;
      }
      setStep("review");
      return;
    }
    send();
  }

  function goBack() {
    setStep(step === "review" ? "delivery" : "items");
  }

  function goToMenu() {
    onClose();
    requestAnimationFrame(() => document.getElementById("menu")?.scrollIntoView());
  }

  const stepIndex = CART_STEPS.findIndex((s) => s.id === step);

  return (
    <Sheet open={open} onClose={onClose} labelledBy="cart-title" className="sheet--cart">
      <div className="sheet-head">
        <h2 id="cart-title"><Icon name="bag" size={22} /> Tu pedido</h2>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar pedido"><Icon name="close" /></button>
      </div>

      {!items.length ? (
        <div className="sheet-body cart-empty">
          <p>Tu pedido está vacío.</p>
          <p className="muted">Agrega granizados, cocteles o promos desde el menú.</p>
          <button type="button" className="btn-neon" onClick={goToMenu}>Ver menú</button>
        </div>
      ) : (
        <>
          <div className="cart-steps" role="list" aria-label="Pasos del pedido">
            {CART_STEPS.map((s, i) => {
              const state = i < stepIndex ? "done" : i === stepIndex ? "current" : "upcoming";
              return (
                <button key={s.id} type="button" role="listitem" className={`cart-step cart-step--${state}`}
                  disabled={state !== "done"} aria-current={state === "current" ? "step" : undefined}
                  onClick={() => setStep(s.id)}>
                  <span className="cart-step-dot" aria-hidden="true">{state === "done" ? <Icon name="check" size={12} strokeWidth={3} /> : i + 1}</span>
                  <span className="cart-step-label">{s.label}</span>
                </button>
              );
            })}
          </div>

          <div className="sheet-body">
            <div className="cart-step-panel" key={step}>
              {step === "items" && (
                <>
                  {!status.open && (
                    <p className="notice notice--warn">Ahora estamos cerrados. {status.detail}; puedes enviar tu pedido y te respondemos al abrir.</p>
                  )}

                  <fieldset className="branch-picker">
                    <legend>¿A qué sede envías el pedido?</legend>
                    <div className="radio-cards-row">
                      {BRANCH_IDS.map((id) => (
                        <label key={id} className="radio-card radio-card--branch">
                          <input type="radio" name="branch" value={id} checked={order.branch === id} onChange={() => update("branch", id)} />
                          <span className="radio-card-label">{BRANCHES[id].name}</span>
                          <span className="radio-card-hint">{fmtPhone(BRANCHES[id].whatsapp)}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <ul className="cart-list" aria-label="Productos en tu pedido">
                    {items.map((l) => {
                      const label = `${l.product.name}${l.variant.label ? `, ${l.variant.label}` : ""}`;
                      return (
                        <li key={`${l.productId}::${l.variantId}`} className="cart-line">
                          {(l.variant.photo ?? l.product.photo) ? (
                            <img src={l.variant.photo ?? l.product.photo} alt="" width={48} height={64}
                              className={l.variant.photo ? "product-media--glow" : undefined} />
                          ) : <img src={logoNeon} alt="" width={48} height={64} className="cart-thumb" />}
                          <div className="cart-line-info">
                            <span className="cart-line-name">{l.product.name}</span>
                            <span className="cart-line-meta">{[l.variant.label, l.product.context].filter(Boolean).join(" · ")}</span>
                            <span className="cart-line-price">{money(l.variant.price * l.quantity)}</span>
                          </div>
                          <div className="stepper" role="group" aria-label={`Cantidad de ${label}`}>
                            <button type="button" onClick={() => dispatch({ type: "setQty", productId: l.productId, variantId: l.variantId, quantity: l.quantity - 1 })}
                              aria-label={l.quantity === 1 ? `Eliminar ${label}` : `Quitar uno de ${label}`}>
                              <Icon name={l.quantity === 1 ? "trash" : "minus"} size={16} />
                            </button>
                            <output aria-live="polite">{l.quantity}</output>
                            <button type="button" disabled={l.quantity >= MAX_QTY}
                              onClick={() => dispatch({ type: "setQty", productId: l.productId, variantId: l.variantId, quantity: l.quantity + 1 })}
                              aria-label={`Agregar uno de ${label}`}>
                              <Icon name="plus" size={16} />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <button type="button" className="text-btn" onClick={() => dispatch({ type: "clear" })}>
                    <Icon name="trash" size={14} /> Vaciar pedido
                  </button>
                </>
              )}

              {step === "delivery" && (
                <>
                  <RadioCards legend="Entrega" name="delivery" value={order.delivery} onChange={(v) => update("delivery", v)}
                    options={[
                      ...(canDeliver
                        ? [{ value: "domicilio" as const, label: "Domicilio", hint: freeDelivery ? "¡Hoy jueves es gratis!" : "Valor según zona" }]
                        : []),
                      { value: "recoger", label: "Recoger en sede", hint: `Sede ${branch.name}` },
                    ]} />
                  {isDelivery && (
                    <div className="field">
                      <label htmlFor="order-address">Dirección de entrega <span aria-hidden="true">*</span></label>
                      <textarea id="order-address" ref={addressRef} rows={2} value={order.address} required
                        placeholder="Barrio, calle, número y referencia" autoComplete="street-address"
                        aria-invalid={addressError || undefined} aria-describedby={addressError ? "order-address-error" : undefined}
                        onChange={(e) => { update("address", e.target.value); if (addressError) setAddressError(false); }} />
                      {addressError && <p id="order-address-error" className="field-error">Escribe la dirección para el domicilio.</p>}
                    </div>
                  )}

                  <RadioCards legend="Método de pago" name="payment" value={order.payment} onChange={(v) => update("payment", v)}
                    options={[
                      { value: "cash", label: "Efectivo" },
                      { value: "transfer", label: "Transferencia", hint: "Te enviamos los datos" },
                    ]} />

                  <div className="field">
                    <label htmlFor="order-notes">Notas o indicaciones <span className="muted">(opcional)</span></label>
                    <textarea id="order-notes" rows={2} value={order.notes} onChange={(e) => update("notes", e.target.value)}
                      placeholder="Sabores de la promo, sin hielo, portería, etc." />
                  </div>
                </>
              )}

              {step === "review" && (
                <>
                  <ul className="cart-list cart-list--review" aria-label="Resumen de productos">
                    {items.map((l) => (
                      <li key={`${l.productId}::${l.variantId}`} className="cart-line cart-line--readonly">
                        {(l.variant.photo ?? l.product.photo) ? (
                          <img src={l.variant.photo ?? l.product.photo} alt="" width={48} height={64}
                            className={l.variant.photo ? "product-media--glow" : undefined} />
                        ) : <img src={logoNeon} alt="" width={48} height={64} className="cart-thumb" />}
                        <div className="cart-line-info">
                          <span className="cart-line-name">{l.product.name}</span>
                          <span className="cart-line-meta">{[l.variant.label, l.product.context].filter(Boolean).join(" · ")}</span>
                          <span className="cart-line-price">{money(l.variant.price * l.quantity)}</span>
                        </div>
                        <span className="cart-line-qty" aria-hidden="true">×{l.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <dl className="review-summary">
                    <div><dt>Sede</dt><dd>{branch.name}</dd></div>
                    <div><dt>Entrega</dt><dd>{isDelivery ? "Domicilio" : `Recoger en sede ${branch.name}`}</dd></div>
                    {isDelivery && <div><dt>Dirección</dt><dd>{order.address}</dd></div>}
                    <div><dt>Pago</dt><dd>{PAYMENT_LABEL[order.payment]}</dd></div>
                    {order.notes.trim() && <div><dt>Notas</dt><dd>{order.notes}</dd></div>}
                  </dl>

                  {!status.open && (
                    <p className="notice notice--warn">Ahora estamos cerrados. {status.detail}; puedes enviar tu pedido y te respondemos al abrir.</p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="sheet-foot">
            <div className="cart-total">
              <span>Total estimado</span>
              <strong>{money(total)}</strong>
            </div>
            <p className="muted small">{isDelivery && !freeDelivery ? "El domicilio se confirma por WhatsApp." : "Precio final confirmado por WhatsApp."}</p>
            {sent ? (
              <div className="sent-box" role="status">
                <p>¡Listo! Termina de enviar el mensaje en WhatsApp.</p>
                <div className="sent-actions">
                  <button type="button" className="btn-outline" onClick={send}>Abrir de nuevo</button>
                  <button type="button" className="btn-outline" onClick={() => { dispatch({ type: "clear" }); onClose(); }}>Vaciar pedido</button>
                </div>
              </div>
            ) : (
              <div className="sheet-foot-actions">
                {step !== "items" && (
                  <button type="button" className="btn-outline" onClick={goBack}>Atrás</button>
                )}
                {step === "review" ? (
                  <button type="button" className="btn-wa btn-wa--solid" onClick={goNext}>
                    <MaskIcon src={iconWA} size={20} /> Enviar pedido a {branch.name} por WhatsApp
                  </button>
                ) : (
                  <button type="button" className="btn-primary" onClick={goNext}>
                    {step === "items" ? "Continuar" : "Revisar pedido"}
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </Sheet>
  );
}

// ── WhatsApp flotante (chat directo por sede) ────────────────────────────────
function WhatsAppFloat({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onToggle(); };
    const onDown = (e: PointerEvent) => { if (!wrapRef.current?.contains(e.target as Node)) onToggle(); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, onToggle]);

  return (
    <div ref={wrapRef} className="wa-float-wrap">
      {open && (
        <div id="wa-menu" className="wa-menu">
          <p className="wa-menu-title">Chatea con una sede</p>
          {BRANCH_IDS.map((id) => (
            <a key={id} href={waChatUrl(BRANCHES[id])} target="_blank" rel="noopener noreferrer" onClick={onToggle}>
              <MaskIcon src={iconWA} color="var(--wa-text)" size={18} />
              <span>WhatsApp {BRANCHES[id].name}<small>{fmtPhone(BRANCHES[id].whatsapp)}</small></span>
            </a>
          ))}
        </div>
      )}
      <button type="button" className="wa-float" onClick={onToggle}
        aria-expanded={open} aria-controls="wa-menu" aria-label="Chatear por WhatsApp">
        <MaskIcon src={iconWA} color="#fff" size={28} />
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// 6. APP
// ═════════════════════════════════════════════════════════════════════════════

export default function App() {
  const { dark, toggle } = useTheme();
  const statuses = useOpenStatuses();
  const status = statuses.tulua;
  const bugaStatus = statuses.buga;
  const navbarStatus = getNavbarStatus(statuses);
  const [active, setActive] = useState("inicio");

  const [cart, dispatch] = useReducer(cartReducer, undefined, () => sanitizeCart(load<unknown>(CART_KEY, [])));
  const [order, setOrder] = useState<OrderForm>(loadOrder);
  const [cartOpen, setCartOpen] = useState(false);
  const [picker, setPicker] = useState<Product | null>(null);
  const [pickerVariantId, setPickerVariantId] = useState<string | undefined>();
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [whatsappOpen, setWhatsappOpen] = useState(false);

  useEffect(() => save(CART_KEY, cart), [cart]);
  useEffect(() => {
    const { notes: _notes, ...persist } = order;
    save(ORDER_KEY, persist);
  }, [order]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Scroll-spy: la sección que cruza el centro de la pantalla es la activa.
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const cartCount = cart.reduce((n, l) => n + l.quantity, 0);
  const cartTotal = cart.reduce((sum, l) => {
    const r = resolveLine(l);
    return r ? sum + r.variant.price * r.quantity : sum;
  }, 0);

  const addToCart = useCallback((product: Product, variantId: string, quantity = 1) => {
    dispatch({ type: "add", productId: product.id, variantId, quantity });
    const variant = product.variants.find((v) => v.id === variantId);
    setToast({ id: Date.now(), text: `${quantity > 1 ? `${quantity}× ` : ""}${product.name}${variant?.label ? ` (${variant.label})` : ""}` });
  }, []);

  const handleAdd = useCallback<AddHandler>((product, variantId) => {
    if (product.variants.length > 1 || promos.some((p) => p.product?.id === product.id)) {
      setPickerVariantId(variantId);
      setPicker(product);
    }
    else addToCart(product, product.variants[0].id);
  }, [addToCart]);

  const orderHere = useCallback((id: BranchId) => {
    setOrder((o) => ({ ...o, branch: id }));
    setCartOpen(true);
  }, []);

  return (
    <div className={`app-shell${cartCount ? " has-cart" : ""}`}>
      <a className="skip-link" href="#menu">Saltar al menú</a>

      <Header dark={dark} onToggleTheme={toggle} status={navbarStatus} active={active} cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <main id="contenido">
        <SectionInicio onAdd={handleAdd} />
        <SectionMenu onAdd={handleAdd} />
        <SectionSucursales statuses={{ tulua: status, buga: bugaStatus }} onOrderHere={orderHere} />
        <SectionRedes onOpenWhatsApp={() => setWhatsappOpen(true)} />
      </main>

      <footer className="app-footer">
        <img src={logoNeon} alt="" width={36} height={36} loading="lazy" />
        <p>GRANIZADOS-COCKTAILS © {new Date().getFullYear()} — Tuluá y Buga, Valle del Cauca</p>
      </footer>

      {cartCount > 0 && (
        <button type="button" className="cart-bar" onClick={() => setCartOpen(true)}>
          <span className="cart-bar-count" key={cartCount} aria-hidden="true">{cartCount}</span>
          <span className="cart-bar-label">Ver tu pedido <small>· pedido a {BRANCHES[order.branch].name}</small></span>
          <strong>{money(cartTotal)}</strong>
          <span className="sr-only">, {cartCount} productos</span>
        </button>
      )}

      <nav className="tab-bar" aria-label="Secciones">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="tab-item" aria-current={active === s.id ? "true" : undefined}>
            <img src={s.icon} alt="" width={22} height={22} />
            <span>{s.label}</span>
          </a>
        ))}
      </nav>

      <WhatsAppFloat open={whatsappOpen} onToggle={() => setWhatsappOpen((o) => !o)} />

      <div className="toast-region" role="status" aria-live="polite">
        {toast && (
          <div key={toast.id} className="toast">
            <Icon name="check" size={18} strokeWidth={2.5} />
            <span>Agregado: {toast.text}</span>
            <button type="button" onClick={() => { setToast(null); setCartOpen(true); }}>Ver tu pedido</button>
          </div>
        )}
      </div>

      <VariantPicker product={picker} initialVariantId={pickerVariantId} status={status} onClose={() => setPicker(null)}
        onConfirm={(p, v, q) => { addToCart(p, v, q); setPicker(null); }} />

      <CartSheet open={cartOpen} onClose={() => setCartOpen(false)} cart={cart} dispatch={dispatch}
        order={order} setOrder={setOrder} status={order.branch === "buga" ? bugaStatus : status} />
    </div>
  );
}
