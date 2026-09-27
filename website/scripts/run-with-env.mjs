// Loads ../.env into process.env, then runs a command.
// Usage: node scripts/run-with-env.mjs <command> [args...]

import { readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", "..", ".env");

try {
  const raw = await readFile(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (m && process.env[m[1]] === undefined) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
} catch {
  console.error("Note: no ../.env found, relying on current environment.");
}

const [, , cmd, ...args] = process.argv;
if (!cmd) {
  console.error("Usage: node run-with-env.mjs <command> [args]");
  process.exit(1);
}
const r = spawnSync(cmd, args, { stdio: "inherit", env: process.env });
process.exit(r.status ?? 1);
