/**
 * Base path of the site, set at build time via NEXT_PUBLIC_BASE_PATH.
 * Empty locally; "/happy-tails" on projects.nyronic.com. Needed explicitly
 * for client-side fetch(), raw form actions and plain <img src>, none of
 * which Next prefixes automatically (only next/link and next/image are).
 */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string) {
  return BASE + path;
}
