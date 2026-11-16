// Content check: fails the build on mistakes that would break or blank a page.
// Run: npm run content:check   (Node 22.18+ runs .ts directly; no extra packages)
// Messages are written for non-developers: say what is wrong and where to fix it.
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = path.resolve(import.meta.dirname, "..");
const pub = path.join(root, "public");
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // photos: resize before uploading
const MAX_VIDEO_BYTES = 8 * 1024 * 1024; // videos: compress to H.264 .mp4
const errors: string[] = [];
const fail = (where: string, msg: string) => errors.push(`${where}: ${msg}`);

/** Exact-case existence check. Macs ignore case, the live server does not: "Guam/img.JPG" vs "guam/img.jpg". */
function existsExact(publicPath: string): boolean {
  if (!publicPath.startsWith("/")) return false;
  let dir = pub;
  for (const part of publicPath.split("/").filter(Boolean)) {
    let names: string[];
    try { names = readdirSync(dir); } catch { return false; }
    if (!names.includes(part)) return false;
    dir = path.join(dir, part);
  }
  return statSync(dir).isFile();
}

function checkFile(where: string, p: unknown, kind: "image" | "video") {
  if (typeof p !== "string" || p === "") return fail(where, "path is empty");
  if (!existsExact(p)) return fail(where, `file not found at public${p} (check the folder, spelling and upper/lower case)`);
  const size = statSync(path.join(pub, p)).size;
  if (kind === "video" && !/\.mp4$/i.test(p)) fail(where, "videos must be .mp4 (H.264); phone .MOV files will not play in most browsers");
  if (kind === "image" && size > MAX_IMAGE_BYTES) fail(where, `image is ${(size / 1048576).toFixed(1)} MB; resize it below 2 MB`);
  if (kind === "video" && size > MAX_VIDEO_BYTES) fail(where, `video is ${(size / 1048576).toFixed(1)} MB; compress it below 8 MB`);
}

const load = async (name: string) => import(pathToFileURL(path.join(root, "data", `${name}.ts`)).href);
const nonEmpty = (v: unknown) => typeof v === "string" && v.trim() !== "";

// --- past projects ---------------------------------------------------------
const { pastProjects } = await load("pastProjects");
const slugs = new Set<string>();
for (const [i, p] of pastProjects.entries()) {
  const w = `data/pastProjects.ts #${i + 1} (${p.location ?? "no location"})`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug ?? "")) fail(w, "slug must be lowercase letters, numbers and dashes, e.g. \"guam\"");
  if (slugs.has(p.slug)) fail(w, `slug "${p.slug}" is used twice`);
  slugs.add(p.slug);
  for (const f of ["location", "impacted", "description"]) if (!nonEmpty(p[f])) fail(w, `"${f}" is empty`);
  const [lng, lat] = p.coordinates ?? [];
  if (!(Number.isFinite(lng) && Number.isFinite(lat) && Math.abs(lng) <= 180 && Math.abs(lat) <= 90))
    fail(w, "coordinates must be [longitude, latitude], e.g. [144.79, 13.44]");
  if (!(Number.isFinite(p.amountRaised) && p.amountRaised >= 0)) fail(w, "amountRaised must be a number, 0 or more");
  if (!Array.isArray(p.photos) || p.photos.length === 0) fail(w, "add at least one photo");
  else p.photos.forEach((ph: string, j: number) => checkFile(`${w} photo ${j + 1}`, ph, "image"));
  if (p.video) checkFile(`${w} video`, p.video, "video");
}

// --- current project -------------------------------------------------------
const { currentProject: c } = await load("currentProject");
if (c.active) {
  for (const f of ["name", "location", "need", "who", "when"]) {
    if (!nonEmpty(c[f])) fail("data/currentProject.ts", `active is true but "${f}" is empty`);
  }
  if (/to be announced|our current project/i.test(`${c.name} ${c.location}`))
    fail("data/currentProject.ts", "active is true but name/location still say the placeholder text");
}
if (c.image) checkFile("data/currentProject.ts image", c.image, "image");

// --- founders, media, socials ----------------------------------------------
const { founders } = await load("founders");
const ids = new Set<string>();
for (const f of founders) {
  const w = `data/founders.ts (${f.name})`;
  if (ids.has(f.id)) fail(w, `id "${f.id}" is used twice`);
  ids.add(f.id);
  if (!nonEmpty(f.name) || !nonEmpty(f.role)) fail(w, "name and role are required");
  if (f.photo) checkFile(`${w} photo`, f.photo, "image");
}
const { media, images } = await load("media");
for (const [k, v] of Object.entries<string | null>(media.help)) if (v) checkFile(`data/media.ts help.${k}`, v, "video");
for (const [k, v] of Object.entries<string | null>(images)) if (v) checkFile(`data/media.ts images.${k}`, v, "image");
const { socials } = await load("socials");
const platforms = new Set<string>();
for (const s of socials) {
  const w = `data/socials.ts (${s.platform})`;
  if (platforms.has(s.platform)) fail(w, "platform listed twice");
  platforms.add(s.platform);
  if (!/^https:\/\//.test(s.url ?? "")) fail(w, "url must start with https://");
  if (!existsExact(s.qr ?? "")) fail(w, `QR image not found at public${s.qr}`);
}

if (errors.length) {
  console.error(`\nContent check failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join("\n") + "\n");
  process.exit(1);
}
console.log(`content: ok (${pastProjects.length} past project(s), ${founders.length} founder(s), ${socials.length} social link(s))`);
