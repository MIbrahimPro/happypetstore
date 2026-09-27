#!/usr/bin/env python3
"""
Happy Tails soft-rebrand art pipeline.

Input : the two client-supplied images in ~/Downloads
Output: website/public/brand/ SVGs (traced, layered, palette-driven)
        + transparent PNG cutouts for social/print use + favicon

The dog logo is traced in LAYERS (night sticker border, bone fur/script,
collar red) so the SVG stays editable instead of one flat blob.
"""
import os
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi
import potrace

DL = "/home/mibrahimpro/Downloads"
OUT = "website/public/brand"
os.makedirs(OUT, exist_ok=True)

DOG = os.path.join(DL, "ChatGPT Image Sep 27, 2026, 07_13_44 PM.png")
CAT = os.path.join(DL, "Gemini_Generated_Image_39qc0639qc0639qc.jpeg")

NIGHT, BONE, RED = "#0B0B0C", "#FAF6EE", "#E12D20"


def trace_path(mask, smooth=1.4):
    """potrace a boolean mask into one SVG path string (d).
    potracer uses black-foreground semantics (it inverts input), so we feed
    255 - mask so that True pixels become 0 = black = traced."""
    data = (~mask).astype(np.uint8) * 255
    bmp = potrace.Bitmap(data)
    path = bmp.trace(turdsize=12, opttolerance=0.3, alphamax=smooth)
    d = ""
    for curve in path:
        s = curve.start_point
        d += f"M{s.x:.1f} {s.y:.1f}"
        for seg in curve:
            if seg.is_corner:
                c, e = seg.c, seg.end_point
                d += f"L{c.x:.1f} {c.y:.1f}L{e.x:.1f} {e.y:.1f}"
            else:
                c1, c2, e = seg.c1, seg.c2, seg.end_point
                d += f"C{c1.x:.1f} {c1.y:.1f} {c2.x:.1f} {c2.y:.1f} {e.x:.1f} {e.y:.1f}"
        d += "Z"
    return d


def grow(mask, px):
    """Dilate a boolean mask by px (3x3 max filter, px times)."""
    im = Image.fromarray((mask * 255).astype(np.uint8))
    for _ in range(px):
        im = im.filter(ImageFilter.MaxFilter(3))
    return np.array(im) > 128


def bbox_of(mask, pad=8):
    ys, xs = np.where(mask)
    y0, y1 = max(0, ys.min() - pad), min(mask.shape[0], ys.max() + pad)
    x0, x1 = max(0, xs.min() - pad), min(mask.shape[1], xs.max() + pad)
    return x0, y0, x1, y1


def svg_doc(paths, w, h, label=None):
    aria = f' role="img" aria-label="{label}"' if label else ' aria-hidden="true"'
    body = "".join(f'  <path fill="{c}" d="{d}"/>\n' for c, d in paths)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}"{aria}>\n'
            f"{body}</svg>\n")


def crop_img(im, sl):
    return im.convert("RGBA").crop((sl[1].start, sl[0].start, sl[1].stop, sl[0].stop))


def copy_alpha(im, mask):
    px = np.array(im.convert("RGBA"))
    px[..., 3] = (mask * 255).astype(np.uint8)
    return Image.fromarray(px)


# ============================================================ dog logo art ==
print("== dog art ==", flush=True)
dog = Image.open(DOG).convert("RGB")
W, H = dog.size
a = np.asarray(dog).astype(int)
R, G, B = a[..., 0], a[..., 1], a[..., 2]
lum = 0.299 * R + 0.587 * G + 0.114 * B
sat = a.max(axis=2) - a.min(axis=2)

bg = (lum < 45) & (sat < 60)
white = (lum > 170) & (sat < 60)
red = (R > 120) & (R - G > 60) & (R - B > 60)
print(f"   bg={bg.sum()} white={white.sum()} red={red.sum()}", flush=True)

art = grow(white | red, 2)          # close small gaps in the artwork
border = grow(art, 6) & ~art        # sticker outline ring

d_art = trace_path(art)
d_border = trace_path(border)
open(f"{OUT}/logo-lockup.svg", "w").write(
    svg_doc([(NIGHT, d_border), (RED, trace_path(red)), (BONE, d_art)], W, H,
            label="Happy Tails logo: dog head over script Tails"))
copy_alpha(dog, art).resize((1200, int(1200 * H / W)), Image.LANCZOS).save(f"{OUT}/logo-lockup.png")
print("   logo-lockup.svg/.png written", flush=True)

# dog head mark: seed on the component touching the left eighth (the head),
# then keep every component whose bbox intersects the head's bbox (the two
# collar strands overlap it in y; the T glyph sits ~100px lower, excluded).
art_lab, n = ndi.label(art)
sl_all = ndi.find_objects(art_lab)
seed = None
for i, slb in enumerate(sl_all, start=1):
    if slb is None:
        continue
    if int((art_lab[slb] == i).sum()) > 3000 and slb[1].start < int(W * 0.08):
        seed = i
        break
assert seed, "head component not found"
sys_, sxs = sl_all[seed - 1]
keep = np.zeros(n + 1, bool)
keep[seed] = True
for i, slb in enumerate(sl_all, start=1):
    if slb is None or i == seed or int((art_lab[slb] == i).sum()) < 1500:
        continue
    ys, xs = slb
    if xs.start < sxs.stop and xs.stop > sxs.start and ys.start < sys_.stop and ys.stop > sys_.start:
        keep[i] = True
