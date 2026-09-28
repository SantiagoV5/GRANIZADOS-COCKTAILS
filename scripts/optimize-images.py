"""Genera versiones WebP livianas de las imágenes de src/imports en src/imports/web/.

Uso:  python3 scripts/optimize-images.py
Correrlo cada vez que se agregue o reemplace una foto; App.tsx importa las .webp.
"""
from pathlib import Path
from PIL import Image

SRC = Path(__file__).resolve().parent.parent / "src" / "imports"
OUT = SRC / "web"
OUT.mkdir(exist_ok=True)

# nombre original -> (nombre de salida, ancho máximo en px)
IMAGES = {
    "Logo .JPG.jpeg": ("logo-neon", 256),
    "logo-blanco.jpg.jpeg": ("logo-blanco", 520),
    "PROMO_JUEVES.jpeg": ("promo-jueves", 640),
    "PROMO_MARTES.jpeg": ("promo-martes", 640),
    "PROMO_VIERNES.jpg": ("promo-viernes", 640),
    "LAPOCIMA.png": ("la-pocima", 600),
    "MEXICANO EDITADO.png": ("mexicano", 600),
    "MANGONADA.png": ("mangonada", 600),
    "FRESADA.png": ("fresada", 600),
    "COMBICOMPLETA.png": ("combi-completa", 600),
    "NOCHE_ARDIENTE.png": ("noche-ardiente", 600),
    "MORA AZUL.png": ("mora-azul", 600),
    "FRUTOS_ROJOS-INTENSOS.png": ("frutos-rojos", 600),
    "MARACUMANGO.png": ("maracumango", 600),
    "SMIRNOFF.png": ("smirnoff", 600),
    "PANTERA_ROSA.png": ("pantera-rosa", 600),
    "JÁGERMEISTER.png": ("jagermeister", 600),
    "MIAMI_NIGHT.png": ("miami-night", 600),
    "MARGARITA_TEQUILA.png": ("margarita-tequila", 600),
    "CREMOSO_BAILEYS.jpeg": ("cremoso-baileys", 600),
    "CHICLE.png": ("chicle", 600),
    "MANGOMANZANA.png": ("mangomanzana", 600),
    # íconos (transparentes, se usan como máscara/filtro)
    "casa.png": ("icon-casa", 96),
    "edificio-de-oficinas.png": ("icon-edificio", 96),
    "redes-sociales.png": ("icon-redes", 96),
    "menu.png": ("icon-menu", 96),
    "instagram.png": ("icon-instagram", 128),
    "whatsapp.png": ("icon-whatsapp", 128),
    "tik-tok.png": ("icon-tiktok", 128),
    "facebook.png": ("icon-facebook", 128),
    "modo-nocturno.png": ("icon-moon", 64),
    "modo-claro.png": ("icon-sun", 64),
}

# Logos blancos sobre fondo negro: se convierten a blanco con transparencia (alfa = luminancia)
# para que no se vea el recuadro negro sobre el header translúcido.
LUMA_TO_ALPHA = {"logo-blanco.jpg.jpeg"}

for name, (out, max_w) in IMAGES.items():
    im = Image.open(SRC / name)
    if name in LUMA_TO_ALPHA:
        alpha = im.convert("L")
        im = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im.putalpha(alpha)
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    dest = OUT / f"{out}.webp"
    if im.mode == "RGBA" and name not in LUMA_TO_ALPHA:
        im.save(dest, "WEBP", lossless=True, method=6)
    else:
        im.save(dest, "WEBP", quality=85, method=6, alpha_quality=90)
    print(f"{name:32} -> {dest.name:24} {im.size} {dest.stat().st_size // 1024} KB")
