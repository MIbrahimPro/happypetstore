#!/usr/bin/env node
/* Runtime accessibility audit: axe-core over every route via puppeteer-core.
 * Usage: node scripts/audit-axe.mjs [baseURL]
 * Needs the dev server running on :3210 (or pass a base URL).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://localhost:3210";
const CHROME =
  process.env.CHROME_PATH ??
  "/home/mibrahimpro/.cache/puppeteer/chrome/linux-150.0.7871.24/chrome-linux64/chrome";

const ROUTES = ["/", "/shop", "/adopt", "/clinic", "/about", "/cart", "/admin", "/admin/login"];

const axeSource = readFileSync(
  fileURLToPath(new URL("../node_modules/axe-core/axe.min.js", import.meta.url)),
  "utf8"
);

const browser = await puppeteer.launch({
  headless: true,
  executablePath: CHROME,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

let total = 0, contrastTotal = 0;
const summary = [];

for (const route of ROUTES) {
  try {
    await page.goto(BASE + route, { waitUntil: "networkidle2", timeout: 60000 });
  } catch {
    await page.goto(BASE + route, { waitUntil: "load", timeout: 60000 });
  }
  await page.evaluate(axeSource);
  const results = await page.evaluate(() =>
    window.axe.run(document, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] },
    })
  );
  const contrast = results.violations.filter((v) => v.id === "color-contrast");
  const others = results.violations.filter((v) => v.id !== "color-contrast");
  const contrastNodes = contrast.reduce((n, v) => n + v.nodes.length, 0);
  const otherNodes = others.reduce((n, v) => n + v.nodes.length, 0);
  contrastTotal += contrastNodes;
  total += contrastNodes + otherNodes;
  summary.push({ route, contrast: contrastNodes, other: otherNodes });

  for (const v of contrast) {
    for (const n of v.nodes.slice(0, 6)) {
      console.log(`\n[contrast] ${route}`);
      console.log(`  ${n.target.join(" ")}`);
      console.log(`  ${n.failureSummary.split("\n").slice(1).join(" | ").slice(0, 220)}`);
    }
  }
  for (const v of others) {
    for (const n of v.nodes.slice(0, 4)) {
      console.log(`\n[${v.id}] ${route}`);
      console.log(`  ${n.target.join(" ").slice(0, 160)}`);
    }
  }
}

console.log("\n=== axe-core summary (wcag2a/2aa/21a/21aa) ===");
for (const s of summary) console.log(`${s.route.padEnd(16)} contrast: ${s.contrast}   other: ${s.other}`);
console.log(`TOTAL violations: ${total} (${contrastTotal} color-contrast)`);

await browser.close();
process.exit(0);