head = grow(keep[art_lab], 2)
head_solid = grow(head, 6)                      # silhouette incl. sticker ring
head_border = head_solid & ~head
ink_bits = ndi.binary_fill_holes(head) & ~head  # true enclosed holes (eye, nose)
red_head = red & head

x0, y0, x1, y1 = bbox_of(head_border, 4)
sl = (slice(y0, y1), slice(x0, x1))
d_head = trace_path(head[sl])
d_solid = trace_path(head_solid[sl])
d_ink = trace_path(ink_bits[sl])
d_collar = trace_path(red_head[sl])
hw, hh = x1 - x0, y1 - y0

open(f"{OUT}/logo-mark.svg", "w").write(
    svg_doc([(NIGHT, d_solid), (BONE, d_head), (RED, d_collar), (NIGHT, d_ink)], hw, hh,
            label="Happy Tails dog mark"))
mark_cut = copy_alpha(dog, head_border)
mark_cut = mark_cut.crop((x0, y0, x1, y1))
mark_cut.save(f"{OUT}/logo-mark.png")
print(f"   logo-mark.svg/.png written ({hw}x{hh})", flush=True)

# favicon: hand-authored soft dog face (traced art is too fine for 16px)
open("website/src/app/icon.svg", "w").write(
'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Happy Tails">
  <rect width="64" height="64" rx="16" fill="#0B0B0C"/>
  <path d="M14 26 C12 16 18 12 24 16 L30 20 C34 18 38 18 42 20 L48 16 C54 12 60 16 58 26 C57 30 54 32 52 32 C54 36 55 40 53 44 C50 52 42 56 36 56 L36 50 L28 50 L28 56 C22 56 14 52 11 44 C9 40 10 36 12 32 C10 32 15 30 14 26 Z" fill="#FAF6EE"/>
  <rect x="18" y="48" width="28" height="6" rx="3" fill="#E12D20"/>
  <circle cx="24" cy="34" r="3.2" fill="#0B0B0C"/>
  <circle cx="40" cy="34" r="3.2" fill="#0B0B0C"/>
  <path d="M29 41 Q32 44 35 41" stroke="#0B0B0C" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <circle cx="31" cy="39.5" r="2.2" fill="#0B0B0C"/>
</svg>
''')
print("   icon.svg written", flush=True)

# ============================================================ leaping cat ===
print("== cat art ==")
cat = Image.open(CAT).convert("RGB")
CW, CH = cat.size
ca = np.asarray(cat).astype(int)
clum = 0.299 * ca[..., 0] + 0.587 * ca[..., 1] + 0.114 * ca[..., 2]

cat_ink = clum < 90                       # black line art + dark patches
cat_body = clum > 240                     # white fur; gray bg ~223 cut
# keep only the body blob (biggest bright component), kill stray bg patches
cat_lab, cn = ndi.label(cat_body)
if cn:
    sizes = ndi.sum(cat_body, cat_lab, range(1, cn + 1))
    cat_body = cat_lab == (int(np.argmax(sizes)) + 1)
# white fur *inside* the outline: fill holes of (ink|body) then subtract ink
solid = ndi.binary_fill_holes(cat_ink | cat_body)
cat_white = solid & ~cat_ink
cat_ink = grow(cat_ink, 1) & solid        # slight thicken so lines survive tracing
cat_ink = cat_ink & ~cat_white            # avoid double claim

cat_art = cat_ink | cat_white
x0, y0, x1, y1 = bbox_of(cat_art, 4)
slc = (slice(y0, y1), slice(x0, x1))
cat_ink_c = cat_ink[slc]
cat_white_c = cat_white[slc]
d_ink = trace_path(cat_ink_c, 1.5)
d_white = trace_path(cat_white_c, 1.5)
cw, ch = x1 - x0, y1 - y0

open(f"{OUT}/cat-leap.svg", "w").write(
    svg_doc([(NIGHT, d_ink), (BONE, d_white)], cw, ch, label="Leaping cat"))
open(f"{OUT}/cat-silhouette.svg", "w").write(
    svg_doc([("currentColor", d_ink)], cw, ch))
cat_cut = copy_alpha(cat, cat_art)
cat_cut.crop((x0, y0, x1, y1)).save(f"{OUT}/cat-leap.png")
print(f"   cat-leap.svg/.png + silhouette written ({cw}x{ch})")

# ==================================================== wordmark (hand-drawn) =
# "Happy" in Nunito 900 caps + "Tails" traced from the art's script letters.
# Script letters: the white glyphs right of the head (x > 45%) minus the tail.
script = white.copy()
script[:, : int(W * 0.45)] = False
# the long tail stroke crosses the text area; drop thin diagonal component by
# keeping only the biggest connected blob region via row-density: simplest is
# to use the full white right side (script + tail flourish reads as one word).
script = grow(script, 2)
sx0, sy0, sx1, sy1 = bbox_of(script, 4)
sls = (slice(sy0, sy1), slice(sx0, sx1))
d_script = trace_path(script[sls], 1.6)
sw, sh = sx1 - sx0, sy1 - sy0
open(f"{OUT}/script-tails.svg", "w").write(
    svg_doc([("currentColor", d_script)], sw, sh))
print(f"   script-tails.svg written ({sw}x{sh})", flush=True)

print("ALL DONE", flush=True)
