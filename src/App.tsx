import { useState, useEffect, useRef } from "react";

// ── asset imports ────────────────────────────────────────────────────────────
import logoNeon   from "@/imports/Logo .JPG.jpeg";
import logoBlanco from "@/imports/logo-blanco.jpg.jpeg";
import iconCasa       from "@/imports/casa.png";
import iconEdificio    from "@/imports/edificio-de-oficinas.png";
import iconRedes       from "@/imports/redes-sociales.png";
import iconMenu        from "@/imports/menu.png";
import iconIG          from "@/imports/instagram.png";
import iconWA          from "@/imports/whatsapp.png";
import iconTT          from "@/imports/tik-tok.png";
import iconFB          from "@/imports/facebook.png";
import iconMoon        from "@/imports/modo-nocturno.png";
import iconSun         from "@/imports/modo-claro.png";

// ── theme hook ───────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", !dark);
  }, [dark]);
  return { dark, toggle: () => setDark((d) => !d) };
}

// ── helpers ──────────────────────────────────────────────────────────────────
function isOpenNow() {
  const now  = new Date();
  const day  = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const close = day === 5 ? 25 : day === 6 ? 26 : 24;
  return hour >= 16 && hour < close;
}

// Tab bar PNG icon needs colour inversion in dark mode.
// Active tab uses a fucsia tint filter.
const ICON_INACTIVE_DARK   = "brightness(0) invert(1)";
const ICON_ACTIVE_DARK     = "brightness(0) invert(1) sepia(1) saturate(6) hue-rotate(264deg)";
const ICON_INACTIVE_LIGHT  = "brightness(0)";   // pure black
const ICON_ACTIVE_LIGHT    = "brightness(0) sepia(1) saturate(6) hue-rotate(264deg)"; // fucsia on light

// Social icons are black→white in dark, black on light; use tinted colour per network
const socialIconFilter = (dark: boolean) =>
  dark ? "brightness(0) invert(1)" : "brightness(0)";

// ── data ─────────────────────────────────────────────────────────────────────
const promos = [
  { day: "MARTES",  title: "2 CREMOSOS",      desc: "x $30.000",                       color: "#0066FF", border: "rgba(0,102,255,0.55)" },
  { day: "JUEVES",  title: "DOMI GRATIS",     desc: "en pedidos seleccionados",         color: "#FF00FF", border: "rgba(255,0,255,0.55)" },
  { day: "VIERNES", title: "2×$20k | 3×$30k", desc: "4×$40.000 — ¡Mejor precio!",     color: "#FF00FF", border: "rgba(255,0,255,0.55)" },
];

const featured = [
  { name: "La Pócima",  desc: "Granizado con licor, sabor misterioso",    price: "$20.000", badge: true  },
  { name: "Mangonada",  desc: "Granizado con licor, mango y chamoy",       price: "$20.000", badge: false },
  { name: "Fresada",    desc: "Granizado con licor, fresa y crema",        price: "$20.000", badge: false },
];

const menuItems: Record<string, { name: string; price: string }[]> = {
  licor: [
    { name: "La Pócima",       price: "$20.000" },
    { name: "Mangonada",       price: "$20.000" },
    { name: "Fresada",         price: "$20.000" },
    { name: "Limonada Spiked", price: "$18.000" },
    { name: "Maracuyá Mix",    price: "$18.000" },
    { name: "Sandía Neon",     price: "$20.000" },
  ],
  sinLicor: [
    { name: "Limonada Clásica", price: "$15.000" },
    { name: "Maracuyá Fresh",   price: "$15.000" },
    { name: "Fresa Natural",    price: "$15.000" },
    { name: "Uva Splendor",     price: "$15.000" },
    { name: "Naranja Burst",    price: "$15.000" },
    { name: "Mora Splash",      price: "$15.000" },
  ],
  cremosos: [
    { name: "Cremoso Fresa",     price: "$18.000" },
    { name: "Cremoso Maracuyá",  price: "$18.000" },
    { name: "Cremoso Mango",     price: "$18.000" },
    { name: "Cremoso Lulo",      price: "$18.000" },
  ],
};

