import { createHash } from "node:crypto";

export function createSlug(input: string): string {
  const ascii = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  if (ascii.length > 0) return ascii.slice(0, 80);

  const digest = createHash("sha1").update(input).digest("hex").slice(0, 8);
  return `item-${digest}`;
}
