import { createHash } from "node:crypto";

export function fingerprintRawItem(sourceId: string, title: string, url: string): string {
  return createHash("sha256")
    .update(`${sourceId}|${title.trim().toLowerCase()}|${url.trim().toLowerCase()}`)
    .digest("hex");
}