const socials = [
  { name: "Instagram", handle: "@granizadoscocktails", followers: "+2K", icon: iconIG,  color: "#E1306C", glow: "rgba(225,48,108,0.5)", url: "https://instagram.com" },
  { name: "TikTok",    handle: "@granizadoscocktails", followers: "+2K", icon: iconTT,  color: "#FF00FF", glow: "rgba(255,0,255,0.5)",  url: "https://tiktok.com", invert: true },
  { name: "Facebook",  handle: "Granizados Cocktails", followers: "+2K", icon: iconFB,  color: "#0066FF", glow: "rgba(0,102,255,0.5)",  url: "https://facebook.com" },
  { name: "WhatsApp",  handle: "+57 300 000 0000",     followers: "Escríbenos", icon: iconWA, color: "#25D366", glow: "rgba(37,211,102,0.5)", url: "https://wa.me/573000000000" },
];

const tabs = [
  { id: "inicio",     label: "Inicio",     icon: iconCasa     },
  { id: "sucursales", label: "Sucursales", icon: iconEdificio },
  { id: "redes",      label: "Redes",      icon: iconRedes    },
  { id: "menu",       label: "Menú",       icon: iconMenu     },
];

// ── sub-components ────────────────────────────────────────────────────────────

function SizeSelector() {
  const [sel, setSel] = useState("M");
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {["P", "M", "G"].map((s) => (
        <button
          key={s}
          className={`size-dot${sel === s ? " selected" : ""}`}
          onClick={() => setSel(s)}
        >
          {s}
        </button>
      ))}
    </div>
  );
}

function ProductCard({ item }: { item: typeof featured[0] }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {item.badge && (
        <div className="badge-glow" style={{ background: "var(--fucsia)", color: "#fff", borderRadius: 10, padding: "5px 8px", fontSize: 9, fontFamily: "var(--font-sub)", fontWeight: 700, lineHeight: 1.3, textAlign: "center" }}>
          Granizado Fest 2026
        </div>
      )}
      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 10, background: "linear-gradient(135deg,rgba(255,0,255,0.15),rgba(0,102,255,0.1))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={logoNeon} alt={item.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", opacity: 0.8 }} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 15, letterSpacing: 0.5, color: "var(--text-primary)" }}>{item.name}</div>
      <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-secondary)", lineHeight: 1.3 }}>{item.desc}</div>
      <div className="price" style={{ fontSize: 13 }}>{item.price}</div>
      <SizeSelector />
      <div style={{ background: "rgba(255,0,255,0.1)", border: "1px solid rgba(255,0,255,0.3)", borderRadius: 20, padding: "2px 8px", fontSize: 9, fontFamily: "var(--font-sub)", fontWeight: 700, color: "var(--fucsia)", textAlign: "center" }}>
        Recomendado
      </div>
    </div>
  );
}

function MenuCard({ item }: { item: { name: string; price: string } }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ width: "100%", aspectRatio: "1", borderRadius: 10, background: "linear-gradient(135deg,rgba(255,0,255,0.12),rgba(0,102,255,0.08))", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img src={iconMenu} alt="" style={{ width: 36, height: 36, filter: "var(--icon-filter-inactive)" }} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 14, letterSpacing: 0.5, color: "var(--text-primary)" }}>{item.name}</div>
      <div className="price" style={{ fontSize: 13 }}>{item.price}</div>
      <SizeSelector />
    </div>
  );
}

// ── sections ──────────────────────────────────────────────────────────────────

