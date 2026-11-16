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
const hf = media.homeFeature;
if (hf?.src) checkFile("data/media.ts homeFeature.src", hf.src, "video");
if (hf?.poster) checkFile("data/media.ts homeFeature.poster", hf.poster, "image");

// --- announcements ----------------------------------------------------------
// Expired items only print a notice: time passing must never fail the gate.
const { announcements } = await load("announcements");
const annIds = new Set<string>();
const notices: string[] = [];
const parseDate = (w: string, field: string, v: unknown): number | null => {
  if (v === undefined) return null;
  const t = typeof v === "string" ? Date.parse(v) : NaN;
  if (Number.isNaN(t)) { fail(w, `"${field}" is not a valid date (use e.g. "2026-11-19T21:00:00-07:00")`); return null; }
  return t;
};
for (const [i, a] of announcements.entries()) {
  const w = `data/announcements.ts #${i + 1} (${a.id ?? "no id"})`;
  if (!nonEmpty(a.id)) fail(w, '"id" is empty');
  else if (annIds.has(a.id)) fail(w, `id "${a.id}" is used twice`);
  annIds.add(a.id);
  if (a.kind !== "event" && a.kind !== "news") fail(w, 'kind must be "event" or "news"');
  if (!nonEmpty(a.title)) fail(w, '"title" is empty');
  if (a.body !== undefined && !nonEmpty(a.body)) fail(w, '"body" is set but empty; remove it or fill it in');
  const start = parseDate(w, "startsAt", a.startsAt);
  const end = parseDate(w, "endsAt", a.endsAt);
  const exp = parseDate(w, "expiresAt", a.expiresAt);
  if (start !== null && end !== null && end <= start) fail(w, "endsAt must be after startsAt");
  if (a.link !== undefined) {
    if (!nonEmpty(a.link?.label)) fail(w, 'link needs a non-empty "label"');
    if (!/^https:\/\//.test(a.link?.href ?? "")) fail(w, "link href must start with https://");
  }
  if (a.details !== undefined && (!Array.isArray(a.details) || a.details.some((d: unknown) => !nonEmpty(d))))
    fail(w, '"details" must be a list of non-empty text lines');
  if (a.image !== undefined) {
    if (!String(a.image).startsWith("/images/announcements/")) fail(w, "image must be under /images/announcements/");
    checkFile(`${w} image`, a.image, "image");
  }
  const last = a.kind === "event" ? end : exp;
  if (last !== null && last <= Date.now())
    notices.push(`notice: announcement "${a.id}" has expired and is hidden on the site; you can remove it from data/announcements.ts`);
}
for (const n of notices) console.log(n);

const { socials } = await load("socials");
const platforms = new Set<string>();
for (const s of socials) {
  const w = `data/socials.ts (${s.platform})`;
  if (platforms.has(s.platform)) fail(w, "platform listed twice");
  platforms.add(s.platform);
  if (!/^https:\/\//.test(s.url ?? "")) fail(w, "url must start with https://");
  if (!existsExact(s.qr ?? "")) fail(w, `QR image not found at public${s.qr}`);
}

const { instagram } = await load("instagram");
if (!Array.isArray(instagram.posts)) fail("data/instagram.ts", "posts must be a list of URLs");
else for (const [i, u] of instagram.posts.entries()) {
  if (typeof u !== "string" || !/^https:\/\/www\.instagram\.com\/(p|reel)\/[A-Za-z0-9_-]+\/$/.test(u))
    fail(`data/instagram.ts post #${i + 1}`, `"${u}" must look like https://www.instagram.com/p/<id>/ or https://www.instagram.com/reel/<id>/ (no extra ?text, and keep the final slash)`);
}

const { trendingItems } = await load("trendingItems");
const tIds = new Set<string>();
for (const [i, t] of trendingItems.entries()) {
  const w = `data/trendingItems.ts #${i + 1} (${t.id ?? "no id"})`;
  if (!nonEmpty(t.id)) fail(w, '"id" is empty');
  else if (tIds.has(t.id)) fail(w, `id "${t.id}" is used twice`);
  tIds.add(t.id);
  if (!nonEmpty(t.title)) fail(w, '"title" is empty');
  if (!nonEmpty(t.alt)) fail(w, '"alt" is empty (describe the flyer for screen readers)');
  checkFile(`${w} image`, t.image, "image");
  if (Number.isNaN(Date.parse(t.expiresAt))) fail(w, '"expiresAt" is not a valid date (use e.g. "2026-11-20T12:00:00-07:00")');
  if (t.link !== undefined && (!nonEmpty(t.link?.label) || !/^https:\/\//.test(t.link?.href ?? "")))
    fail(w, 'link needs a "label" and an href starting with https://');
}

if (errors.length) {
  console.error(`\nContent check failed (${errors.length}):\n` + errors.map((e) => `  - ${e}`).join("\n") + "\n");
  process.exit(1);
}
console.log(`content: ok (${pastProjects.length} past project(s), ${founders.length} founder(s), ${socials.length} social link(s), ${announcements.length} announcement(s))`);
