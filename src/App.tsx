import { useState, useEffect, useRef } from "react";

// ── logos & ui icons ─────────────────────────────────────────────────────────
import logoNeon    from "@/imports/Logo .JPG.jpeg";
import logoBlanco  from "@/imports/logo-blanco.jpg.jpeg";
import iconCasa    from "@/imports/casa.png";
import iconEdificio from "@/imports/edificio-de-oficinas.png";
import iconRedes   from "@/imports/redes-sociales.png";
import iconMenu    from "@/imports/menu.png";
import iconIG      from "@/imports/instagram.png";
import iconWA      from "@/imports/whatsapp.png";
import iconTT      from "@/imports/tik-tok.png";
import iconFB      from "@/imports/facebook.png";
import iconMoon    from "@/imports/modo-nocturno.png";
import iconSun     from "@/imports/modo-claro.png";

// ── promo photos ─────────────────────────────────────────────────────────────
import promoJueves  from "@/imports/PROMO_JUEVES.jpeg";
import promoMartes  from "@/imports/PROMO_MARTES.jpeg";
import promoViernes from "@/imports/PROMO_VIERNES.jpg";

// ── product photos ────────────────────────────────────────────────────────────
import imgPocima    from "@/imports/LAPOCIMA.png";
import imgMexicano  from "@/imports/MEXICANO EDITADO.png";
import imgMangonada from "@/imports/MANGONADA.png";
import imgFresada   from "@/imports/FRESADA.png";
import imgCombi     from "@/imports/COMBICOMPLETA.png";
import imgNocheArdiente from "@/imports/NOCHE_ARDIENTE.png";
import imgMoraAzul      from "@/imports/MORA AZUL.png";
import imgFrutosRojos   from "@/imports/FRUTOS_ROJOS-INTENSOS.png";
import imgMaracumango   from "@/imports/MARACUMANGO.png";
import imgSmirnoff      from "@/imports/SMIRNOFF.png";
import imgPanteraRosa   from "@/imports/PANTERA_ROSA.png";
import imgJagermeister  from "@/imports/JÁGERMEISTER.png";
import imgMiamiNight    from "@/imports/MIAMI_NIGHT.png";
import imgMargarita     from "@/imports/MARGARITA_TEQUILA.png";
import imgCremosoBaileys from "@/imports/CREMOSO_BAILEYS.jpeg";
import imgChicle        from "@/imports/CHICLE.png";
import imgMangomanzana  from "@/imports/MANGOMANZANA.png";

// ── theme ─────────────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", !dark);
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

// ── helpers ───────────────────────────────────────────────────────────────────
function isOpenNow() {
  const now  = new Date();
  const day  = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;

  // Closing hour expressed past midnight (24+) for days that stay open into the next day.
  const closingHour = (d: number) => (d === 5 ? 25 : d === 6 ? 26 : 24); // Viernes 1AM, Sábado 2AM

  // Still inside today's own 4PM–midnight window.
  if (hour >= 16 && hour < 24) return true;

  // Early morning: still inside yesterday's overnight extension (e.g. Sábado 00:30 counts
  // as Viernes' session, which runs until 1AM).
  const prevDay = (day + 6) % 7;
  const prevClosing = closingHour(prevDay);
  if (prevClosing > 24 && hour < prevClosing - 24) return true;

  return false;
}

const WHATSAPP_NUMBER = "573117672353";

