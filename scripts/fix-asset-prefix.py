#!/usr/bin/env python3
"""One-off: prefix raw <img> srcs with asset() for subpath deployments."""
import re, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / "website" / "src"
ROOT = pathlib.Path("/home/mibrahimpro/Documents/pets/website/src")

STATIC = [
    "components/Logo.tsx",
    "components/Wordmark.tsx",
    "app/(store)/about/page.tsx",
    "app/(store)/clinic/page.tsx",
    "app/(store)/page.tsx",
]
DYNAMIC = [
    "app/(store)/adopt/page.tsx",
    "components/ProductCard.tsx",
    "components/SlideGrid.tsx",
]

IMPORT = 'import { asset } from "@/lib/base";'

def add_import(text: str) -> str:
    if 'from "@/lib/base"' in text:
        return text
    if text.startswith('"use client";'):
        return text.replace('"use client";', '"use client";\n' + IMPORT, 1)
    return IMPORT + "\n" + text

for rel in STATIC + DYNAMIC:
    p = ROOT / rel
    t = p.read_text()
    orig = t
    # static string srcs: src="/brand/..." or src="/images/..."
    t = re.sub(r'src="(/(?:brand|images)/[^"]*)"', r'src={asset("\1")}', t)
    # dynamic identifier srcs: src={CAT_IMG} src={DOG_IMG} src={p.image} src={i.image} src={img.src}
    t = re.sub(r'src=\{(CAT_IMG|DOG_IMG|p\.image|i\.image|img\.src|DOG_IMG)\}(?!\})', r'src={asset(\1)}', t)
    if t != orig:
        t = add_import(t)
        p.write_text(t)
        print("patched", rel)
    else:
        print("no-change", rel)
