#!/usr/bin/env node
/* Static WCAG contrast audit for the soft-paws design system.
 *
 * Walks every .tsx file, reconstructs each element's effective text color,
 * background, font size and weight (tracking ancestors), resolves opacity
 * modifiers by alpha-blending over the effective background, and checks
 * WCAG 2.x ratios: 4.5:1 for normal text, 3:1 for large text (>=24px any
 * weight, or >=19px bold). Hover / group-hover / placeholder states are
 * checked against the hover-time background.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("../src", import.meta.url).pathname;

/* ---------------------------------------------------------------- palette */
const HEX = {
  night: "#0B0B0C",
  bone: "#FAF6EE",
  collar: "#E12D20",
  collardeep: "#B31F14",
  turf: "#2FA05A",
  amber: "#F2A83B",
  smoke: "#8A8378",
  white: "#FFFFFF",
  black: "#000000",
};
/* custom classes defined in globals.css */
const CLASS_BG = { softcard: "#FFFDF8", fur: HEX.bone, "fur-dark": HEX.night };
const CLASS_FG = { caption: HEX.smoke };
/* admin card surface used via bg-[#1b1a1b] */
const KNOWN_ARBITRARY = {};

/* ------------------------------------------------------------------ utils */
const clamp01 = (v) => Math.min(1, Math.max(0, v));
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}
function mix(fgHex, bgHex, alpha) {
  const a = hexToRgb(fgHex), b = hexToRgb(bgHex);
  return a.map((c, i) => Math.round(clamp01(alpha) * c + (1 - alpha) * b[i]));
}
function toHex(rgb) { return "#" + rgb.map((c) => c.toString(16).padStart(2, "0")).join(""); }
function luminance(hex) {
  const [r, g, b] = hexToRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(fg, bg) {
  const L1 = luminance(fg), L2 = luminance(bg);
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

/* ------------------------------------------------------- file collection */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx|ts)$/.test(name)) out.push(p);
  }
  return out;
}

/* ----------------------------------------------------------- JSX parsing */
/* scan a tag's raw text char-by-char, skipping quoted strings and braces  */
function readTag(src, start) {
  let i = start + 1, depth = 0, quote = null;
  while (i < src.length) {
    const c = src[i];
    if (quote) { if (c === "\\") i++; else if (c === quote) quote = null; }
    else if (c === '"' || c === "'" || c === "`") quote = c;
    else if (c === "{") depth++;
    else if (c === "}") depth--;
    else if (depth === 0 && c === ">") return src.slice(start, i + 1);
    i++;
  }
  return src.slice(start);
}
/* all string literals inside a className expression */
function classNameLiterals(raw) {
  const out = [];
  const re = /"([^"]*)"|'([^']*)'|`([^`]*)`/g;
  let m;
  while ((m = re.exec(raw))) out.push(m[1] ?? m[2] ?? m[3]);
  return out.join(" ").replace(/\$\{[^}]*\}/g, " ");
}
const VOID = new Set(["img", "input", "br", "hr", "meta", "link", "source", "area", "col", "embed", "track", "wbr"]);

const SIZE = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, "2xl": 24, "3xl": 30, "4xl": 36, "5xl": 48, "6xl": 60, "7xl": 72 };
const WEIGHT = { medium: 500, semibold: 600, bold: 700, extrabold: 800, black: 900 };

/* -------------------------------------------------------------- scanning */
const issues = [];
const checked = new Set();