function SectionInicio() {
  const open = isOpenNow();
  return (
    <section id="inicio" style={{ paddingBottom: 32 }}>
      {/* Hero */}
      <div style={{ background: "var(--hero-bg)", padding: "28px 20px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,0,255,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "radial-gradient(circle,rgba(0,102,255,0.15) 0%,transparent 70%)", pointerEvents: "none" }} />
        <img src={logoNeon} alt="Granizados Cocktails" className="logo-animate" style={{ width: 84, height: 84, borderRadius: "50%", objectFit: "cover", margin: "0 auto 12px", display: "block" }} />
        <h1 className="shimmer-text" style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 3, color: "var(--text-primary)", margin: "0 0 4px", lineHeight: 1.1 }}>
          GRANIZADOS-COCKTAILS
        </h1>
        <div className="text-glow-blue" style={{ fontFamily: "var(--font-sub)", fontSize: 12, fontWeight: 600, color: "var(--blue-neon)", marginBottom: 10, letterSpacing: 2 }}>
          SINCE 2025
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", marginBottom: 20, lineHeight: 1.5 }}>
          Sabor, Frescura y Diversión en cada sorbo
        </p>
        <button className="btn-neon" onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}>
          Ver Menú
        </button>
      </div>

      {/* Promos */}
      <div style={{ padding: "22px 20px 0" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2, marginBottom: 12, color: "var(--text-primary)" }}>
          PROMOCIONES SEMANALES
        </h2>
      </div>
      <div className="promo-track" style={{ paddingLeft: 20, paddingRight: 20 }}>
        {promos.map((p) => (
          <div key={p.day} className="promo-card" style={{ background: p.color === "#0066FF" ? "var(--promo-bg-blue)" : "var(--promo-bg-fucsia)", border: `1.5px solid ${p.border}`, boxShadow: `0 0 15px ${p.color}40` }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: 2, color: p.color, fontWeight: 700 }}>{p.day}</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 19, letterSpacing: 1, color: "var(--text-primary)", lineHeight: 1.2 }}>{p.title}</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 11, color: "var(--text-secondary)" }}>{p.desc}</div>
          </div>
        ))}
      </div>

      {/* Featured */}
      <div style={{ padding: "22px 20px 0" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 2, marginBottom: 12, color: "var(--text-primary)" }}>
          LOS MÁS PEDIDOS
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {featured.map((item) => <ProductCard key={item.name} item={item} />)}
        </div>
      </div>

      {/* Schedule */}
      <div style={{ margin: "22px 20px 0", background: "var(--schedule-bg)", borderRadius: 16, padding: 20, border: "1px solid rgba(255,0,255,0.3)", boxShadow: "0 0 20px rgba(255,0,255,0.1)" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 17, color: "#fff", letterSpacing: 2, marginBottom: 12 }}>HORARIO TULÚA</div>
        {[["Lun – Jue","4:00 PM – 12:00 AM"],["Viernes","4:00 PM – 1:00 AM"],["Sábado","4:00 PM – 2:00 AM"],["Domingo","4:00 PM – 12:00 AM"]].map(([d,h]) => (
          <div key={d} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,255,255,0.75)", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <span style={{ color: "rgba(255,0,255,0.85)" }}>{d}</span><span>{h}</span>
          </div>
        ))}
        <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: open ? "#00FF88" : "#FF3344", boxShadow: `0 0 8px ${open ? "#00FF88" : "#FF3344"}`, display: "inline-block", flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-sub)", fontSize: 12, fontWeight: 600, color: open ? "#00FF88" : "#FF3344" }}>
            {open ? "Abierto ahora" : "Cerrado ahora"}
          </span>
        </div>
      </div>
    </section>
  );
}

