# Happy Tails social media templates

Fifteen standing post templates, one per post type. Each file is a complete 1080 by 1080
design built on the brand system in `/branding`. No two templates share a layout.

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
| 01 | 01-new-stock-receipt.html | New stock | Till receipt with dashed lines and FRESH stamp |
| 02 | 02-weekend-deal-price-slash.html | Weekend deal | Ink poster, giant mustard price, diagonal slash |
| 03 | 03-kitten-of-the-week-window-card.html | Animal of the week | Shop-window polaroid with fact card |
| 04 | 04-24-7-night-shift.html | 24/7 statement | Day-in-the-night schedule table on ink |
| 05 | 05-food-shelf-stack.html | Food range | Split editorial, price rows against a photo |
| 06 | 06-vet-tip-chocolate.html | Vet education | Numbered tip with do / do-not panels |
| 07 | 07-adoption-day.html | Event | Sign-red poster with paper detail box |
| 08 | 08-delivery-zones.html | Delivery info | Map pin photo with zones board |
| 09 | 09-grooming-before-after.html | Before / after | Twin tilted photos, center arrow |
| 10 | 10-toys-under-thousand.html | Price roundup | Three-toy grid on mustard, dashed frame |
| 11 | 11-customer-story.html | Review / story | Serif pull quote, avatar, star row |
| 12 | 12-behind-the-counter.html | Trust / process | Full-bleed photo, overlapping paper panel |
| 13 | 13-kitten-starter-checklist.html | Checklist | Numbered boxes on sage, halftone base |
| 14 | 14-pharmacy-shelf-guide.html | Pharmacy | Ruled prescription top, three medicine rows |
| 15 | 15-we-are-open.html | Holiday hours | Marquee sign with bulbs and YES, WE'RE OPEN |

## Rules that keep them on brand

- Colours only from the palette: paper, ink, sign red, mustard, bone, sage, slate, steel.
- Square corners everywhere. Borders are 3 to 10 px ink.
- Photos sit on white sticker mats with hard offset shadows, tilt under 2 degrees.
- Mono caps for labels and prices. Archivo Black for headlines. Serif only in template 11.
- No gradients, no exclamation marks, no em dashes, no rounded pills, ever.

Open `index.html` for a contact sheet of all fifteen.