function orderWhatsAppLink(name: string, ingredients: string) {
  const message = `Hola! Quiero pedir un granizado:\n\n*${name}*\n${ingredients}\n\n¿Me confirman disponibilidad? Gracias!`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function promoWhatsAppLink(day: string, orderText?: string) {
  const dayLabel = day.charAt(0) + day.slice(1).toLowerCase();
  const message = orderText
    ? `Hola! ${orderText}. ¿Me confirman disponibilidad? Gracias!`
    : `Hola! Quiero aprovechar la promoción de los ${dayLabel}. ¿Me cuentan los detalles?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

const ICON_INACTIVE_DARK  = "brightness(0) invert(1)";
const ICON_ACTIVE_DARK    = "brightness(0) invert(1) sepia(1) saturate(6) hue-rotate(264deg)";
const ICON_INACTIVE_LIGHT = "brightness(0)";
const ICON_ACTIVE_LIGHT   = "brightness(0) sepia(1) saturate(6) hue-rotate(264deg)";

const socialIconFilter = (dark: boolean) =>
  dark ? "brightness(0) invert(1)" : "brightness(0)";

// ── data ──────────────────────────────────────────────────────────────────────
const promos = [
  {
    day: "MARTES",
    photo: promoMartes,
    color: "#FF00FF",
    border: "rgba(255,0,255,0.6)",
    orderText: "quiero la promo de 2 cremosos por 30.000",
  },
  {
    day: "JUEVES",
    photo: promoJueves,
    color: "#0066FF",
    border: "rgba(0,102,255,0.6)",
  },
  {
    day: "VIERNES",
    photo: promoViernes,
    color: "#FF00FF",
    border: "rgba(255,0,255,0.6)",
    orderText: "quiero la promo de 2 granizados por 20.000",
  },
];

const recommended = [
  {
    name: "LA POCIMA",
    photo: imgPocima,
    price: "20K",
    badge: "GRANIZADO FEST 2026",
    desc: "Mango biche manzana, Tequila, Four Loko, Jäger, Smirnoff Tamarindo",
    tags: ["CON LICOR"],
  },
  {
    name: "LA COMBI COMPLETA",
    photo: imgCombi,
    price: "20K",
    badge: null,
    desc: "Combinación deliciosa de todos los sabores",
    tags: ["CON LICOR"],
  },
  {
    name: "MEXICANO",
    photo: imgMexicano,
    price: "20K",
    badge: null,
    desc: "Tequila, Smirnoff de limón y chamoy",
    tags: ["CON LICOR"],
  },
  {
    name: "MANGONADA",
    photo: imgMangonada,
    price: "20K",
    badge: "CON O SIN LICOR",
    desc: "Michelada con salsa de chamoy mexicana, tajín y gomas enchiladas",
    tags: ["CON O SIN LICOR"],
  },
  {
    name: "FRESADA",
    photo: imgFresada,
    price: "20K",
    badge: "CON O SIN LICOR",
    desc: "Granizado de fresa con chamoy, tajín y gomas enchiladas",
    tags: ["CON O SIN LICOR"],
  },
];

type GranizadoItem = { name: string; ingredients: string; photo?: string };

const granizadoItems: Record<string, GranizadoItem[]> = {
  licor: [
    { name: "NOCHE ARDIENTE", ingredients: "Jägermeister, Bombombun, Tequila, Four loko", photo: imgNocheArdiente },
    { name: "MORA AZUL", ingredients: "Blueberry, Vodka", photo: imgMoraAzul },
    { name: "FRUTOS ROJOS", ingredients: "Bombombun, Fresa, Whisky", photo: imgFrutosRojos },
    { name: "MARACUMANGO", ingredients: "Mango, Maracuyá, Tequila", photo: imgMaracumango },
    { name: "SMIRNOFF", ingredients: "Lula, Smirnoff, Vodka", photo: imgSmirnoff },
    { name: "PANTERA ROSA", ingredients: "Champagne, Nüvo, Vodka", photo: imgPanteraRosa },
    { name: "JÄGERMEISTER", ingredients: "Naranja, Jägermeister, Whisky", photo: imgJagermeister },
    { name: "MIAMI NIGHT", ingredients: "Uva, Triple sec, Tequila", photo: imgMiamiNight },
    { name: "MARGARITA TEQUILA", ingredients: "Cereza, Maracuyá, Tequila", photo: imgMargarita },
    { name: "MANGOMANZANA", ingredients: "Mango biche manzana, Tequila, Four Loko", photo: imgMangomanzana },
  ],
  sinLicor: [
    { name: "FRUTOS INTENSOS", ingredients: "Fresa, Bombombun", photo: imgFrutosRojos },
    { name: "CHICLE", ingredients: "Sirop de Chicle", photo: imgChicle },
  ],
  cremosos: [
    { name: "CREMOSO DE BAILEYS", ingredients: "Licor de café, Baileys, Amaretto", photo: imgCremosoBaileys },
  ],
};

type CocktailCategory = { title: string; items: { name: string; price?: string; description?: string }[] };

const cocktailColumns: CocktailCategory[][] = [
  [
    { title: "CERVEZAS", items: [
      { name: "Poker, A. Light, A. Original, Budweiser", price: "6K" },
      { name: "Coronita", price: "9K" },
      { name: "Club Colombia", price: "7K" },
      { name: "Smirnoff", price: "13K" },
    ] },
    { title: "ENVENENADAS", items: [
      { name: "Frutos Rojos / Tequila", price: "16K" },
      { name: "Frutos Amarillos / Vodka", price: "16K" },
      { name: "Frutos Verdes / Whisky", price: "16K" },
    ] },
    { title: "MICHELADAS", items: [
      { name: "Micheladas con Fruta", description: "Mango Biche, Maracuyá, Cerezada" },
      { name: "Cerveza Nacional", price: "14K" },
      { name: "Cerveza Importada", price: "16K" },
    ] },
    { title: "COCKTAILS", items: [
      { name: "ORGASMO", price: "22K", description: "Crema de Baileys, amaretto y licor de café" },
      { name: "TEQUILA SUNRISE", price: "20K", description: "Jugo de naranja, tequila, triple sec y granadina" },
      { name: "MARGARITA CLÁSICA", price: "18K", description: "Tequila, triple sec y limón" },
      { name: "MARGARITA CON FRUTA", price: "20K" },
      { name: "CUBA LIBRE", price: "18K", description: "Ron blanco, coca cola, limón y almíbar" },
      { name: "MOJITO CLÁSICO", price: "18K", description: "Ron blanco, ginger, hojas de hierbabuena, limón y almíbar" },
      { name: "FRUTOS ROJOS / AMARILLOS", price: "20K" },
      { name: "LIMONADA ELÉCTRICA", price: "22K", description: "Tequila, vodka, ginebra, ron blanco, curaçao azul y limón" },
      { name: "MARTINE", price: "18K", description: "Licor ginebra, vermouth y aceitunas" },
      { name: "SEX ON THE BEACH", price: "22K", description: "Vodka, licor de durazno, zumo de naranja, jugo de arándanos" },
      { name: "GIN TONIC", price: "18K", description: "Ginebra, agua tónica, limón y romero" },
    ] },
  ],
  [
    { title: "NEVERAS EXPLOSIVAS (GRANIZADAS)", items: [
      { name: "LA TENTADORA (3-4 PERSONAS)", price: "40K", description: "Granizado de preferencia, 2 coronitas, jeringas de licor, gomas y dulces" },
      { name: "LA PECADORA (3-4 PERSONAS)", price: "70K", description: "Granizado de preferencia, 2 coronitas, jeringas de licor, gomas y dulces" },
      { name: "LA PROHIBIDA (5-6 PERSONAS)", price: "100K", description: "Granizado de preferencia, 1 four loko, jeringas de licor, gomas y dulces" },
    ] },
    { title: "GRANIZADO BOMBA", items: [
      { name: "FRESA BOOM O MANGO PARTY", description: "Granizado con licor, coronita o smirnoff, fruta picada, rodajas de naranja, perlas explosivas, paleta de corazón" },
      { name: "CON CORONITA", price: "22K" },
      { name: "CON SMIRNOFF", price: "26K" },
    ] },
    { title: "PECERAS LOCAS (LIQUIDAS)", items: [
      { name: "LA EXÓTICA (3 PERSONAS)", price: "50K", description: "2 coronitas o 1 smirnoff, whisky, ron, limón, maracuyá, soda y dulces" },
      { name: "LA MÍSTICA (3 PERSONAS)", price: "60K", description: "Four loko, whisky, tequila, vodka, limón, mango, zumo de naranja, sirope Maracuyá, soda y dulces" },
      { name: "NIGHT LOCA (6 PERSONAS)", price: "75K", description: "Four loko, tequila, vodka, whisky, ron, maracuyá, mango, limón, rodajas de naranja, zumo de naranja, soda y dulces" },
    ] },
    { title: "MICHELADAS SODIFICADAS", items: [
      { name: "Frutos Rojos (cereza)", price: "12K" },
      { name: "Frutos Verdes (mango)", price: "12K" },
      { name: "Frutos Amarillos (maracuyá)", price: "12K" },
    ] },
    { title: "OTRAS BEBIDAS", items: [
      { name: "Four Loko", price: "20K" },
      { name: "Botella de Agua", price: "3K" },
      { name: "Gatorade", price: "6K" },
      { name: "Coca Cola", price: "5K" },
      { name: "Bretaña Personal", price: "5K" },
    ] },
  ],
];

const socials = [
  { name: "granizados_tulua",    handle: "granizados_tulua",    followers: "+4K", icon: iconIG,  color: "#E1306C", glow: "rgba(225,48,108,0.5)", url: "https://www.instagram.com/granizados_tulua?stkn=MTI2OGR0NDV0eXdobQ==", invert: false, ctaLabel: "Síguenos" },
  { name: "@granizados.tulua",   handle: "@granizados.tulua",   followers: "+1K", icon: iconTT,  color: "#FF00FF", glow: "rgba(255,0,255,0.5)",  url: "https://www.tiktok.com/@granizados.tulua?_r=1&_t=ZS-99cZZDFaVbb", invert: true, ctaLabel: "Síguenos" },
  { name: "Granizados Tulúa",    handle: "Granizados Tulúa",    followers: "+1K", icon: iconFB,  color: "#0066FF", glow: "rgba(0,102,255,0.5)",  url: "https://www.facebook.com/share/1DhQAddCnE/?mibextid=wwXIfr", invert: false, ctaLabel: "Síguenos" },
  { name: "WhatsApp",            handle: "",           followers: "", icon: iconWA, color: "#25D366", glow: "rgba(37,211,102,0.5)", url: "https://wa.me/573117672353", invert: false, ctaLabel: "Escríbenos" },
];

const tabs = [
  { id: "inicio",     label: "Inicio",     icon: iconCasa     },
  { id: "menu",       label: "Menú",       icon: iconMenu     },
  { id: "sucursales", label: "Sucursales", icon: iconEdificio },
  { id: "redes",      label: "Redes",      icon: iconRedes    },
];

// ── reusable size selector ────────────────────────────────────────────────────
function SizeSelector() {
  const [sel, setSel] = useState("M");
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {["P", "M", "G"].map((s) => (
        <button key={s} className={`size-dot${sel === s ? " selected" : ""}`} onClick={() => setSel(s)}>{s}</button>
      ))}
    </div>
  );
}

// ── sections ──────────────────────────────────────────────────────────────────

function SectionInicio() {
  return (
    <section id="inicio" style={{ paddingBottom: 32 }}>

      {/* ── Hero ── */}
      <div style={{ background: "var(--hero-bg)", padding: "28px 20px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,0,255,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,102,255,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
        <img src={logoNeon} alt="Granizados Cocktails" className="logo-animate"
          style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", margin: "0 auto 12px", display: "block" }} />
        <h1 className="shimmer-text"
          style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 3, color: "var(--text-primary)", margin: "0 0 4px", lineHeight: 1.1 }}>
          GRANIZADOS-COCKTAILS
        </h1>
        <div className="text-glow-blue"
          style={{ fontFamily: "var(--font-sub)", fontSize: 12, fontWeight: 600, color: "var(--blue-neon)", marginBottom: 10, letterSpacing: 2 }}>
          SINCE 2025
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.5 }}>
          LOS MEJORES GRANIZADOS DE TULÚA Y BUGA
        </p>
        <button className="btn-neon" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
          Ver Menú
        </button>
      </div>

      {/* ── Promociones Semanales ── */}
      <div style={{ padding: "22px 20px 0" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2, marginBottom: 12, color: "var(--text-primary)" }}>
          PROMOCIONES SEMANALES
        </h2>
      </div>
      <div className="carousel-container">
        {promos.map((p) => {
          const orderable = p.day !== "JUEVES";
          return (
          <div key={p.day} style={{ position: "relative", flex: "0 0 auto", width: 160, scrollSnapAlign: "start", paddingTop: 12 }}>
            {/* day badge, hangs above the card's border */}
            <div style={{
              position: "absolute", top: 0, left: 12, zIndex: 1,
              background: p.color, color: "#000",
              borderRadius: 20, padding: "5px 14px",
              fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700,
              letterSpacing: 3, boxShadow: `0 0 14px ${p.color}`,
            }}>
              {p.day}
            </div>
            {/* image box: only the photo, same height for every promo so they stay flush */}
            <div className="product-card promo-card"
              style={{ position: "relative", overflow: "hidden", border: `1.5px solid ${p.border}`, boxShadow: `0 0 16px ${p.color}50`, width: "100%", cursor: orderable ? "pointer" : "default" }}
              onClick={() => {
                if (!orderable) return;
                window.open(promoWhatsAppLink(p.day, p.orderText), "_blank", "noopener,noreferrer");
              }}
            >
              <div className="product-image-container promo-image-container" style={{ position: "relative" }}>
                <img src={p.photo} alt={p.day} className="product-image" />
                {/* overlay */}
                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.100)" }} />
                {/* text */}
                <div style={{ position: "absolute", inset: 0, padding: "16px", display: "flex", flexDirection: "column", gap: 5, justifyContent: "flex-end" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, color: "#fff", lineHeight: 1.15 }}></div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "rgba(255,255,255,0.8)" }}></div>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* ── Recomendados ── */}
      <div style={{ padding: "22px 20px 0" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2, marginBottom: 12, color: "var(--text-primary)" }}>
          RECOMENDADOS
        </h2>
      </div>
      <div className="carousel-container">
        {recommended.map((item) => (
          <div key={item.name} className="product-card"
            style={{
              borderRadius: 16,
              overflow: "hidden",
              border: "1.5px solid var(--border-card)",
              boxShadow: "var(--shadow-card)",
              background: "var(--bg-card)",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0,
              cursor: "pointer",
            }}
            onClick={() => window.open(orderWhatsAppLink(item.name, item.desc), "_blank", "noopener,noreferrer")}
          >
            {/* product photo */}
            <div className="product-image-container" style={{ flexShrink: 0 }}>
              <img
                src={item.photo}
                alt={item.name}
                className="product-image"
              />
            </div>
            {/* card body */}
            <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 16, letterSpacing: 1, color: "var(--text-primary)", lineHeight: 1.1 }}>{item.name}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.4, flex: 1 }}>{item.desc}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                <span className="price" style={{ fontSize: 15 }}>{item.price}</span>
                <span style={{ background: "rgba(255,0,255,0.12)", border: "1px solid rgba(255,0,255,0.35)", borderRadius: 12, padding: "2px 7px", fontSize: 8, fontFamily: "var(--font-sub)", fontWeight: 700, color: "var(--fucsia)" }}>
                  RECOMENDADO
                </span>
              </div>
              {item.badge && (
                <div style={{
                  display: "block", width: "100%",
                  background: "var(--fucsia)", color: "#fff",
                  borderRadius: 8, padding: "3px 8px",
                  fontFamily: "var(--font-sub)", fontWeight: 700,
                  fontSize: 8, textAlign: "center",
                  boxShadow: "var(--neon-fucsia)",
                  letterSpacing: 0.5,
                }}>
                  {item.badge}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.4)", borderRadius: 20, padding: "4px 10px", width: "100%" }}>
                <div style={{ width: 16, height: 16, backgroundColor: "#25D366", WebkitMaskImage: `url(${iconWA})`, maskImage: `url(${iconWA})`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />
                <span style={{ fontFamily: "var(--font-sub)", fontSize: 9, fontWeight: 700, color: "#25D366" }}>PEDIR</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionSucursales() {
  const open = isOpenNow();
  return (
    <section id="sucursales" style={{ padding: "24px 20px 32px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 3, marginBottom: 20, color: "var(--text-primary)" }}>SUCURSALES</h1>

      {/* ── Tulúa ── */}
      <div className="card" style={{ marginBottom: 16, borderColor: "rgba(255,0,255,0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <img src={iconEdificio} alt="Sucursal" style={{ width: 26, height: 26, filter: "var(--icon-filter-inactive)", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, color: "var(--fucsia)", textShadow: "var(--text-neon-fucsia)" }}>TULÚA</div>
            <div style={{ fontFamily: "var(--font-sub)", fontSize: 10, color: "var(--text-muted)" }}>Sede Principal</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: open ? "rgba(0,255,136,0.1)" : "rgba(255,51,68,0.1)", border: `1px solid ${open ? "#00FF88" : "#FF3344"}`, borderRadius: 20, padding: "4px 10px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: open ? "#00FF88" : "#FF3344", boxShadow: `0 0 6px ${open ? "#00FF88" : "#FF3344"}`, display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-sub)", fontSize: 9, fontWeight: 700, color: open ? "#00FF88" : "#FF3344" }}>{open ? "ABIERTO" : "CERRADO"}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div style={{ marginBottom: 12, padding: "10px 12px", background: "var(--hero-bg)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
          <div style={{ fontFamily: "var(--font-sub)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 1 }}>Dirección</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>CRA 27A #41 - 07 AV/CALI</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-secondary)" }}>Tulúa, Valle del Cauca</div>
        </div>

        {/* Schedule */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font-sub)", fontSize: 10, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Horario</div>
          {[["Lun – Jue","4:00 PM – 12:00 AM"],["Viernes","4:00 PM – 1:00 AM"],["Sábado","4:00 PM – 2:00 AM"],["Domingo","4:00 PM – 12:00 AM"]].map(([d,h]) => (
            <div key={d} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: 12, padding: "3px 0", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--fucsia)", fontWeight: 600 }}>{d}</span><span>{h}</span>
            </div>
          ))}
        </div>

      </div>

      {/* ── Buga ── */}
      <div className="card" style={{ borderColor: "rgba(255,0,255,0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <img src={iconEdificio} alt="Sucursal" style={{ width: 26, height: 26, filter: "var(--icon-filter-inactive)", flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, color: "var(--fucsia)", textShadow: "var(--text-neon-fucsia)" }}>BUGA</div>
            <div style={{ fontFamily: "var(--font-sub)", fontSize: 10, color: "var(--text-muted)" }}>Nueva Sede</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: open ? "rgba(0,255,136,0.1)" : "rgba(255,51,68,0.1)", border: `1px solid ${open ? "#00FF88" : "#FF3344"}`, borderRadius: 20, padding: "4px 10px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: open ? "#00FF88" : "#FF3344", boxShadow: `0 0 6px ${open ? "#00FF88" : "#FF3344"}`, display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-sub)", fontSize: 9, fontWeight: 700, color: open ? "#00FF88" : "#FF3344" }}>{open ? "ABIERTO" : "CERRADO"}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div style={{ marginBottom: 12, padding: "10px 12px", background: "var(--hero-bg)", borderRadius: 10, border: "1px solid var(--border-subtle)" }}>
          <div style={{ fontFamily: "var(--font-sub)", fontSize: 10, color: "var(--text-muted)", marginBottom: 3, textTransform: "uppercase", letterSpacing: 1 }}>Dirección</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>Calle 1 #10-47 Estambul</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-secondary)" }}>Buga, Valle del Cauca</div>
        </div>

        {/* Schedule */}
        <div>
          <div style={{ fontFamily: "var(--font-sub)", fontSize: 10, color: "var(--text-muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Horario</div>
          {[["Lun – Jue","4:00 PM – 12:00 AM"],["Viernes","4:00 PM – 1:00 AM"],["Sábado","4:00 PM – 2:00 AM"],["Domingo","4:00 PM – 12:00 AM"]].map(([d,h]) => (
            <div key={d} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: 12, padding: "3px 0", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--fucsia)", fontWeight: 600 }}>{d}</span><span>{h}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionRedes({ dark }: { dark: boolean }) {
  const iconF   = socialIconFilter(dark);
  const textC   = dark ? "#fff"                   : "#111";
  const textSub = dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)";
  const textFt  = dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)";
  const cardBg  = dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  return (
    <section id="redes" style={{ background: "var(--social-section-bg)", padding: "28px 20px 32px", transition: "background 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <img src={logoNeon} alt="logo" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", margin: "0 auto 12px", display: "block", boxShadow: dark ? "0 0 20px rgba(255,0,255,0.5)" : "none" }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: textC, letterSpacing: 3, textShadow: dark ? "0 0 15px rgba(255,0,255,0.6)" : "none" }}>SÍGUENOS</h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: textSub, marginTop: 4 }}>
          CONOCE TODO DE GRANIZADOS-COCKTAILS, PROMOCIONES, NUEVOS SABORES Y MÁS. 
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {socials.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", height: "100%" }}>
            <div className="social-card" style={{ borderColor: s.color, boxShadow: dark ? `0 0 15px ${s.glow}` : `0 2px 12px rgba(0,0,0,0.1)`, background: cardBg }}>
              <div style={{
                width: 48, height: 48, borderRadius: s.invert ? 12 : 0, display: "flex", alignItems: "center", justifyContent: "center",
                background: s.invert ? "#fff" : "transparent",
                boxShadow: s.invert ? (dark ? `0 0 14px ${s.glow}` : "0 2px 10px rgba(0,0,0,0.15)") : "none",
              }}>
                <img src={s.icon} alt={s.name}
                  style={{ width: 48, height: 48, objectFit: "contain", filter: s.invert ? "none" : iconF }} />
              </div>
              <div style={{ fontFamily: "var(--font-sub)", fontSize: 14, fontWeight: 700, color: dark ? s.color : "#111", textShadow: dark ? `0 0 8px ${s.glow}` : "none" }}>{s.name}</div>
              {s.handle && <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: textSub }}>{s.handle}</div>}
              {s.followers && <div style={{ fontFamily: "var(--font-price)", fontSize: 14, color: dark ? s.color : "#111", fontWeight: 700 }}>{s.followers}</div>}
              <div style={{ background: dark ? s.color : "#000", color: "#fff", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontFamily: "var(--font-sub)", fontWeight: 700, boxShadow: dark ? `0 0 10px ${s.glow}` : "none", marginTop: 4 }}>
                {s.ctaLabel}
              </div>
            </div>
          </a>
        ))}
      </div>

      <div style={{ marginTop: 28, textAlign: "center", fontFamily: "var(--font-body)", fontSize: 11, color: textFt }}>
        © 2025 GRANIZADOS-COCKTAILS — Tulúa, Colombia
      </div>
    </section>
  );
}

const cremososFlavors = ["Milo", "Oreo", "Café", "Chocorramo"];

function SectionMenu() {
  const [menuView, setMenuView] = useState<"granizados" | "cocteleria">("granizados");
  const [cat, setCat] = useState("licor");
  const [flavorPicker, setFlavorPicker] = useState(false);
  const cats = [
    { id: "licor", label: "CON LICOR" },
    { id: "sinLicor", label: "SIN LICOR" },
    { id: "cremosos", label: "CREMOSOS" },
  ];
  const items = granizadoItems[cat] ?? [];

  return (
    <section id="menu" style={{ padding: "24px 20px 120px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 3, marginBottom: 14, color: "var(--text-primary)" }}>MENÚ</h1>

      <div className="menu-view-tabs">
        <button className={`menu-view-tab${menuView === "granizados" ? " active" : ""}`} onClick={() => setMenuView("granizados")}>
          MENÚ GRANIZADOS
        </button>
        <button className={`menu-view-tab${menuView === "cocteleria" ? " active" : ""}`} onClick={() => setMenuView("cocteleria")}>
          MENÚ COCTELERÍA, BEBIDAS Y MÁS
        </button>
      </div>

      {menuView === "granizados" ? (
        <>
          <div className="menu-price-notice">
            <div className="menu-price-title">PRECIOS GRANIZADOS</div>
            <div className="menu-price-list">
              <span>GOMAS <strong>15K</strong></span>
              <span>GOMAS, PERLAS EXPLOSIVAS, FRUTAS <strong>18K</strong></span>
              <span>CREMOSOS <strong>18K</strong></span>
              <span>RECOMENDADOS <strong>20K</strong></span>
            </div>
          </div>

          <div className="menu-sub-tabs">
            {cats.map((c) => (
              <button key={c.id} className={`cat-tab${cat === c.id ? " active-fucsia" : ""}`} onClick={() => setCat(c.id)}>
                {c.label}
              </button>
            ))}
          </div>

          <div className="menu-product-grid">
            {items.map((item) => (
              <div
                key={item.name}
                className="card menu-product-card"
                style={{ cursor: "pointer" }}
                onClick={() => window.open(orderWhatsAppLink(item.name, item.ingredients), "_blank", "noopener,noreferrer")}
              >
                <div className="menu-product-image">
                  <img src={item.photo ?? logoNeon} alt={item.name} />
                </div>
                <div className="menu-product-name">{item.name}</div>
                <div className="menu-product-ingredients">{item.ingredients}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 6, background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.4)", borderRadius: 20, padding: "4px 10px", width: "100%" }}>
                  <div style={{ width: 16, height: 16, backgroundColor: "#25D366", WebkitMaskImage: `url(${iconWA})`, maskImage: `url(${iconWA})`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />
                  <span style={{ fontFamily: "var(--font-sub)", fontSize: 9, fontWeight: 700, color: "#25D366" }}>PEDIR</span>
                </div>
              </div>
            ))}
            {cat === "cremosos" && (
              <div className="cremosos-text-card" style={{ cursor: "pointer" }} onClick={() => setFlavorPicker(true)}>
                <div className="menu-product-name">CREMOSOS SIN LICOR</div>
                <div className="menu-product-ingredients">Milo · Oreo · Café · Chocorramo</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "rgba(37,211,102,0.12)", border: "1px solid rgba(37,211,102,0.4)", borderRadius: 20, padding: "4px 10px", width: "100%" }}>
                  <div style={{ width: 16, height: 16, backgroundColor: "#25D366", WebkitMaskImage: `url(${iconWA})`, maskImage: `url(${iconWA})`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />
                  <span style={{ fontFamily: "var(--font-sub)", fontSize: 9, fontWeight: 700, color: "#25D366" }}>ELEGIR SABOR Y PEDIR</span>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="cocktail-menu-panel">
          <div className="cocktail-menu-heading">
            <div className="menu-product-name">COCTELERÍA, BEBIDAS Y MÁS</div>
            <button className="cocktail-back-button" onClick={() => setMenuView("granizados")}>VOLVER</button>
          </div>
          <div className="cocktail-columns">
            {cocktailColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="cocktail-column">
                {column.map((category) => (
                  <div key={category.title} className="cocktail-category">
                    <h2>{category.title}</h2>
                    <div className="cocktail-items">
                      {category.items.map((item) => (
                        <div key={`${category.title}-${item.name}`} className="cocktail-item">
                          <div className="cocktail-item-line">
                            <strong>{item.name}</strong>
                            {item.price && <span>{item.price}</span>}
                          </div>
                          {item.description && <div className="cocktail-description">{item.description}</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {flavorPicker && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20 }}
          onClick={() => setFlavorPicker(false)}
        >
          <div
            style={{ background: "var(--bg-card)", border: "1.5px solid var(--fucsia)", borderRadius: 16, padding: 20, width: "100%", maxWidth: 320, boxShadow: "0 0 30px rgba(255,0,255,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: 18, color: "var(--text-primary)", letterSpacing: 1, marginBottom: 4 }}>
              ELIGE TU SABOR
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-secondary)", marginBottom: 14 }}>
              CREMOSOS SIN LICOR
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {cremososFlavors.map((flavor) => (
                <button
                  key={flavor}
                  onClick={() => {
                    setFlavorPicker(false);
                    window.open(orderWhatsAppLink("CREMOSO SIN LICOR", `Sabor: ${flavor}`), "_blank", "noopener,noreferrer");
                  }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: "var(--hero-bg)", border: "1px solid var(--border-subtle)", borderRadius: 10,
                    padding: "10px 14px", fontFamily: "var(--font-sub)", fontSize: 13, fontWeight: 700,
                    color: "var(--text-primary)", cursor: "pointer",
                  }}
                >
                  {flavor}
                  <div style={{ width: 18, height: 18, backgroundColor: "#25D366", WebkitMaskImage: `url(${iconWA})`, maskImage: `url(${iconWA})`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" }} />
                </button>
              ))}
            </div>
            <button
              onClick={() => setFlavorPicker(false)}
              style={{ marginTop: 14, width: "100%", background: "transparent", border: "1px solid var(--border-subtle)", borderRadius: 10, padding: "8px", fontFamily: "var(--font-sub)", fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", cursor: "pointer" }}
            >
              CANCELAR
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

// ── WhatsApp float ────────────────────────────────────────────────────────────
// TODO: reemplazar por el número real de WhatsApp de Buga cuando esté disponible.
const WHATSAPP_NUMBER_BUGA = "573117672353";

function WhatsAppFloat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 98 }}
          onClick={() => setOpen(false)}
        />
      )}

      {open && (
        <div style={{
          position: "fixed", bottom: 142, right: 16, zIndex: 99,
          display: "flex", flexDirection: "column", gap: 8,
          background: "var(--bg-card)", border: "1px solid rgba(37,211,102,0.4)",
          borderRadius: 14, padding: 10, boxShadow: "0 0 20px rgba(37,211,102,0.3)",
          minWidth: 170,
        }}>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", padding: "8px 10px", borderRadius: 10, background: "var(--hero-bg)", fontFamily: "var(--font-sub)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
            <img src={iconWA} alt="" style={{ width: 18, height: 18, filter: "brightness(0) saturate(100%) invert(64%) sepia(59%) saturate(478%) hue-rotate(93deg) brightness(93%) contrast(92%)" }} />
            WhatsApp Tulúa
          </a>
          <a href={`https://wa.me/${WHATSAPP_NUMBER_BUGA}`} target="_blank" rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", padding: "8px 10px", borderRadius: 10, background: "var(--hero-bg)", fontFamily: "var(--font-sub)", fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
            <img src={iconWA} alt="" style={{ width: 18, height: 18, filter: "brightness(0) saturate(100%) invert(64%) sepia(59%) saturate(478%) hue-rotate(93deg) brightness(93%) contrast(92%)" }} />
            WhatsApp Buga
          </a>
        </div>
      )}

      <button
        className="whatsapp-float"
        onClick={() => setOpen((o) => !o)}
        aria-label="WhatsApp"
        style={{ border: "none" }}
      >
        <img src={iconWA} alt="WhatsApp" style={{ width: 28, height: 28, filter: "brightness(0) invert(1)" }} />
      </button>
    </>
  );
}