function SectionSucursales() {
  const open = isOpenNow();
  return (
    <section id="sucursales" style={{ padding: "24px 20px 32px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 3, marginBottom: 20, color: "var(--text-primary)" }}>SUCURSALES</h1>

      {/* Tulúa card */}
      <div className="card" style={{ marginBottom: 16, borderColor: "rgba(255,0,255,0.35)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <img src={iconEdificio} alt="Sucursal" style={{ width: 28, height: 28, filter: "var(--icon-filter-inactive)" }} />
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 20, letterSpacing: 1, color: "var(--fucsia)", textShadow: "var(--text-neon-fucsia)" }}>TULÚA</div>
            <div style={{ fontFamily: "var(--font-sub)", fontSize: 11, color: "var(--text-muted)" }}>Sede Principal</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, background: open ? "rgba(0,255,136,0.1)" : "rgba(255,51,68,0.1)", border: `1px solid ${open ? "#00FF88" : "#FF3344"}`, borderRadius: 20, padding: "4px 10px" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: open ? "#00FF88" : "#FF3344", boxShadow: `0 0 6px ${open ? "#00FF88" : "#FF3344"}`, display: "inline-block" }} />
              <span style={{ fontFamily: "var(--font-sub)", fontSize: 9, fontWeight: 700, color: open ? "#00FF88" : "#FF3344" }}>{open ? "ABIERTO" : "CERRADO"}</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 10 }}>
          <div style={{ fontFamily: "var(--font-sub)", fontSize: 11, color: "var(--text-muted)", marginBottom: 3 }}>Dirección</div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-primary)" }}>Tulúa, Valle del Cauca, Colombia</div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font-sub)", fontSize: 11, color: "var(--text-muted)", marginBottom: 6 }}>Horario</div>
          {[["Lun – Jue","4:00 PM – 12:00 AM"],["Viernes","4:00 PM – 1:00 AM"],["Sábado","4:00 PM – 2:00 AM"],["Domingo","4:00 PM – 12:00 AM"]].map(([d,h]) => (
            <div key={d} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-body)", fontSize: 12, padding: "3px 0", borderBottom: "1px solid var(--border-subtle)", color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--fucsia)", fontWeight: 600 }}>{d}</span><span>{h}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-neon" style={{ flex: 1, padding: "10px", fontSize: 12 }}>Cómo llegar</button>
          <button className="btn-blue" style={{ flex: 1, padding: "10px", fontSize: 12 }}>Llamar</button>
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{ width: "100%", height: 160, background: "var(--hero-bg)", borderRadius: 16, border: "1px solid rgba(0,102,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        <img src={iconEdificio} alt="Mapa" style={{ width: 32, height: 32, filter: "var(--icon-filter-inactive)", opacity: 0.5 }} />
        <span style={{ fontFamily: "var(--font-sub)", fontSize: 12, color: "var(--text-muted)" }}>Tulúa, Valle del Cauca</span>
        <button className="btn-blue" style={{ padding: "7px 16px", fontSize: 11 }}>Abrir en Google Maps</button>
      </div>

      {/* Buga */}
      <div style={{ background: "var(--coming-soon-bg)", borderRadius: 16, padding: 24, border: "1.5px solid rgba(0,102,255,0.4)", boxShadow: "0 0 20px rgba(0,102,255,0.15)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--blue-neon)", textShadow: "var(--text-neon-blue)", letterSpacing: 2, marginBottom: 4, animation: "coming-soon-pulse 2s ease-in-out infinite" }}>BUGA</div>
        <div style={{ fontFamily: "var(--font-sub)", fontSize: 11, color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>Próxima Apertura</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "rgba(255,255,255,0.8)", marginBottom: 12 }}>Muy pronto en Buga</div>
        <div style={{ display: "inline-block", background: "rgba(0,102,255,0.2)", border: "1px solid rgba(0,102,255,0.5)", borderRadius: 20, padding: "6px 16px", fontFamily: "var(--font-sub)", fontSize: 12, color: "var(--blue-neon)", fontWeight: 600 }}>
          Próximamente 2025
        </div>
      </div>
    </section>
  );
}

