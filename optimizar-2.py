from pathlib import Path
from PIL import Image

base = Path("src/imports")
MAX = 1200
CALIDAD = 80
UMBRAL = 200 * 1024   # solo toca .webp de más de 200 KB

total_antes = total_despues = 0

# 1) Recomprimir .webp pesados (solo se reemplaza si queda más liviano)
for p in sorted(base.rglob("*.webp")):
    a = p.stat().st_size
    if a <= UMBRAL:
        continue
    img = Image.open(p)
    dims = img.size
    img.thumbnail((MAX, MAX), Image.LANCZOS)
    tmp = p.with_name(p.stem + "__tmp.webp")
    img.save(tmp, "WEBP", quality=CALIDAD, method=6)
    d = tmp.stat().st_size
    if d < a:
        tmp.replace(p)
        total_antes += a
        total_despues += d
        print(f"{p.name}: {dims} {a/1024:.0f} KB -> {img.size} {d/1024:.0f} KB")
    else:
        tmp.unlink()
        print(f"SIN CAMBIO (ya estaba liviano): {p.name}")

# 2) Favicon: 512 px máximo, sigue siendo PNG
fav = base / "web" / "favicon.png"
if fav.exists():
    a = fav.stat().st_size
    img = Image.open(fav).convert("RGBA")
    img.thumbnail((512, 512), Image.LANCZOS)
    img.save(fav, "PNG", optimize=True)
    d = fav.stat().st_size
    print(f"favicon.png: {a/1024:.0f} KB -> {d/1024:.0f} KB")

print(f"\nWebP recomprimidos: {total_antes/1048576:.1f} MB -> {total_despues/1048576:.1f} MB")