// ── app shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState("inicio");
  const scrollRef = useRef<HTMLDivElement>(null);

  const iconInactive = dark ? ICON_INACTIVE_DARK  : ICON_INACTIVE_LIGHT;
  const iconActive   = dark ? ICON_ACTIVE_DARK    : ICON_ACTIVE_LIGHT;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--icon-filter-inactive",
      dark ? ICON_INACTIVE_DARK : ICON_INACTIVE_LIGHT
    );
    document.documentElement.style.setProperty(
      "--icon-filter-active",
      dark ? ICON_ACTIVE_DARK : ICON_ACTIVE_LIGHT
    );
  }, [dark]);

  useEffect(() => {
    const sectionIds = ["inicio", "menu", "sucursales", "redes"];
    const observers: IntersectionObserver[] = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTab(id); },
        { root: scrollRef.current, threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function handleTabClick(id: string) {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const open = isOpenNow();

  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", height: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg-primary)", position: "relative", overflow: "hidden", transition: "background 0.5s ease" }}>

      {/* ── Header ── */}
      <header className="app-header" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <img src={logoBlanco} alt="Granizados Cocktails Tulúa"
          style={{ height: 38, maxWidth: 180, objectFit: "contain", objectPosition: "left", filter: dark ? "none" : "invert(1)", transition: "filter 0.5s ease", flexShrink: 0 }} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: open ? "rgba(0,255,136,0.1)" : "rgba(255,51,68,0.08)", border: `1px solid ${open ? "#00FF88" : "#FF3344"}`, borderRadius: 20, padding: "3px 8px" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: open ? "#00FF88" : "#FF3344", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-sub)", fontSize: 8, fontWeight: 700, color: open ? "#00FF88" : "#FF3344", whiteSpace: "nowrap" }}>
              {open ? "ABIERTO" : "CERRADO"}
            </span>
          </div>
          <button className="theme-toggle" onClick={toggle} aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}>
            <img src={dark ? iconSun : iconMoon} alt={dark ? "Modo claro" : "Modo oscuro"}
              style={{ width: 18, height: 18, filter: dark ? "brightness(0) invert(1)" : "brightness(0)", transition: "filter 0.4s ease" }} />
          </button>
        </div>
      </header>

      {/* ── Main scroll ── */}
      <main ref={scrollRef} className="main-scroll" style={{ flex: 1, overflowY: "auto", background: "var(--bg-primary)", transition: "background 0.5s ease" }}>
        <SectionInicio />
        <div style={{ height: 1, background: "var(--border-subtle)", margin: "0 20px" }} />
        <SectionMenu />
        <div style={{ height: 1, background: "var(--border-subtle)", margin: "0 20px" }} />
        <SectionSucursales />
        <div style={{ height: 1, background: "var(--border-subtle)", margin: "0 20px" }} />
        <SectionRedes dark={dark} />
      </main>

      {/* ── Footer ── */}
      <div style={{ textAlign: "center", padding: "5px", borderTop: "1px solid var(--border-subtle)", fontFamily: "var(--font-body)", fontSize: 9, color: "var(--text-muted)", background: "var(--bg-primary)", transition: "background 0.5s ease" }}>
        GRANIZADOS-COCKTAILS © 2025 — Tulúa, Colombia
      </div>

      {/* ── Tab bar ── */}
      <nav className="tab-bar">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button key={t.id} className={`tab-item${isActive ? " active" : ""}`} onClick={() => handleTabClick(t.id)}>
              <img src={t.icon} alt={t.label}
                style={{ width: 22, height: 22, objectFit: "contain", filter: isActive ? iconActive : iconInactive, transition: "filter 0.35s ease" }} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      <WhatsAppFloat />
    </div>
  );
}

