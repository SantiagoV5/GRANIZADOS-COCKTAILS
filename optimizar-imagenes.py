from pathlib import Path
from PIL import Image

MAX = 1200      # lado mayor en px (solo reduce, nunca agranda)
CALIDAD = 82
base = Path("src/imports")

pngs = sorted(p for p in base.rglob("*") if p.suffix.lower() == ".png")
antes = despues = 0

for p in pngs:
    out = p.with_suffix(".webp")
    if out.exists():
        print(f"SALTADO (ya existe .webp): {p.name}")
        continue
    img = Image.open(p)
    dims = img.size
    if img.mode not in ("RGB", "RGBA"):
        img = img.convert("RGBA")
    img.thumbnail((MAX, MAX), Image.LANCZOS)
    img.save(out, "WEBP", quality=CALIDAD, method=6)
    a, d = p.stat().st_size, out.stat().st_size
    antes += a
    despues += d
    print(f"{p.name}: {dims} {a/1024:.0f} KB -> {img.size} {d/1024:.0f} KB")

print(f"\nTotal: {antes/1048576:.1f} MB -> {despues/1048576:.1f} MB")