function SectionRedes({ dark }: { dark: boolean }) {
  const iconF  = socialIconFilter(dark);
  const textC  = dark ? "#fff"                    : "#111";
  const textSub= dark ? "rgba(255,255,255,0.45)"  : "rgba(0,0,0,0.45)";
  const textFt = dark ? "rgba(255,255,255,0.25)"  : "rgba(0,0,0,0.3)";
  const cardBg = dark ? "rgba(255,255,255,0.04)"  : "rgba(0,0,0,0.03)";
  const nameShadow = (glow: string) => dark ? `0 0 8px ${glow}` : "none";
  const btnShadow  = (glow: string) => dark ? `0 0 10px ${glow}` : "none";
  const sectionGlow= dark ? "0 0 20px rgba(255,0,255,0.5)" : "none";

  return (
    <section id="redes" style={{ background: "var(--social-section-bg)", padding: "28px 20px 32px", transition: "background 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <img src={logoNeon} alt="logo" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", margin: "0 auto 12px", display: "block", boxShadow: sectionGlow }} />
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: textC, letterSpacing: 3, textShadow: dark ? "0 0 15px rgba(255,0,255,0.6)" : "none" }}>SÍGUENOS</h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: textSub, marginTop: 4 }}>
          Encuentra todo el contenido fresco aquí
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {socials.map((s) => (
          <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            <div
              className="social-card"
              style={{
                borderColor: s.color,
                boxShadow: dark ? `0 0 15px ${s.glow}` : `0 2px 12px rgba(0,0,0,0.1)`,
                background: cardBg,
              }}
            >
              <div style={{ width: 48, height: 48, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: s.invert && dark ? "#fff" : "transparent" }}>
                <img
                  src={s.icon}
                  alt={s.name}
                  style={{ width: s.invert ? 34 : 44, height: s.invert ? 34 : 44, filter: s.invert && dark ? "none" : iconF, objectFit: "contain" }}
                />
              </div>
              <div style={{ fontFamily: "var(--font-sub)", fontSize: 14, fontWeight: 700, color: dark ? s.color : "#111", textShadow: nameShadow(s.glow) }}>{s.name}</div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: textSub }}>{s.handle}</div>
              <div style={{ fontFamily: "var(--font-price)", fontSize: 14, color: dark ? s.color : "#111", fontWeight: 700 }}>{s.followers}</div>
              <div style={{ background: dark ? s.color : "#000", color: "#fff", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontFamily: "var(--font-sub)", fontWeight: 700, boxShadow: btnShadow(s.glow), marginTop: 4 }}>
                Síguenos
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

function SectionMenu() {
  const [cat, setCat] = useState("licor");
  const cats = [
    { id: "licor",    label: "Con Licor",  cls: "active-fucsia" },
    { id: "sinLicor", label: "Sin Licor",  cls: "active-blue"   },
    { id: "cremosos", label: "Cremosos",   cls: "active-gradient"},
  ];
  const items = menuItems[cat] ?? [];

  return (
    <section id="menu" style={{ padding: "24px 20px 120px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, letterSpacing: 3, marginBottom: 16, color: "var(--text-primary)" }}>MENÚ</h1>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none", marginBottom: 16 }}>
        {cats.map((c) => (
          <button key={c.id} className={`cat-tab${cat === c.id ? " " + c.cls : ""}`} onClick={() => setCat(c.id)}>
            {c.label}
          </button>
        ))}
      </div>

      {cat === "licor" && (
        <div className="badge-glow" style={{ background: "linear-gradient(135deg,rgba(255,0,255,0.12),rgba(0,0,0,0))", border: "1.5px solid var(--fucsia)", borderRadius: 14, padding: "12px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,0,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <img src={logoNeon} alt="La Pócima" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-sub)", fontSize: 10, fontWeight: 700, color: "var(--fucsia)", textTransform: "uppercase", letterSpacing: 1 }}>Granizado Fest 2026 · Tulúa</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 17, letterSpacing: 1, color: "var(--text-primary)" }}>La Pócima</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: 10, color: "var(--text-secondary)" }}>Participante destacado en el festival de granizados</div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14, fontSize: 11, fontFamily: "var(--font-sub)", color: "var(--text-muted)" }}>
        <span>Solo gomas: $15k</span><span>·</span><span>Completo: $18k</span><span>·</span><span>Especial: $20k</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {items.map((item) => <MenuCard key={item.name} item={item} />)}
      </div>
    </section>
  );
}

// ── WhatsApp float ────────────────────────────────────────────────────────────
function WhatsAppFloat() {
  return (
    <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="whatsapp-float" aria-label="WhatsApp">
      <img src={iconWA} alt="WhatsApp" style={{ width: 28, height: 28, filter: "brightness(0) invert(1)" }} />
    </a>
  );
}