function effective(stack) {
  /* stack: [{classes, line}] root..element; element = last entry */
  let fg = null, bg = null, size = null, weight = null;
  let hfg = null, hbg = null, phfg = null, ghfg = null, ghbg = null;
  for (const node of stack) {
    for (const cls of node.classes) {
      if (cls === "caption") fg = { base: CLASS_FG.caption, alpha: 1 };
      if (cls === "softcard" || cls === "fur" || cls === "fur-dark") bg = { base: CLASS_BG[cls], alpha: 1 };
      let m;
      if ((m = cls.match(/^(?:hover:)?text-(night|bone|collar|collardeep|turf|amber|smoke|white|black)(?:\/(\d+))?$/))) {
        const base = HEX[m[1]], alpha = m[2] ? +m[2] / 100 : 1;
        if (cls.startsWith("hover:")) hfg = { base, alpha };
        else fg = { base, alpha };
      } else if ((m = cls.match(/^text-\[(#[0-9a-fA-F]{3,8})\]$/))) {
        fg = { base: m[1], alpha: 1 };
      } else if ((m = cls.match(/^(?:hover:)?bg-(night|bone|collar|collardeep|turf|amber|smoke|white|black)(?:\/(\d+))?$/))) {
        const base = HEX[m[1]], alpha = m[2] ? +m[2] / 100 : 1;
        if (cls.startsWith("hover:")) hbg = { base, alpha };
        else bg = { base, alpha };
      } else if ((m = cls.match(/^(?:hover:)?bg-\[(#[0-9a-fA-F]{3,8})\]$/))) {
        if (cls.startsWith("hover:")) hbg = { base: m[1], alpha: 1 };
        else bg = { base: m[1], alpha: 1 };
      } else if ((m = cls.match(/^group-hover:text-(night|bone|collar|collardeep|turf|amber|smoke|white|black)(?:\/(\d+))?$/))) {
        ghfg = { base: HEX[m[1]], alpha: m[2] ? +m[2] / 100 : 1 };
      } else if ((m = cls.match(/^group-hover:bg-(night|bone|collar|collardeep|turf|amber|smoke|white|black)(?:\/(\d+))?$/))) {
        ghbg = { base: HEX[m[1]], alpha: m[2] ? +m[2] / 100 : 1 };
      } else if ((m = cls.match(/^placeholder:text-(night|bone|collar|collardeep|turf|amber|smoke|white|black)(?:\/(\d+))?$/))) {
        phfg = { base: HEX[m[1]], alpha: m[2] ? +m[2] / 100 : 1 };
      } else if ((m = cls.match(/^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)(?:$|[\s[])/)) || (m = cls.match(/^text-\[(\d+(?:\.\d+)?)(px|rem)\]$/))) {
        size = m[2] === "px" ? +m[1] : m[2] === "rem" ? +m[1] * 16 : SIZE[m[1]];
      } else if ((m = cls.match(/^font-(medium|semibold|bold|extrabold|black)$/))) {
        weight = WEIGHT[m[1]];
      }
    }
  }
  return { fg, bg, size, weight, hfg, hbg, phfg, ghfg, ghbg };
}

function blend(color, bg) {
  if (!color) return null;
  const bgHex = bg ?? HEX.white; // assume white if truly unknown
  return color.alpha >= 1 ? color.base : toHex(mix(color.base, bgHex, color.alpha));
}

function checkPair(ctx, fgHex, bgHex, size, weight, label, file, line, classes) {
  if (!fgHex || !bgHex) return;
  const r = ratio(fgHex, bgHex);
  const large = size >= 24 || (size >= 19 && (weight ?? 400) >= 700);
  const need = large ? 3 : 4.5;
  const key = `${fgHex}|${bgHex}|${need}|${label}`;
  if (checked.has(key)) return;
  checked.add(key);
  const pass = r >= need - 0.01;
  if (!pass) {
    issues.push({ file: relative(process.cwd(), file), line, label, fg: fgHex, bg: bgHex, ratio: +r.toFixed(2), need, size: size ?? "?", weight: weight ?? 400, classes });
  }
}

function scanFile(file) {
  const src = readFileSync(file, "utf8");
  const lineOf = (idx) => src.slice(0, idx).split("\n").length;
  const stack = []; // { tag, classes, line }
  let i = 0;
  while (i < src.length) {
    const lt = src.indexOf("<", i);
    if (lt === -1) break;
    const ch = src[lt + 1];
    if (ch === "/") {
      /* closing tag: pop until matching */
      const end = src.indexOf(">", lt);
      const tag = src.slice(lt + 2, end).trim().split(/[\s.]/)[0];
      for (let k = stack.length - 1; k >= 0; k--) if (stack[k].tag === tag) { stack.length = k; break; }
      i = end + 1;
      continue;
    }
    if (!/[A-Za-z>]/.test(ch ?? "")) { i = lt + 1; continue; }
    const raw = readTag(src, lt);
    const selfClose = raw.endsWith("/>");
    const tag = (raw.slice(1).match(/^[A-Za-z][A-Za-z0-9._-]*/) || ["div"])[0];
    const clsRaw = raw.match(/className\s*=\s*(\{|"|')/);
    let classes = [];
    if (clsRaw) {
      const start = lt + raw.indexOf("className");
      if (src[start + 10] === "{" || /className\s*=\s*\{/.test(raw)) {
        /* brace expression: find matching brace within raw */
        const expr = raw.slice(raw.indexOf("className") + 9);
        classes = classNameLiterals(expr).split(/\s+/).filter(Boolean);
      } else {
        const qm = raw.match(/className\s*=\s*"([^"]*)"/) || raw.match(/className\s*=\s*'([^']*)'/);
        classes = (qm?.[1] ?? "").split(/\s+/).filter(Boolean);
      }
    }
    const line = lineOf(lt);
    if (VOID.has(tag) || selfClose) {
      auditElement([...stack, { tag, classes, line }], file, line, classes.join(" "));
      i = lt + raw.length;
      continue;
    }
    auditElement([...stack, { tag, classes, line }], file, line, classes.join(" "));
    stack.push({ tag, classes, line });
    i = lt + raw.length;
  }
}

function auditElement(stack, file, line, classStr) {
  const e = effective(stack);
  const size = e.size ?? 16;
  /* default page bg: admin lives on night (admin layout), store on bone (html) */
  const defaultBg = /\/admin\//.test(file) ? HEX.night : HEX.bone;
  /* normal state */
  const bgNormalHex = blend(e.bg, defaultBg) ?? defaultBg;
  const fgNormal = blend(e.fg, bgNormalHex === "#FFFDF8" ? "#FFFDF8" : bgNormalHex);
  checkPair("normal", fgNormal, bgNormalHex, size, e.weight, "text", file, line, classStr);
  /* hover state */
  const hoverBgBase = e.hbg ?? e.bg;
  const hoverBgHex = hoverBgBase ? blend(hoverBgBase, defaultBg) : bgNormalHex;
  const hoverFg = blend(e.hfg ?? e.fg, hoverBgHex);
  if (e.hfg || e.hbg) checkPair("hover", hoverFg, hoverBgHex, size, e.weight, "hover:text", file, line, classStr);
  /* group-hover state */
  const ghBgHex = e.ghbg ? blend(e.ghbg, defaultBg) : hoverBgHex;
  if (e.ghfg) {
    const ghFg = blend(e.ghfg, ghBgHex);
    checkPair("group-hover", ghFg, ghBgHex, size, e.weight, "group-hover:text", file, line, classStr);
  }
  /* placeholder state */
  if (e.phfg) {
    const phFg = blend(e.phfg, bgNormalHex);
    checkPair("placeholder", phFg, bgNormalHex, size, e.weight, "placeholder", file, line, classStr);
  }
}

/* --------------------------------------------------------------- run all */
const files = walk(ROOT).filter((f) => !/\.d\.ts$/.test(f));
for (const f of files) scanFile(f);

/* globals.css known utilities */
{
  const r1 = ratio(HEX.smoke, HEX.bone);
  if (r1 < 4.5) issues.push({ file: "src/app/globals.css", line: 37, label: "text", fg: HEX.smoke, bg: HEX.bone, ratio: +r1.toFixed(2), need: 4.5, size: 12, weight: 400, classes: ".caption (smoke on bone)" });
}

issues.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
console.log(`\n=== WCAG contrast audit — ${issues.length} potential violation(s) across ${files.length} files ===\n`);
for (const it of issues) {
  console.log(`${it.file}:${it.line}  [${it.label}] ${it.ratio}:1 (need ${it.need})  fg ${it.fg} on bg ${it.bg}  ${it.size}px/${it.weight}  « ${String(it.classes).slice(0, 110)} »`);
}
if (!issues.length) console.log("All checked pairs pass.");
console.log("");
