// Downloads free-license photos from Pexels and Pixabay into public/images.
// Run: node scripts/fetch-images.mjs
// Keys come from the environment (see .env.example).

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "public", "images");

const PEXELS_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_KEY = process.env.PIXABAY_API_KEY;

if (!PEXELS_KEY && !PIXABAY_KEY) {
  console.error("Set PEXELS_API_KEY and/or PIXABAY_API_KEY in the environment first.");
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function grab(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error(`Suspiciously small file (${buf.length} bytes)`);
  await writeFile(dest, buf);
  return buf.length;
}

// Pexels: reliable, high quality, clear license.
async function pexels(query, count = 4) {
  if (!PEXELS_KEY) return [];
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count + 4}&orientation=landscape`,
    { headers: { Authorization: PEXELS_KEY } }
  );
  if (!res.ok) {
    console.error(`Pexels ${query}: HTTP ${res.status}`);
    return [];
  }
  const data = await res.json();
  return (data.photos ?? []).slice(0, count).map((p) => ({
    url: p.src?.large2x || p.src?.large,
    credit: p.photographer,
  }));
}

// Pixabay: broad coverage for odd queries like dewormer bottles.
async function pixabay(query, count = 3) {
  if (!PIXABAY_KEY) return [];
  const res = await fetch(
    `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&per_page=${count + 6}&image_type=photo&orientation=landscape&safesearch=true`
  );
  if (!res.ok) {
    console.error(`Pixabay ${query}: HTTP ${res.status}`);
    return [];
  }
  const data = await res.json();
  return (data.hits ?? []).slice(0, count).map((h) => ({
    url: h.largeImageURL,
    credit: h.user,
  }));
}

const JOBS = [
  // shop / ambience
  ["shop/hero-shelf.jpg", [pexels("pet shop shelves pet store", 3), pixabay("pet shop", 2)]],
  ["shop/storefront.jpg", [pexels("pet store front shop night", 3), pixabay("pet store shop", 2)]],
  ["shop/clinic-counter.jpg", [pexels("veterinarian clinic desk", 3), pixabay("veterinary clinic", 2)]],

  // pets
  ["pets/kitten-1.jpg", [pexels("persian kitten", 3), pixabay("persian kitten", 2)]],
  ["pets/kitten-2.jpg", [pexels("two kittens", 3), pixabay("kitten pair", 2)]],
  ["pets/puppy-1.jpg", [pexels("labrador puppy", 3), pixabay("labrador puppy", 2)]],
  ["pets/puppy-2.jpg", [pexels("german shepherd puppy", 3), pixabay("german shepherd puppy", 2)]],

  // food
  ["food/dog-food-1.jpg", [pexels("dog food bowl kibble", 3), pixabay("dog food", 2)]],
  ["food/dog-food-2.jpg", [pexels("dry dog food kibble", 3), pixabay("dog kibble", 2)]],
  ["food/dog-food-3.jpg", [pexels("dog food bag", 3), pixabay("dog food bag", 2)]],
  ["food/dog-food-4.jpg", [pexels("dog eating food bowl", 3), pixabay("dog eating", 2)]],
  ["food/cat-food-1.jpg", [pexels("cat food bowl", 3), pixabay("cat food", 2)]],
  ["food/cat-food-2.jpg", [pexels("cat eating food", 3), pixabay("cat eating", 2)]],
  ["food/cat-food-3.jpg", [pexels("kitten eating", 3), pixabay("kitten food", 2)]],
  ["food/cat-food-4.jpg", [pexels("dry cat food", 3), pixabay("cat kibble", 2)]],

  // litter
  ["litter/cat-litter-1.jpg", [pixabay("cat litter", 3), pexels("cat litter box", 3)]],
  ["litter/cat-litter-2.jpg", [pixabay("cat sand", 3), pexels("kitten litter", 2)]],

  // toys
  ["toys/dog-toy-1.jpg", [pexels("dog rope toy", 3), pixabay("dog rope toy", 2)]],
  ["toys/dog-toy-2.jpg", [pexels("dog chew toy", 3), pixabay("dog toy", 2)]],
  ["toys/dog-toy-3.jpg", [pexels("dog playing toy", 3), pixabay("dog playing", 2)]],
  ["toys/cat-toy-1.jpg", [pexels("cat toy ball", 3), pixabay("cat ball", 2)]],
  ["toys/cat-toy-2.jpg", [pexels("cat playing feather toy", 3), pixabay("cat toy", 2)]],
  ["toys/cat-toy-3.jpg", [pexels("cat toy mouse", 3), pixabay("cat toy mouse", 2)]],

  // accessories
  ["accessories/dog-leash-1.jpg", [pexels("dog leash", 3), pixabay("dog leash", 2)]],
  ["accessories/dog-collar-1.jpg", [pexels("dog collar", 3), pixabay("dog collar", 2)]],
  ["accessories/pet-bowl-1.jpg", [pexels("pet bowl water", 3), pixabay("pet bowl", 2)]],
  ["accessories/pet-carrier-1.jpg", [pexels("pet carrier", 3), pixabay("pet carrier", 2)]],
  ["accessories/pet-bed-1.jpg", [pexels("dog bed", 3), pixabay("dog bed", 2)]],
  ["accessories/cat-scratcher-1.jpg", [pexels("cat scratching post", 3), pixabay("cat scratcher", 2)]],

  // grooming
  ["grooming/slicker-brush-1.jpg", [pexels("pet brush grooming", 3), pixabay("dog brush", 2)]],
  ["grooming/nail-clipper-1.jpg", [pixabay("nail clipper", 3), pexels("pet nails", 2)]],
  ["grooming/shampoo-1.jpg", [pexels("dog bath shampoo", 3), pixabay("dog shampoo", 2)]],
  ["grooming/brush-1.jpg", [pexels("cat brushing", 3), pixabay("cat brush", 2)]],

  // pharmacy
  ["pharmacy/dewormer-1.jpg", [pixabay("medicine bottle", 3), pexels("medicine bottle", 2)]],
  ["pharmacy/spoton-1.jpg", [pixabay("pipette medicine", 3), pexels("medicine dropper", 2)]],
  ["pharmacy/supplement-1.jpg", [pixabay("syrup bottle", 3), pexels("syrup bottle", 2)]],
  ["pharmacy/paste-1.jpg", [pixabay("ointment tube", 3), pexels("ointment tube", 2)]],
  ["pharmacy/powder-1.jpg", [pixabay("medicine powder", 3), pexels("powder medicine", 2)]],
  ["pharmacy/spray-1.jpg", [pixabay("spray bottle", 3), pexels("spray bottle", 2)]],
];

let okCount = 0;
let failCount = 0;

for (const [dest, providers] of JOBS) {
  const outPath = path.join(OUT, dest);
  await mkdir(path.dirname(outPath), { recursive: true });
  let done = false;
  for (const provider of providers) {
    if (done) break;
    try {
      const candidates = await provider;
      for (const c of candidates) {
        try {
          const size = await grab(c.url, outPath);
          console.log(`ok  ${dest}  (${Math.round(size / 1024)} KB, photo by ${c.credit})`);
          okCount++;
          done = true;
          break;
        } catch (e) {
          // try the next candidate
        }
      }
    } catch (e) {
      // provider failed entirely; fall through
    }
    await sleep(150);
  }
  if (!done) {
    console.error(`MISS ${dest}`);
    failCount++;
  }
}

console.log(`\nDone. ${okCount} images downloaded, ${failCount} missing.`);
process.exit(0);