// ── app shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const { dark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState("inicio");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Derive CSS filter values for tab icons
  const iconInactive = dark ? ICON_INACTIVE_DARK  : ICON_INACTIVE_LIGHT;
  const iconActive   = dark ? ICON_ACTIVE_DARK    : ICON_ACTIVE_LIGHT;

  // Expose icon filter to CSS via custom property so MenuCard and other components can use it
  useEffect(() => {
    document.documentElement.style.setProperty("--icon-filter-inactive", iconInactive);
    document.documentElement.style.setProperty("--icon-filter-active",   iconActive);
  }, [dark]);

  // IntersectionObserver — update active tab as user scrolls
  useEffect(() => {
    const sectionIds = ["inicio", "sucursales", "redes", "menu"];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveTab(id); },
        { root: scrollRef.current, threshold: 0.4 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // Tab click → smooth scroll to section
  function handleTabClick(id: string) {
    setActiveTab(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const open = isOpenNow();

  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", height: "100dvh", display: "flex", flexDirection: "column", background: "var(--bg-primary)", position: "relative", overflow: "hidden", transition: "background 0.5s ease" }}>

      {/* Header */}
      <header className="app-header" style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        {/* logo-blanco has white text on black — invert(1) in light mode gives black text on white */}
        <img
          src={logoBlanco}
          alt="Granizados Cocktails Tulúa"
          style={{
            height: 38,
            maxWidth: 180,
            objectFit: "contain",
            objectPosition: "left",
            filter: dark ? "none" : "invert(1)",
            transition: "filter 0.5s ease",
          }}
        />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          {/* Live status */}
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: open ? "rgba(0,255,136,0.1)" : "rgba(255,51,68,0.08)", border: `1px solid ${open ? "#00FF88" : "#FF3344"}`, borderRadius: 20, padding: "3px 8px" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: open ? "#00FF88" : "#FF3344", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-sub)", fontSize: 8, fontWeight: 700, color: open ? "#00FF88" : "#FF3344", whiteSpace: "nowrap" }}>
              {open ? "ABIERTO" : "CERRADO"}
            </span>
          </div>
          {/* Theme toggle — moon icon = switch to dark, sun = switch to light */}
          <button className="theme-toggle" onClick={toggle} aria-label={dark ? "Activar modo claro" : "Activar modo oscuro"}>
            <img
              src={dark ? iconSun : iconMoon}
              alt={dark ? "Modo claro" : "Modo oscuro"}
              style={{ width: 18, height: 18, filter: dark ? "brightness(0) invert(1)" : "brightness(0)", transition: "filter 0.4s ease" }}
            />
          </button>
        </div>
      </header>

      {/* Single-page scroll area */}
      <main ref={scrollRef} className="main-scroll" style={{ flex: 1, overflowY: "auto", background: "var(--bg-primary)", transition: "background 0.5s ease" }}>
        <SectionInicio />
        {/* Divider */}
        <div style={{ height: 1, background: "var(--border-subtle)", margin: "0 20px" }} />
        <SectionSucursales />
        <div style={{ height: 1, background: "var(--border-subtle)", margin: "0 20px" }} />
        <SectionRedes dark={dark} />
        <div style={{ height: 1, background: "var(--border-subtle)", margin: "0 20px" }} />
        <SectionMenu />
      </main>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "5px", borderTop: "1px solid var(--border-subtle)", fontFamily: "var(--font-body)", fontSize: 9, color: "var(--text-muted)", background: "var(--bg-primary)", transition: "background 0.5s ease" }}>
        GRANIZADOS-COCKTAILS © 2025 — Tulúa, Colombia
      </div>

      {/* Tab bar */}
      <nav className="tab-bar">
        {tabs.map((t) => {
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              className={`tab-item${isActive ? " active" : ""}`}
              onClick={() => handleTabClick(t.id)}
            >
              <img
                src={t.icon}
                alt={t.label}
                style={{
                  width: 22,
                  height: 22,
                  objectFit: "contain",
                  filter: isActive ? iconActive : iconInactive,
                  transition: "filter 0.35s ease",
                }}
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      <WhatsAppFloat />
    </div>
  );
}
