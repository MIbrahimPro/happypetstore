# Happy Tails social media templates

Fifteen standing post templates, one per post type. Each file is a complete 1080 by 1080
design built on the soft brand system in `/branding` and the traced logo art in
`/website/public/brand/`. No two templates share a layout.

## How to use

1. Open any template in Chrome or Edge. It renders at exactly 1080x1080.
2. Swap the text, price or photo. Photo paths point into `../website/public/images/`.
3. Export: Chrome menu, "More tools", "Developer tools", "Capture screenshot" on the `.post`
   node, or run the headless command below.

```bash
# headless export (puppeteer chrome or any Chrome)
chrome --headless=new --screenshot=post.png --window-size=1080,1080 \
  --hide-scrollbars "file:///path/to/social-media-posts/01-new-stock-receipt.html"
```

## The fifteen

| # | File | Post type | Layout idea |
|---|------|-----------|-------------|
| 01 | 01-new-stock-receipt.html | New stock | White card rows, amber price pills, FRESH badge |
| 02 | 02-weekend-deal-price-slash.html | Weekend deal | Night fur, struck price, tilted photo |
| 03 | 03-kitten-of-the-week-window-card.html | Animal of the week | Big polaroid, script name, fact pills |
| 04 | 04-24-7-night-shift.html | 24/7 statement | Rounded schedule rows, one red emergency row |
| 05 | 05-food-shelf-stack.html | Food range | Shelf cards with photo, blurb, price |
| 06 | 06-vet-tip-chocolate.html | Vet education | Turf do / dashed do-not panels, red callout |
| 07 | 07-adoption-day.html | Event | Tilted photo strip on bone fur |
| 08 | 08-delivery-zones.html | Delivery info | Zone pills, turf same-day row |
| 09 | 09-grooming-before-after.html | Before / after | Two tilted mats, +1 WASH badge |
| 10 | 10-toys-under-thousand.html | Price roundup | Amber feature block, three white tiles |
| 11 | 11-customer-story.html | Review / story | Big Baloo quote, round avatar, paw row |
| 12 | 12-behind-the-counter.html | Trust / process | Full-bleed photo, night note card, cat stamp |
| 13 | 13-kitten-starter-checklist.html | Checklist | Turf panel, numbered pills with prices |
| 14 | 14-pharmacy-shelf-guide.html | Pharmacy | Medicine rows, turf price chips |
| 15 | 15-we-are-open.html | Holiday hours | Night fur, leaping cat ghost, open badge |

## Rules that keep them on brand

- Colors only from the six: night, bone, collar red, turf, tag amber, marble smoke.
- Everything round: cards 24 to 40px, photos 18px inside white mats, chips fully rounded.
- Shadows are soft and night-tinted. No hard offsets, no sharp corners, no gradients
  (the footer fades are legibility scrims, not decoration).
- Labels in Quicksand caps, headlines in Baloo 2, body in Nunito.
- The "Tails" script is the client's own lettering, traced; never retype it in a font.
- Red owns urgency only: emergency rows, CTAs, the 3 a.m. lines.
- Amber never sits on bone as text; amber carries night text instead.

Open `index.html` for a contact sheet of all fifteen.
